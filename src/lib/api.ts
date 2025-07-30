// src/lib/api.ts
import clientPromise from '@/lib/mongodb';
import { Report } from '@/lib/types';

export async function getReports(): Promise<Report[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const reportsFromDb = await db.collection('reports').find({}).sort({ createdAt: -1 }).toArray();
    
    const reports = reportsFromDb.map(report => ({
      ...report,
      _id: report._id.toString(),
    })) as Report[];

    return reports;
  } catch (e: any) {
    console.error('MongoDB getReports Error:', e);
    // In case of an error, return an empty array to prevent the page from crashing.
    return [];
  }
}
