
// src/app/api/reports/cleanup/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

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
    
    // 1. Find old, resolved reports
    const { data: reportsToDelete, error: fetchError } = await supabaseAdmin
        .from('reports')
        .select('id, imageUrl')
        .eq('status', 'Resolved')
        .lt('resolvedAt', thirtyDaysAgo.toISOString());

    if (fetchError) throw fetchError;

    if (!reportsToDelete || reportsToDelete.length === 0) {
      return NextResponse.json({ message: 'No old resolved reports to delete.' });
    }
    
    const reportIdsToDelete = reportsToDelete.map(r => r.id);
    const imagePathsToDelete = reportsToDelete
        .map(r => r.imageUrl)
        .filter((path): path is string => !!path);

    // 2. Delete the records from the database
    const { error: deleteError } = await supabaseAdmin
        .from('reports')
        .delete()
        .in('id', reportIdsToDelete);

    if (deleteError) {
        console.error("Supabase delete error during cleanup:", deleteError);
        throw new Error("Failed to delete old reports from database.");
    }

    // 3. After successful deletion from db, attempt to delete from storage.
    if (imagePathsToDelete.length > 0) {
      try {
        const { data, error } = await supabaseAdmin.storage.from('images').remove(imagePathsToDelete);
        if (error) {
          console.error('Supabase image deletion failed for some paths, but database cleanup was successful:', error.message);
        } else {
           console.log('Successfully deleted images from Supabase:', data);
        }
      } catch (storageError: any) {
        console.error('An exception occurred during Supabase image cleanup:', storageError.message);
      }
    }

    return NextResponse.json({
      message: `Successfully deleted ${reportsToDelete.length} old resolved reports from Supabase.`,
      attemptedImageDeletions: imagePathsToDelete.length,
    });

  } catch (e: any) {
    console.error('Cleanup Cron Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}
