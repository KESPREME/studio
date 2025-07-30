// src/app/api/reports/cleanup/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, writeBatch, Timestamp } from 'firebase/firestore';
import { supabase } from '@/lib/supabase';
import type { Report } from '@/lib/types';

// In a production environment, you would secure this with a more robust mechanism
// like checking for a specific role or using a service account.
const CRON_SECRET = process.env.CRON_SECRET || 'your-super-secret-key';

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
        // The imageUrl is the full public URL. We need to extract the path.
        // Example: https://zeycfgpgoptewbcyucxd.supabase.co/storage/v1/object/public/images/1753898693610_auto-cheetah.png
        // We need the path: "1753898693610_auto-cheetah.png"
        try {
            const url = new URL(report.imageUrl);
            const pathSegments = url.pathname.split('/');
            // The actual file path is the last segment of the URL path
            const imagePath = pathSegments[pathSegments.length - 1];
            if(imagePath) {
                imagePathsToDelete.push(imagePath);
            }
        } catch (e) {
            console.error("Invalid imageUrl format, cannot extract path:", report.imageUrl);
        }
      }
    });

    // Delete images from Supabase Storage
    if (imagePathsToDelete.length > 0) {
      const { data, error } = await supabase.storage.from('images').remove(imagePathsToDelete);
      if (error) {
        console.error('Supabase image deletion failed, but Firestore cleanup will proceed:', error);
        // We won't block the Firestore cleanup if image deletion fails,
        // but we'll log the error.
      } else {
         console.log('Successfully deleted images from Supabase:', data);
      }
    }

    // Commit the Firestore deletions
    await batch.commit();

    return NextResponse.json({
      message: `Successfully deleted ${querySnapshot.size} old resolved reports.`,
      deletedImagePaths: imagePathsToDelete,
    });

  } catch (e: any) {
    console.error('Cleanup Cron Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}
