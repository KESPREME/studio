// src/app/admin/page.tsx
"use client";

import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { StatCard } from '@/components/stat-card';
import type { Report, Status } from '@/lib/types';
import MapWrapper from '@/components/map-wrapper';
import { AppFooter } from '@/components/app-footer';
import { getReports, deleteReport } from '@/lib/api';
import { updateReportStatusAsAdmin } from '@/lib/actions';
import withAuth from '@/components/with-auth';
import { ReportsDataTable } from './_components/reports-data-table';
import { getColumns } from './_components/columns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { DisasterSimulator } from './_components/disaster-simulator';


function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    // Keep loading true when re-fetching in background
    if (reports.length === 0) {
      setIsLoading(true);
    }
    try {
      const fetchedReports = await getReports();
      setReports(fetchedReports);
    } catch (error) {
       console.error("Failed to fetch reports:", error);
       toast({
        title: "Error",
        description: "Could not fetch reports.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, reports.length]);

  useEffect(() => {
    fetchReports();
    
    const channel = supabase
      .channel('reports-realtime-admin')
      .on<Report>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload) => {
          console.log('Realtime change received!', payload);
          toast({
            title: "Live Update",
            description: "The reports list has been updated.",
          });
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [fetchReports, toast]);
  
  const handleStatusChange = useCallback(async (reportId: string, newStatus: Status) => {
    // We don't need optimistic UI here because the realtime subscription will handle it.
    try {
      await updateReportStatusAsAdmin(reportId, newStatus);
      toast({
        title: "Status Updated",
        description: `Report status successfully changed to ${newStatus}.`,
      });
    } catch (error: any) {
      console.error("Update failed:", error);
      toast({
        title: "Update Failed",
        variant: "destructive",
        description: error.message || "Could not update report status. Please try again.",
      });
    }
  }, [toast]);

  const handleDelete = useCallback(async (reportId: string) => {
    const originalReports = [...reports];
    // Optimistic UI update for delete, as it can feel slow otherwise
    setReports(currentReports => currentReports.filter(r => r.id !== reportId));

    try {
      await deleteReport(reportId);
      toast({
        title: "Report Deleted",
        description: "The resolved report has been successfully deleted.",
      });
    } catch (error: any) {
      console.error("Delete failed:", error);
      setReports(originalReports); // Revert on failure
      toast({
        title: "Delete Failed",
        variant: "destructive",
        description: error.message || "Could not delete the report. Please try again.",
      });
    }
  }, [reports, toast]);

  const columns = useMemo(() => getColumns({ 
    onStatusChange: handleStatusChange,
    onDelete: handleDelete 
  }), [handleStatusChange, handleDelete]);

  const stats = useMemo(() => ({
    total: reports.length,
    new: reports.filter((r) => r.status === 'New').length,
    inProgress: reports.filter((r) => r.status === 'In Progress').length,
    resolved: reports.filter((r) => r.status === 'Resolved').length,
  }), [reports]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Admin Dashboard</h1>
            <Button asChild>
              <Link href="/report/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-headline">Live Hazard Reports</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Reports" value={stats.total} isLoading={isLoading} />
              <StatCard title="New" value={stats.new} variant="new" isLoading={isLoading} />
              <StatCard title="In Progress" value={stats.inProgress} variant="inProgress" isLoading={isLoading} />
              <StatCard title="Resolved" value={stats.resolved} variant="resolved" isLoading={isLoading} />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold mb-4 font-headline">Hazard Map</h3>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <MapWrapper reports={reports} isLoading={isLoading} />
                </div>
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold mb-4 font-headline">All Reports</h3>
                <div className="space-y-4">
                  <ReportsDataTable columns={columns} data={reports} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 pt-8 border-t">
             <h2 className="text-xl font-bold font-headline">AI-Powered Preparedness</h2>
             <DisasterSimulator />
          </div>

        </div>
      </main>
      <AppFooter />
    </div>
  );
}

export default withAuth(AdminDashboard, { roles: ['admin'] });
