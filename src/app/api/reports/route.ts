// src/app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { sendNewReportSms, sendMassAlertSms } from '@/lib/sms';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-server';
import { generateSafetyTips } from '@/src/ai/flows/generate-safety-tips';
import { Report } from '@/lib/types';

const reportSchema = z.object({
  description: z.string().min(10).max(500),
  urgency: z.enum(["Low", "Moderate", "High"]),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().optional(),
  reportedBy: z.string().email(),
  phone: z.string().optional(), // Added phone number
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

    const reportsWithUrls = reports.map((report: Report) => {
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
    
    const { reportedBy, phone, ...restOfData } = validation.data;
    
    const newReportData = {
      ...restOfData,
      reportedBy,
      phone, // Store phone number with the report
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

    // This is a fire-and-forget call for notifications.
    // The main API responds quickly to the client, while notifications are processed in the background.
    (async () => {
      let safetyTips: string | undefined;
      try {
        const tipsOutput = await generateSafetyTips({ description: validation.data.description });
        safetyTips = tipsOutput.tips;
      } catch (aiError) {
        console.error("Failed to generate safety tips, sending SMS without them.", aiError);
      }
      
      // Send SMS to admin with safety tips
      sendNewReportSms(validation.data, safetyTips);

      // If high urgency, send mass alert to nearby users
      if (validation.data.urgency === 'High') {
        try {
          const { latitude, longitude } = validation.data;
          const radiusKm = 10;
          const box = getBoundingBox(latitude, longitude, radiusKm);
          
          const { data: nearbyUsers, error: nearbyError } = await supabaseAdmin
              .from('users') // Query users table for phone numbers
              .select('phone')
              .not('phone', 'is', null);

          if (nearbyError) {
              console.error("Error fetching nearby users for mass alert:", nearbyError);
              return;
          }

          // Note: Filtering by location on a large user table would be inefficient.
          // In a real-world scenario, you'd use a geospatial index (e.g., PostGIS)
          // or a more optimized query. For this demo, we'll alert all users with phone numbers.
          const nearbyPhoneNumbers: string[] = nearbyUsers
              ? nearbyUsers.map((user: { phone: string }) => user.phone)
              : [];
          
          const uniquePhoneNumbers = [...new Set(nearbyPhoneNumbers)];
          if (uniquePhoneNumbers.length > 0) {
            sendMassAlertSms(validation.data, uniquePhoneNumbers, safetyTips);
          } else {
            console.log("No nearby users found to send mass alert.");
          }
        } catch (massAlertError) {
            console.error("Mass alert process failed:", massAlertError);
        }
      }
    })();


    return NextResponse.json({ message: 'Report created', reportId: data.id }, { status: 201 });
  } catch (e: any) {
    console.error('Supabase POST Error:', e);
    if (e.message?.includes('too large')) {
       return NextResponse.json({ message: 'Request body too large. Please upload a smaller image file.' }, { status: 413 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}
