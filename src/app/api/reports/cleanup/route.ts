// src/app/api/reports/cleanup/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, writeBatch, Timestamp } from 'firebase/firestore';
import { supabaseAdmin } from '@/lib/supabase-server';
import type { Report } from '@/lib/types';

// In a production environment, you would secure this with a more robust mechanism
// like checking for a specific role or using a service account.
const CRON_SECRET = process.env.CRON_SECRET || 'your-super-secret-key';

const getImagePath = (imageUrl: string): string | null => {
    if (!imageUrl) return null;
    try {
        // This handles both full URLs and raw paths
        const url = new URL(imageUrl);
        const pathSegments = url.pathname.split('/images/');
        if (pathSegments.length > 1) {
            return decodeURIComponent(pathSegments[1]);
        }
        return null;
    } catch (e) {
        // If it's not a valid URL, it's likely already a path
        return imageUrl.split('/images/').pop() || imageUrl;
    }
};


export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoTimestamp = Timestamp.fromDate(thirtyDaysAgo);

    const reportsCollection = collection(db, 'reports');
    
    const q = query(
        reportsCollection, 
        where('status', '==', 'Resolved'),
        where('resolvedAt', '<=', thirtyDaysAgoTimestamp)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ message: 'No old resolved reports to delete.' });
    }

    const batch = writeBatch(db);
    const imagePathsToDelete: string[] = [];

    querySnapshot.forEach(doc => {
      const report = doc.data() as Report;
      batch.delete(doc.ref);
      if (report.imageUrl) {
        const imagePath = getImagePath(report.imageUrl);
        if (imagePath) {
          imagePathsToDelete.push(imagePath);
        }
      }
    });

    // Commit the Firestore deletions first.
    await batch.commit();

    // After successful deletion from Firestore, attempt to delete from storage.
    // Failure here should not cause the entire job to fail.
    if (imagePathsToDelete.length > 0) {
      try {
        const { data, error } = await supabaseAdmin.storage.from('images').remove(imagePathsToDelete);
        if (error) {
          console.error('Supabase image deletion failed for some paths, but Firestore cleanup was successful:', error.message);
        } else {
           console.log('Successfully deleted images from Supabase:', data);
        }
      } catch (storageError: any) {
        console.error('An exception occurred during Supabase image cleanup:', storageError.message);
      }
    }

    return NextResponse.json({
      message: `Successfully deleted ${querySnapshot.size} old resolved reports from Firestore.`,
      attemptedImageDeletions: imagePathsToDelete.length,
    });

  } catch (e: any) {
    console.error('Cleanup Cron Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}
