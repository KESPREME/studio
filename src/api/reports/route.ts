// src/app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendNewReportSms } from '@/lib/sms';
import { z } from 'zod';
import { getReports } from '@/lib/api';

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
    
    // Send SMS notification
    try {
      await sendNewReportSms(validation.data);
    } catch (smsError: any) {
      console.error("SMS sending failed, but report was created. Error:", smsError.message);
    }

    return NextResponse.json({ message: 'Report created', reportId: docRef.id }, { status: 201 });
  } catch (e: any) {
    console.error('Firestore POST Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}
