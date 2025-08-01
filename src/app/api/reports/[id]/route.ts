
// src/app/api/reports/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { z } from 'zod';
import type { Report } from '@/lib/types';
import { supabaseAdmin } from '@/lib/supabase-server';

const statusUpdateSchema = z.object({
  status: z.enum(["New", "In Progress", "Resolved"]),
});

export async function GET(
  request: Request,
  { params }: { params: { id:string } }
) {
  try {
    const docRef = doc(db, 'reports', params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }
    
    const reportData = docSnap.data();
    
    const report: Report = {
      id: docSnap.id,
      description: reportData.description,
      latitude: reportData.latitude,
      longitude: reportData.longitude,
      urgency: reportData.urgency,
      status: reportData.status,
      imageUrl: reportData.imageUrl,
      reportedBy: reportData.reportedBy,
      createdAt: (reportData.createdAt as Timestamp).toDate().toISOString(),
      updatedAt: (reportData.updatedAt as Timestamp).toDate().toISOString(),
      resolvedAt: reportData.resolvedAt ? (reportData.resolvedAt as Timestamp).toDate().toISOString() : undefined,
    };

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
    
    const updateData: { status: string; updatedAt: Timestamp; resolvedAt?: Timestamp } = {
        status: validation.data.status,
        updatedAt: Timestamp.fromDate(new Date()),
    };

    if (validation.data.status === 'Resolved') {
        updateData.resolvedAt = Timestamp.fromDate(new Date());
    }

    await updateDoc(docRef, updateData);

    return NextResponse.json({ message: 'Report status updated' });
  } catch (e: any) {
    console.error('API PATCH Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = doc(db, 'reports', params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }

    const reportData = docSnap.data();
    const imagePath = reportData?.imageUrl; 

    // Primary Operation: Delete the Firestore document.
    await deleteDoc(docRef);

    // Secondary Operation: Attempt to delete the image from storage.
    // This should not block the success of the overall request.
    if (imagePath && typeof imagePath === 'string') {
      try {
        const { error: deleteError } = await supabaseAdmin.storage
          .from('images')
          .remove([imagePath]); 
        
        if (deleteError) {
          // Log the error but don't cause the request to fail.
          // This handles cases where the file doesn't exist in storage or other permission issues.
          console.warn(`Supabase image deletion failed for path: ${imagePath}. Error: ${deleteError.message}. The Firestore document was deleted successfully.`);
        }
      } catch (storageError: any) {
         console.error(`An exception occurred during Supabase image deletion for path: ${imagePath}. Error: ${storageError.message}.`);
      }
    }

    return NextResponse.json({ message: 'Report deleted successfully' });
  } catch (e: any) {
    console.error('API DELETE Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}
