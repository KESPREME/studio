// src/app/api/reports/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { z } from 'zod';
import type { Report } from '@/lib/types';
import { supabase } from '@/lib/supabase';

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
    if (!reportData) {
        return NextResponse.json({ message: 'Report data is empty' }, { status: 404 });
    }
    
    const report: Partial<Report> = {
      id: docSnap.id,
      ...reportData,
    };

    // Convert timestamps to string for serialization
    if (reportData.createdAt && reportData.createdAt instanceof Timestamp) {
      report.createdAt = reportData.createdAt.toDate().toISOString();
    }
    if (reportData.updatedAt && reportData.updatedAt instanceof Timestamp) {
      report.updatedAt = reportData.updatedAt.toDate().toISOString();
    }
     if (reportData.resolvedAt && reportData.resolvedAt instanceof Timestamp) {
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

// Helper function to extract the storage path from a URL or return the path if it's not a URL
const getImagePath = (imageUrl: string): string | null => {
  if (!imageUrl) return null;
  try {
    // Check if it's a full URL
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    // Find the 'images' segment and take everything after it
    const imagesIndex = pathSegments.indexOf('images');
    if (imagesIndex > -1 && imagesIndex < pathSegments.length -1) {
      return pathSegments.slice(imagesIndex + 1).join('/');
    }
    return null;
  } catch (e) {
    // If it's not a valid URL, assume it's already a path
    return imageUrl;
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

    // Delete image from Supabase Storage if it exists
    if (report?.imageUrl) {
      const imagePath = getImagePath(report.imageUrl);
      if (imagePath) {
        const { error: deleteError } = await supabase.storage
          .from('images')
          .remove([imagePath]);
        
        if (deleteError) {
          // Log the error but don't block deletion of the Firestore document
          console.error('Supabase image deletion failed:', deleteError.message);
        }
      }
    }

    // Delete the Firestore document
    await deleteDoc(docRef);

    return NextResponse.json({ message: 'Report deleted successfully' });
  } catch (e: any) {
    console.error('API DELETE Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}