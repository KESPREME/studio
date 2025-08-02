
// src/lib/api.ts
import type { Report, Status } from '@/lib/types';
import { supabase } from './supabase';

export async function getReports(): Promise<Report[]> {
  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      throw error;
    }

    // Supabase already gives us the full URL if the bucket is public
    // So we don't need to manually construct it.
    return reports.map(r => ({ ...r, imageUrl: r.imageUrl ? supabase.storage.from('images').getPublicUrl(r.imageUrl).data.publicUrl : undefined }));

  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
}


export async function updateReportStatus(reportId: string, status: Status): Promise<any> {
  const response = await fetch(`/api/reports/${reportId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update status');
  }
  return await response.json();
}

export async function deleteReport(reportId: string): Promise<any> {
  const response = await fetch(`/api/reports/${reportId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete report');
  }
  return await response.json();
}
