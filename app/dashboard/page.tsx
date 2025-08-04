// src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { PlusCircle, Map, List, Wind, Users, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

import withAuth from '@/components/with-auth';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HazardReportCard } from '@/components/hazard-report-card';
import MapWrapper from '@/components/map-wrapper';
import { getReports } from '@/lib/api';
import type { Report } from '@/lib/types';
import { AppFooter } from '@/components/app-footer';
import { Skeleton } from '@/components/ui/skeleton';

function ReporterDashboard() {
  const { user } = useAuth();
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedReports = await getReports();
      setAllReports(fetchedReports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      // Optionally add a toast message here for the user
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);
  
  const myReports = useMemo(() => {
    if (!user) return [];
    return allReports.filter(r => r.reportedBy === user.email);
  }, [allReports, user]);

  const ReportList = ({ reports, emptyMessage, isLoading }: { reports: Report[], emptyMessage: string, isLoading: boolean }) => {
    if (isLoading) {
      return (
         <div className="space-y-4">
          <HazardReportCard.Skeleton />
          <HazardReportCard.Skeleton />
          <HazardReportCard.Skeleton />
        </div>
      )
    }

    if (reports.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-4 border-2 border-dashed rounded-lg">
          <Wind className="w-12 h-12 text-muted-foreground/50" />
          <p>{emptyMessage}</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {reports.map(report => (
          <HazardReportCard key={report.id} report={report} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                      <Activity className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-pulse">
                        Community Dashboard
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">
                        Welcome back, <span className="text-blue-600 dark:text-blue-400 font-semibold">{user?.name}</span>! 👋
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Reports: {allReports.length}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-full border border-green-200/50 dark:border-green-700/50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">My Reports: {myReports.length}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-full border border-orange-200/50 dark:border-orange-700/50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Active: {allReports.filter(r => r.urgency === 'High').length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" className="group bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border-2 border-blue-500/30 dark:border-blue-400/30 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-105 transition-all duration-300">
                    <Link href="/community">
                      <Users className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:animate-pulse" />
                      View Community
                    </Link>
                  </Button>
                  <Button asChild className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-0">
                    <Link href="/report/new">
                      <PlusCircle className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                      New Report
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced 3D Tabs */}
          <Tabs defaultValue="map" className="w-full">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-2xl blur-xl"></div>
              <TabsList className="relative grid w-full grid-cols-2 md:w-[500px] mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-2 h-auto">
                <TabsTrigger 
                  value="map" 
                  className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-4 px-6 font-semibold hover:scale-105"
                >
                  <Map className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  <span className="block text-sm">Map View</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="list" 
                  className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-4 px-6 font-semibold hover:scale-105"
                >
                  <List className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  <span className="block text-sm">List View</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="map" className="mt-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <Map className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Interactive Community Map
                      </h3>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <MapWrapper reports={allReports} isLoading={isLoading} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="list" className="mt-6">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* My Reports Section */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                          My Submitted Reports
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {myReports.length} {myReports.length === 1 ? 'report' : 'reports'} submitted
                        </p>
                      </div>
                    </div>
                    <ReportList reports={myReports} emptyMessage="You haven't submitted any reports yet." isLoading={isLoading} />
                  </div>
                </div>
                
                {/* Community Reports Section */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Latest Community Reports
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Recent activity from the community
                        </p>
                      </div>
                    </div>
                    <ReportList reports={allReports.slice(0, 10)} emptyMessage="No community reports yet. Be the first!" isLoading={isLoading} />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </main>
      <AppFooter />
    </div>
  );
}

export default withAuth(ReporterDashboard, { roles: ['reporter'] });
