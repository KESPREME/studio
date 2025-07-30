import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { sendNewReportSms } from '@/lib/sms';
import { Report } from '@/lib/types';
import { z } from 'zod';

const reportSchema = z.object({
  description: z.string().min(10).max(500),
  urgency: z.enum(["Low", "Moderate", "High"]),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().url().optional(),
});

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const reportsFromDb = await db.collection('reports').find({}).sort({ createdAt: -1 }).toArray();
    
    const reports = reportsFromDb.map(report => ({
      ...report,
      _id: report._id.toString(),
    }));

    return NextResponse.json(reports);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = reportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.issues }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const newReport: Omit<Report, '_id' | 'createdAt' | 'updatedAt'> = {
      ...validation.data,
      status: 'New',
      reportedBy: 'anonymous', // Replace with actual user ID when auth is implemented
    };

    const result = await db.collection('reports').insertOne({
      ...newReport,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // Send SMS notification
    await sendNewReportSms(newReport);

    return NextResponse.json({ message: 'Report created', reportId: result.insertedId }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
