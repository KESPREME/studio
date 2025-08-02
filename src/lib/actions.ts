// src/lib/actions.ts
"use server";

import { supabaseAdmin } from './supabase-server';
import type { Status } from './types';
import { revalidatePath } from 'next/cache';

export async function updateReportStatusAsAdmin(reportId: string, status: Status) {
  if (!reportId || !status) {
    throw new Error('Report ID and status are required.');
  }

  const updateData: { status: string; updatedAt: string; resolvedAt?: string | null } = {
    status: status,
    updatedAt: new Date().toISOString(),
    resolvedAt: status === 'Resolved' ? new Date().toISOString() : null,
  };

  const { data, error } = await supabaseAdmin
    .from('reports')
    .update(updateData)
    .eq('id', reportId)
    .select()
    .single();

  if (error) {
    console.error('Supabase admin update error:', error);
    throw new Error(error.message || 'Failed to update report status.');
  }

  // Revalidate paths to ensure data is fresh on the client
  revalidatePath('/admin');
  revalidatePath('/dashboard');

  return data;
}
