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

const getImagePath = (imageUrl: string): string | null => {
    if (!imageUrl) return null;
    try {
        const url = new URL(imageUrl);
        const pathSegments = url.pathname.split('/images/');
        if (pathSegments.length > 1) {
            return decodeURIComponent(pathSegments[1]);
        }
        return null;
    } catch (e) {
        console.warn("Could not parse image URL, it might be a raw path:", imageUrl);
        return imageUrl.split('/images/').pop() || null;
    }
};


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = doc(db, 'reports', params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }

    const report = docSnap.data();

    // Attempt to delete image from Supabase Storage if it exists.
    if (report?.imageUrl) {
      const imagePath = getImagePath(report.imageUrl);
      if (imagePath) {
        const { error: deleteError } = await supabaseAdmin.storage
          .from('images')
          .remove([imagePath]);
        
        if (deleteError) {
          console.error(`Supabase image deletion failed for path: ${imagePath}. Error: ${deleteError.message}. Proceeding with Firestore deletion.`);
        }
      }
    }

    // Delete the Firestore document regardless of image deletion outcome
    await deleteDoc(docRef);

    return NextResponse.json({ message: 'Report deleted successfully' });
  } catch (e: any) {
    console.error('API DELETE Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}
