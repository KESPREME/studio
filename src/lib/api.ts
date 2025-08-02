// src/lib/api.ts
import type { Report, Status } from '@/lib/types';

export async function getReports(): Promise<Report[]> {
  try {
    const response = await fetch('/api/reports', { cache: 'no-store' });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch reports:", response.status, errorText);
      return [];
    }
    const reports = await response.json();
    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
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
