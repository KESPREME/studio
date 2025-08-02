
// src/app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { sendNewReportSms, sendMassAlertSms } from '@/lib/sms';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-server';
import { generateSafetyTips } from '@/ai/flows/generate-safety-tips';

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

    // Generate safety tips asynchronously and then send notifications.
    // This is done without `await` so the client gets a fast response.
    generateSafetyTips({ description: validation.data.description })
      .then(tipsOutput => {
        const tips = tipsOutput.tips;
        // Send SMS to admin with safety tips
        sendNewReportSms(validation.data, tips);

        // If high urgency, send mass alert to nearby users
        if (validation.data.urgency === 'High') {
            const { latitude, longitude } = validation.data;
            const radiusKm = 10;
            const box = getBoundingBox(latitude, longitude, radiusKm);
            
            supabaseAdmin
                .from('users') // Query users table for phone numbers
                .select('phone')
                .gte('latitude', box.minLat)
                .lte('latitude', box.maxLat)
                .not('phone', 'is', null)
                .then(({ data: nearbyUsers, error: nearbyError }) => {
                    if (nearbyError) {
                        console.error("Error fetching nearby users for mass alert:", nearbyError);
                        return;
                    }

                    const nearbyPhoneNumbers: string[] = nearbyUsers
                        ? nearbyUsers.map((user: { phone: string }) => user.phone)
                        : [];
                    
                    const uniquePhoneNumbers = [...new Set(nearbyPhoneNumbers)];
                    if (uniquePhoneNumbers.length > 0) {
                      sendMassAlertSms(validation.data, uniquePhoneNumbers, tips);
                    } else {
                      console.log("No nearby users found to send mass alert.");
                    }
                });
        }
      })
      .catch(aiError => {
          console.error("Failed to generate safety tips, sending SMS without them.", aiError);
          // Fallback to sending SMS without tips if AI fails
          sendNewReportSms(validation.data);
          // Handle high urgency fallback if needed
      });

    return NextResponse.json({ message: 'Report created', reportId: data.id }, { status: 201 });
  } catch (e: any) {
    console.error('Supabase POST Error:', e);
    if (e.message?.includes('too large')) {
       return NextResponse.json({ message: 'Request body too large. Please upload a smaller image file.' }, { status: 413 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}
