// src/app/admin/page.tsx
"use client";

import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { StatCard } from '@/components/stat-card';
import type { Report, Status } from '@/lib/types';
import MapWrapper from '@/components/map-wrapper';
import { AppFooter } from '@/components/app-footer';
import { getReports, updateReportStatus, deleteReport } from '@/lib/api';
import withAuth from '@/components/with-auth';
import { ReportsDataTable } from './_components/reports-data-table';
import { getColumns } from './_components/columns';
import { useToast } from '@/hooks/use-toast';


function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
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
  }, [toast]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);
  
  const handleStatusChange = useCallback(async (reportId: string, newStatus: Status) => {
    const originalReports = [...reports];
    
    // Optimistic UI update
    setReports(currentReports =>
      currentReports.map(r => (r.id === reportId ? { ...r, status: newStatus } : r))
    );

    try {
      await updateReportStatus(reportId, newStatus);
      toast({
        title: "Status Updated",
        description: `Report status successfully changed to ${newStatus}.`,
      });
      // Re-fetch to ensure data consistency
      await fetchReports();
    } catch (error: any) {
      console.error("Update failed:", error);
      // Revert on failure
      setReports(originalReports);
      toast({
        title: "Update Failed",
        variant: "destructive",
        description: error.message || "Could not update report status. Please try again.",
      });
    }
  }, [reports, toast, fetchReports]);

  const handleDelete = useCallback(async (reportId: string) => {
    const originalReports = [...reports];
    // Optimistic UI update
    setReports(currentReports => currentReports.filter(r => r.id !== reportId));

    try {
      await deleteReport(reportId);
      toast({
        title: "Report Deleted",
        description: "The resolved report has been successfully deleted.",
      });
      // Optional: re-fetch to ensure sync, though optimistic removal is often sufficient
      // await fetchReports(); 
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

  const columns = getColumns({ 
    onStatusChange: handleStatusChange,
    onDelete: handleDelete 
  });

  const stats = {
    total: reports.length,
    new: reports.filter((r) => r.status === 'New').length,
    inProgress: reports.filter((r) => r.status === 'In Progress').length,
    resolved: reports.filter((r) => r.status === 'Resolved').length,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Admin Dashboard</h1>
            <Button asChild>
              <Link href="/report/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard title="Total Reports" value={stats.total} />
            <StatCard title="New" value={stats.new} variant="new" />
            <StatCard title="In Progress" value={stats.inProgress} variant="inProgress" />
            <StatCard title="Resolved" value={stats.resolved} variant="resolved" />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4 font-headline">Hazard Map</h2>
              <div className="rounded-lg overflow-hidden shadow-md">
                <MapWrapper reports={reports} />
              </div>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4 font-headline">All Reports</h2>
              <div className="space-y-4">
                 <ReportsDataTable columns={columns} data={reports} isLoading={isLoading} />
              </div>
            </div>
          </div>

        </div>
      </main>
      <AppFooter />
    </div>
  );
}

export default withAuth(AdminDashboard, { roles: ['admin'] });
