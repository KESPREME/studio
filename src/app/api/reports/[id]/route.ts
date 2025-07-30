
// src/app/api/reports/[id]/route.ts
import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import { db } from '@/lib/firebase-admin'; // Use the admin instance for server-side operations
import type { Report } from '@/lib/types';

const statusUpdateSchema = z.object({
  status: z.enum(["New", "In Progress", "Resolved"]),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!db) {
    return NextResponse.json({ message: 'Firestore is not initialized.' }, { status: 500 });
  }
  try {
    const docRef = doc(db, 'reports', params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }
    
    const reportData = docSnap.data();
    if (!reportData) {
        return NextResponse.json({ message: 'Report data is empty' }, { status: 404 });
    }
    
    const report: Partial<Report> = {
      id: docSnap.id,
      ...reportData,
    };

    // Convert timestamps to string for serialization
    if (reportData.createdAt) {
      report.createdAt = (reportData.createdAt as Timestamp).toDate().toISOString();
    }
    if (reportData.updatedAt) {
      report.updatedAt = (reportData.updatedAt as Timestamp).toDate().toISOString();
    }
     if (reportData.resolvedAt) {
      report.resolvedAt = (reportData.resolvedAt as Timestamp).toDate().toISOString();
    }

    return NextResponse.json(report);
  } catch (e: any) {
    console.error('API GET by ID Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!db) {
    return NextResponse.json({ message: 'Firestore is not initialized.' }, { status: 500 });
  }
  try {
    const body = await request.json();
    const validation = statusUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.issues }, { status: 400 });
    }

    const docRef = doc(db, 'reports', params.id);
    await updateDoc(docRef, {
      status: validation.data.status,
      updatedAt: FieldValue.serverTimestamp(),
      ...(validation.data.status === 'Resolved' && { resolvedAt: FieldValue.serverTimestamp() }),
    });

    return NextResponse.json({ message: 'Report status updated' });
  } catch (e: any) {
    console.error('API PATCH Error:', e);
    // Log the full error for better debugging
    console.error(e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}
