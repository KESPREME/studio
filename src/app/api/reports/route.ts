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
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      throw error;
    }

    const reportsWithUrls = reports.map(report => {
        let publicUrl = undefined;
        if (report.imageUrl) {
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

    const { data, error } = await supabaseAdmin
        .from('reports')
        .insert(newReportData)
        .select()
        .single();
    
    if (error) {
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
