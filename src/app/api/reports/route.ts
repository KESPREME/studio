// src/app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase GET Error:', error);
      throw error;
    }

    const reportsWithUrls = reports.map(report => {
        let publicUrl = undefined;
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
  } catch (e: any)
  {
    console.error('API GET Error:', e);
    // Provide a more specific error message based on the caught error
    const errorMessage = e.message || 'Internal Server Error';
    return NextResponse.json({ message: errorMessage, error: e }, { status: 500 });
  }
}
