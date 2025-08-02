// src/app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { sendNewReportSms, sendMassAlertSms } from '@/lib/sms';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-server';

const reportSchema = z.object({
  description: z.string().min(10).max(500),
  urgency: z.enum(["Low", "Moderate", "High"]),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().optional(),
  reportedBy: z.string().email(),
});

export async function GET() {
  try {
    // This is a public route, so we use the public client.
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      // This will throw and be caught by the catch block, returning a 500 error.
      throw error;
    }

    const reportsWithUrls = reports.map(report => {
        let publicUrl = undefined;
        if (report.imageUrl) {
            // We can use the public client here as well, as the bucket is public.
            const { data } = supabase.storage.from('images').getPublicUrl(report.imageUrl);
            publicUrl = data.publicUrl;
        }
        return {
            ...report,
            imageUrl: publicUrl,
        };
    });


    return NextResponse.json(reportsWithUrls);
  } catch (e: any)
  {
    console.error('API GET Error:', e);
    // Provide a more specific error message if the API key is invalid.
    if (e.message?.includes('authentication failed')) {
        return NextResponse.json({ message: 'Internal Server Error', error: 'Invalid Supabase API key or URL.' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}

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

    // Use the ADMIN client to insert data, bypassing RLS for this trusted server-side operation.
    const { data, error } = await supabaseAdmin
        .from('reports')
        .insert(newReportData)
        .select()
        .single();
    
    if (error) {
      throw error;
    }
    
    // Asynchronously send SMS notifications without blocking the response.
    // These functions now handle their own errors internally.
    await sendNewReportSms(validation.data);

    if (validation.data.urgency === 'High') {
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
                  // In a real app, you would look up the user's phone number.
                  // For this demo, we use the admin's number as a placeholder.
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
