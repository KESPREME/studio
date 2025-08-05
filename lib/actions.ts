'use server';

import { supabaseAdmin } from '@/lib/supabase-server';
import type { Status } from '@/lib/types';

export async function updateReportStatusAsAdmin(reportId: string, newStatus: Status) {
  try {
    const updateData: { status: Status; updatedAt: string; resolvedAt?: string } = {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    if (newStatus === 'Resolved') {
      updateData.resolvedAt = new Date().toISOString();
    }

    const { error } = await supabaseAdmin
      .from('reports')
      .update(updateData)
      .eq('id', reportId);

    if (error) {
      console.error('Error updating report status:', error);
      throw new Error('Failed to update report status');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Update report status error:', error);
    throw new Error(error.message || 'Failed to update report status');
  }
}
