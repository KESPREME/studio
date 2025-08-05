// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendNewReportSms, sendMassAlertSms } from '@/lib/sms';

// Schema for creating a new report
const reportSchema = z.object({
  description: z.string().min(10).max(500),
  urgency: z.enum(["Low", "Moderate", "High"]),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().optional(),
  reportedBy: z.string().email(),
});

// Schema for querying reports
const QueryReportsSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(50),
  offset: z.number().min(0).optional().default(0),
  urgency: z.enum(['Low', 'Moderate', 'High']).optional(),
  status: z.enum(['New', 'In Progress', 'Resolved']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bounds: z.object({
    north: z.number(),
    south: z.number(),
    east: z.number(),
    west: z.number(),
  }).optional(),
});

// Helper function for geographic calculations
const getBoundingBox = (latitude: number, longitude: number, distanceKm: number) => {
  const latRadian = latitude * (Math.PI / 180);
  const degLat = distanceKm / 111.132;
  const degLon = distanceKm / (111.320 * Math.cos(latRadian));

  return {
    minLat: latitude - degLat,
    maxLat: latitude + degLat,
    minLon: longitude - degLon,
    maxLon: longitude + degLon,
  };
};

// GET - Fetch reports with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const queryParams = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      urgency: searchParams.get('urgency') || undefined,
      status: searchParams.get('status') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      bounds: searchParams.get('bounds') ? JSON.parse(searchParams.get('bounds')!) : undefined,
    };

    const validation = QueryReportsSchema.safeParse(queryParams);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { limit, offset, urgency, status, startDate, endDate, bounds } = validation.data;

    // Check if this is a simple request (no advanced filtering)
    const hasQueryParams = urgency || status || startDate || endDate || bounds || limit !== 50 || offset !== 0;

    if (!hasQueryParams) {
      // Simple GET request - return all reports for backward compatibility
      const { data: reports, error } = await supabaseAdmin
        .from('reports')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Database error fetching reports:', error);
        return NextResponse.json(
          { error: 'Failed to fetch reports' },
          { status: 500 }
        );
      }

      // Process image URLs
      const reportsWithUrls = (reports || []).map(report => {
        let publicUrl = undefined;
        if (report.imageUrl) {
          const { data } = supabaseAdmin.storage.from('images').getPublicUrl(report.imageUrl);
          publicUrl = data.publicUrl;
        }
        return {
          ...report,
          imageUrl: publicUrl,
        };
      });

      return NextResponse.json(reportsWithUrls);
    }

    // Advanced filtering request
    let query = supabaseAdmin
      .from('reports')
      .select('*')
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (urgency) {
      query = query.eq('urgency', urgency);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (startDate) {
      query = query.gte('createdAt', startDate);
    }

    if (endDate) {
      query = query.lte('createdAt', endDate);
    }

    if (bounds) {
      query = query
        .gte('latitude', bounds.south)
        .lte('latitude', bounds.north)
        .gte('longitude', bounds.west)
        .lte('longitude', bounds.east);
    }

    const { data: reports, error, count } = await query;

    if (error) {
      console.error('Database error fetching reports:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reports' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reports: reports || [],
      total: count || 0,
      limit,
      offset,
    });

  } catch (error) {
    console.error('Reports GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new report
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = reportSchema.safeParse(body);

    if (!validation.success) {
      console.error('Validation Errors:', validation.error.issues);
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.issues }, { status: 400 });
    }

    const { reportedBy, ...restOfData } = validation.data;

    const newReportData = {
      ...restOfData,
      reportedBy,
      status: 'New' as const,
    };

    // Use the admin client for inserting reports
    const { data, error } = await supabaseAdmin
        .from('reports')
        .insert(newReportData)
        .select()
        .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    try {
      await sendNewReportSms(validation.data);
    } catch (smsError: any) {
      console.error("Admin SMS sending failed, but report was created. Error:", smsError.message);
    }

    if (validation.data.urgency === 'High') {
      try {
        const { latitude, longitude } = validation.data;
        const radiusKm = 10;
        const box = getBoundingBox(latitude, longitude, radiusKm);

        // Use admin client to query all reports for mass alert, bypassing RLS
        const { data: nearbyReports, error: nearbyError } = await supabaseAdmin
            .from('reports')
            .select('reportedBy, longitude')
            .gte('latitude', box.minLat)
            .lte('latitude', box.maxLat);

        if(nearbyError) throw nearbyError;

        const nearbyReporters: string[] = [];
        const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

        if (nearbyReports) {
          nearbyReports.forEach((report: { reportedBy: string, longitude: number }) => {
            if (report.longitude >= box.minLon && report.longitude <= box.maxLon) {
               if (adminPhoneNumber) {
                  nearbyReporters.push(adminPhoneNumber);
               }
            }
          });
        }

        const uniquePhoneNumbers = [...new Set(nearbyReporters)];
        if (uniquePhoneNumbers.length > 0) {
          await sendMassAlertSms(validation.data, uniquePhoneNumbers);
        } else {
          console.log("No nearby reporters found to send mass alert.");
        }

      } catch (massAlertError: any) {
        console.error("Mass alert SMS process failed. Error:", massAlertError.message);
      }
    }

    return NextResponse.json({ message: 'Report created', reportId: data.id }, { status: 201 });
  } catch (e: any) {
    console.error('Supabase POST Error:', e);
    if (e.message?.includes('too large')) {
       return NextResponse.json({ message: 'Request body too large. Please upload a smaller image file.' }, { status: 413 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}
