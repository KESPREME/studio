// src/app/admin/page.tsx
"use client";

import React from 'react';
import { PlusCircle, AlertTriangle, TestTube, Shield, Activity, TrendingUp, Users, Plus } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


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
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-indigo-950/30 dark:to-purple-950/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                        Admin Dashboard
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">
                        Command Center for Emergency Response 🔒
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-200/50 dark:border-indigo-700/50">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Total Reports: {stats.total}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200/50 dark:border-purple-700/50">
                      <Activity className="h-4 w-4 text-purple-600 animate-pulse" />
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Active: {stats.inProgress}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" className="group bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border-2 border-purple-500/30 dark:border-purple-400/30 hover:bg-purple-50 dark:hover:bg-slate-700 hover:border-purple-500 dark:hover:border-purple-400 hover:scale-105 transition-all duration-300">
                    <Link href="/admin/simulator">
                      <TestTube className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400 group-hover:animate-pulse" />
                      Simulator
                    </Link>
                  </Button>
                  <Button asChild className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-0">
                    <Link href="/report/new">
                      <Plus className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                      New Report
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard title="Total Reports" value={stats.total} isLoading={isLoading} />
            <StatCard title="New" value={stats.new} variant="new" isLoading={isLoading} />
            <StatCard title="In Progress" value={stats.inProgress} variant="inProgress" isLoading={isLoading} />
            <StatCard title="Resolved" value={stats.resolved} variant="resolved" isLoading={isLoading} />
          </div>

          {/* Enhanced Admin Tools Alert */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl">
              <Alert className="bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-950/80 dark:to-orange-950/80 border-yellow-200/50 dark:border-yellow-700/50 backdrop-blur-sm">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg inline-block">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <AlertTitle className="text-yellow-800 dark:text-yellow-200 font-bold ml-2">Admin Tools</AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-300 ml-2">
                  These tools are only available to administrators. Use with caution.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 flex items-center space-x-2">
                <TestTube className="h-4 w-4 text-blue-600 animate-pulse" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Use the Simulator to test different disaster scenarios and response protocols.</p>
              </div>
            </div>
          </div>

          {/* Enhanced Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Enhanced Map Section */}
            <div className="lg:col-span-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Hazard Map
                  </h2>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <MapWrapper reports={reports} isLoading={isLoading} />
                </div>
              </div>
            </div>

            {/* Enhanced Reports Section */}
            <div className="lg:col-span-2 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      All Reports
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Manage and track all incident reports
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                   <ReportsDataTable columns={columns} data={reports} isLoading={isLoading} />
                </div>
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
