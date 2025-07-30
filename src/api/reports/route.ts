// src/app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { sendNewReportSms, sendMassAlertSms } from '@/lib/sms';
import { z } from 'zod';
import { getReports } from '@/lib/api';
import type { Report } from '@/lib/types';


const reportSchema = z.object({
  description: z.string().min(10).max(500),
  urgency: z.enum(["Low", "Moderate", "High"]),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().url().optional(),
  reportedBy: z.string().email(),
});

export async function GET() {
  try {
    const reports = await getReports();
    return NextResponse.json(reports);
  } catch (e: any)
  {
    console.error('API GET Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}

// Function to calculate bounding box for nearby query
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
    
    const newReportData = {
      ...validation.data,
      status: 'New',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'reports'), newReportData);
    
    // Send SMS notification to admin
    try {
      await sendNewReportSms(validation.data);
    } catch (smsError: any) {
      console.error("Admin SMS sending failed, but report was created. Error:", smsError.message);
    }

    // If urgency is High, send mass alert to nearby reporters
    if (validation.data.urgency === 'High') {
      try {
        const { latitude, longitude } = validation.data;
        const radiusKm = 10; // 10km radius
        const box = getBoundingBox(latitude, longitude, radiusKm);
        
        const q = query(
          collection(db, 'reports'),
          where('latitude', '>=', box.minLat),
          where('latitude', '<=', box.maxLat),
          // Note: Firestore doesn't support range filters on multiple fields.
          // We'll have to filter longitude in the application code.
        );
        
        const querySnapshot = await getDocs(q);
        const nearbyReporters: string[] = [];
        
        const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

        querySnapshot.forEach((doc) => {
          const report = doc.data() as Report;
          // Secondary longitude filter
          if (report.longitude >= box.minLon && report.longitude <= box.maxLon) {
             // For this demo, we don't have user phone numbers.
             // We'll use the ADMIN_PHONE_NUMBER as a stand-in for every "nearby" user.
             // In a real app, you'd look up the user's phone number from their email or user ID.
             if (adminPhoneNumber) {
                nearbyReporters.push(adminPhoneNumber);
             }
          }
        });

        if (nearbyReporters.length > 0) {
          await sendMassAlertSms(validation.data, nearbyReporters);
        } else {
          console.log("No nearby reporters found to send mass alert.");
        }

      } catch (massAlertError: any) {
        console.error("Mass alert SMS process failed. Error:", massAlertError.message);
      }
    }


    return NextResponse.json({ message: 'Report created', reportId: docRef.id }, { status: 201 });
  } catch (e: any) {
    console.error('Firestore POST Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}
