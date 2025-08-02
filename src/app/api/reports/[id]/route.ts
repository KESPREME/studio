// src/app/api/reports/[id]/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { Report } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-server';

const statusUpdateSchema = z.object({
  status: z.enum(["New", "In Progress", "Resolved"]),
});

export async function GET(
  request: Request,
  { params }: { params: { id:string } }
) {
  // Awaiting the request is not strictly necessary for GET, but good practice for consistency.
  await request.text();
  
  try {
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
             return NextResponse.json({ message: 'Report not found' }, { status: 404 });
        }
        throw error;
    }

    if (!data) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }
    
    let imageUrl: string | undefined = undefined;
    if (data.imageUrl) {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(data.imageUrl);
        imageUrl = urlData.publicUrl;
    }

    const report: Report = {
      ...data,
      imageUrl: imageUrl,
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
    // Await the request body before accessing params
    const body = await request.json();
    const validation = statusUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.issues }, { status: 400 });
    }

    const updateData: { status: string; updatedAt: string; resolvedAt?: string } = {
        status: validation.data.status,
        updatedAt: new Date().toISOString(),
    };

    if (validation.data.status === 'Resolved') {
        updateData.resolvedAt = new Date().toISOString();
    }
    
    const { error } = await supabaseAdmin
        .from('reports')
        .update(updateData)
        .eq('id', params.id)

    if (error) {
        throw error;
    }

    return NextResponse.json({ message: 'Report status updated' });
  } catch (e: any) {
    console.error('API PATCH Error:', e);
    return NextResponse.json({ message: 'Internal Server Error', error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Await the request before accessing params
  await request.text();

  try {
    // First, fetch the report to get the image path
    const { data: report, error: fetchError } = await supabaseAdmin
      .from('reports')
      .select('imageUrl')
      .eq('id', params.id)
      .single();

    if (fetchError || !report) {
      if (fetchError?.code === 'PGRST116') {
          return NextResponse.json({ message: 'Report not found' }, { status: 404 });
      }
      throw fetchError;
    }
    
    const imagePath = report.imageUrl;

    // Primary Operation: Delete the database record
    const { error: deleteError } = await supabaseAdmin
      .from('reports')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      throw new Error('Failed to delete report from the database.');
    }
    

    // Secondary, Optional Operation: Attempt to delete the image from storage.
    if (imagePath && typeof imagePath === 'string') {
      try {
        const { error: storageError } = await supabaseAdmin.storage
          .from('images')
          .remove([imagePath]); 
        
        if (storageError) {
          console.warn(`Supabase image deletion failed for path: ${imagePath}. Error: ${storageError.message}. The database record was deleted successfully.`);
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
