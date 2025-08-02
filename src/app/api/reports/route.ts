// src/app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Use the public client to fetch all reports, respecting RLS policies.
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase GET Error:', error);
      throw error; // Throw error to be caught by the catch block
    }

    // Supabase storage URLs need to be constructed manually if they are not returned directly.
    const reportsWithUrls = reports.map(report => {
        let publicUrl = null;
        if (report.imageUrl) {
            const { data } = supabase.storage.from('images').getPublicUrl(report.imageUrl);
            publicUrl = data.publicUrl;
        }
        return {
            ...report,
            imageUrl: publicUrl,
        };
    });


    return NextResponse.json(reportsWithUrls);
  } catch (e: any) {
    console.error('API GET /api/reports Exception:', e);
    return NextResponse.json({ message: e.message || 'An unexpected error occurred.', error: e }, { status: 500 });
  }
}
