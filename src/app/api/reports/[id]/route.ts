// src/app/api/reports/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin'; // Use the admin instance
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore'; // Import FieldValue for server timestamp
import { z } from 'zod';
import type { Report } from '@/lib/types';

const statusUpdateSchema = z.object({
  status: z.enum(["New", "In Progress", "Resolved"]),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = doc(db, 'reports', params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }
    
    const report = {
      id: docSnap.id,
      ...docSnap.data(),
    } as Report;

    // Convert timestamps to string for serialization
    if (report.createdAt) {
      report.createdAt = new Date(report.createdAt).toISOString();
    }
    if (report.updatedAt) {
      report.updatedAt = new Date(report.updatedAt).toISOString();
    }
     if (report.resolvedAt) {
      report.resolvedAt = new Date(report.resolvedAt).toISOString();
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
  try {
    const body = await request.json();
    const validation = statusUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.issues }, { status: 400 });
    }

    const docRef = doc(db, 'reports', params.id);
    await updateDoc(docRef, {
      status: validation.data.status,
      updatedAt: FieldValue.serverTimestamp(), // Correct server-side timestamp
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
