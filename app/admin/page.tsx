// src/app/admin/page.tsx
"use client";

import React from 'react';
import { PlusCircle, AlertTriangle, TestTube, Shield, Activity, TrendingUp, Users, Plus, LayoutList, Map, BarChart3, Download, Settings, Filter, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/animated-button';
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
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'analytics'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | Status>('all');
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'Low' | 'Moderate' | 'High'>('all');
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    // Keep loading true when re-fetching in background
    if (reports.length === 0) {
      setIsLoading(true);
    }
    try {
      const fetchedReports = await getReports();
      // Ensure we always have an array
      setReports(Array.isArray(fetchedReports) ? fetchedReports : []);
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

  // Filter reports based on selected filters
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const statusMatch = filterStatus === 'all' || report.status === filterStatus;
      const urgencyMatch = filterUrgency === 'all' || report.urgency === filterUrgency;
      return statusMatch && urgencyMatch;
    });
  }, [reports, filterStatus, filterUrgency]);

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

  // Export functionality
  const handleExportCSV = useCallback(() => {
    const csvContent = [
      ['ID', 'Description', 'Status', 'Urgency', 'Location', 'Reported By', 'Created At'],
      ...filteredReports.map(report => [
        report.id,
        report.description,
        report.status,
        report.urgency,
        `${report.latitude}, ${report.longitude}`,
        report.reportedBy || 'Anonymous',
        new Date(report.createdAt).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${filteredReports.length} reports to CSV.`,
    });
  }, [filteredReports, toast]);

  // Bulk status update
  const handleBulkStatusUpdate = useCallback(async (newStatus: Status) => {
    const selectedReports = filteredReports.filter(r => r.status !== newStatus);
    if (selectedReports.length === 0) {
      toast({
        title: "No Reports to Update",
        description: "All filtered reports already have this status.",
      });
      return;
    }

    try {
      await Promise.all(
        selectedReports.map(report => updateReportStatusAsAdmin(report.id, newStatus))
      );
      toast({
        title: "Bulk Update Complete",
        description: `Updated ${selectedReports.length} reports to ${newStatus}.`,
      });
      fetchReports();
    } catch (error: any) {
      toast({
        title: "Bulk Update Failed",
        variant: "destructive",
        description: error.message || "Could not update reports. Please try again.",
      });
    }
  }, [filteredReports, toast, fetchReports]);

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
                      <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 animate-pulse drop-shadow-lg">
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
                  <Link href="/admin/simulator">
                    <AnimatedButton variant="outline" className="group bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border-2 border-purple-500/30 dark:border-purple-400/30">
                      <TestTube className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Simulator
                    </AnimatedButton>
                  </Link>
                  <Link href="/report/new">
                    <AnimatedButton variant="gradient" className="font-semibold">
                      <Plus className="mr-2 h-4 w-4" />
                      New Report
                    </AnimatedButton>
                  </Link>
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

          {/* Enhanced Admin Tools Panel */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/30 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Admin Tools</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Manage reports, export data, and monitor system health</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* View Mode Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">View Mode</label>
                  <div className="flex rounded-lg bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'list'
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <LayoutList className="h-4 w-4" />
                      List
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'map'
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Map className="h-4 w-4" />
                      Map
                    </button>
                    <button
                      onClick={() => setViewMode('analytics')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'analytics'
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <BarChart3 className="h-4 w-4" />
                      Analytics
                    </button>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                {/* Urgency Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Urgency</label>
                  <select
                    value={filterUrgency}
                    onChange={(e) => setFilterUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Urgencies</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quick Actions</label>
                  <div className="flex gap-2">
                    <AnimatedButton
                      onClick={handleExportCSV}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </AnimatedButton>
                    <AnimatedButton
                      onClick={() => fetchReports()}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </AnimatedButton>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              {filteredReports.length > 0 && (
                <div className="border-t border-blue-200/50 dark:border-blue-800/30 pt-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Bulk Actions ({filteredReports.length} reports):
                    </span>
                    <div className="flex gap-2">
                      <AnimatedButton
                        onClick={() => handleBulkStatusUpdate('In Progress')}
                        variant="outline"
                        size="sm"
                      >
                        Mark as In Progress
                      </AnimatedButton>
                      <AnimatedButton
                        onClick={() => handleBulkStatusUpdate('Resolved')}
                        variant="outline"
                        size="sm"
                      >
                        Mark as Resolved
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Content Based on View Mode */}
          {viewMode === 'list' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-headline">Reports List</h2>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {filteredReports.length} of {reports.length} reports
                </span>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <ReportsDataTable columns={columns} data={filteredReports} isLoading={isLoading} />
                </div>
              </div>
            </div>
          )}

          {viewMode === 'map' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-headline">Live Hazard Map</h2>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Displaying {filteredReports.length} reports on map
                </span>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: '600px' }}>
                    <MapWrapper reports={filteredReports} isLoading={isLoading} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-headline">Analytics Dashboard</h2>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Status Distribution */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Status Distribution</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">New Reports</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${reports.length > 0 ? (stats.new / reports.length) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{stats.new}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">In Progress</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${reports.length > 0 ? (stats.inProgress / reports.length) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{stats.inProgress}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Resolved</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${reports.length > 0 ? (stats.resolved / reports.length) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{stats.resolved}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgency Distribution */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Urgency Levels</h3>
                    <div className="space-y-3">
                      {['High', 'Moderate', 'Low'].map((urgency) => {
                        const count = reports.filter(r => r.urgency === urgency).length;
                        const percentage = reports.length > 0 ? (count / reports.length) * 100 : 0;
                        const color = urgency === 'High' ? 'bg-red-500' : urgency === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500';

                        return (
                          <div key={urgency} className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">{urgency} Priority</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                  className={`${color} h-2 rounded-full transition-all duration-500`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="relative group md:col-span-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Recent Reports</h3>
                    <div className="space-y-3">
                      {reports.slice(0, 5).map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              report.urgency === 'High' ? 'bg-red-500' :
                              report.urgency === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <div>
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">
                                {report.description}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(report.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            report.status === 'In Progress' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <AppFooter />
    </div>
  );
}

export default withAuth(AdminDashboard, { roles: ['admin'] });
