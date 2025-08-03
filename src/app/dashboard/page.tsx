// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { PlusCircle, Map, List, Wind } from 'lucide-react';
import { RealtimeChannel } from '@supabase/supabase-js';


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
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

function ReporterDashboard() {
  const { user } = useAuth();
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();


  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedReports = await getReports();
      setAllReports(fetchedReports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast({
        title: "Error",
        description: "Could not fetch initial reports.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchReports();

    // Set up real-time subscription
    const channel = supabase
      .channel('reports-realtime-reporter')
      .on<Report>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload) => {
          console.log('Change received!', payload);
          toast({
            title: "Live Update",
            description: "The community reports have been updated.",
          });
          fetchReports();
        }
      )
      .subscribe();
      
    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };

  }, [fetchReports, toast]);
  
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline">Community Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
            </div>
            <Button asChild>
              <Link href="/report/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          </div>
          
          <Tabs defaultValue="map" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="map"><Map className="mr-2" />Map View</TabsTrigger>
              <TabsTrigger value="list"><List className="mr-2"/>List View</TabsTrigger>
            </TabsList>
            <TabsContent value="map" className="mt-6">
                 <div className="rounded-lg overflow-hidden shadow-md">
                   <MapWrapper reports={allReports} isLoading={isLoading} />
                </div>
            </TabsContent>
            <TabsContent value="list" className="mt-6">
                 <div className="grid gap-8 lg:grid-cols-2">
                    <div>
                        <h2 className="text-xl font-bold mb-4 font-headline">My Submitted Reports ({myReports.length})</h2>
                        <ReportList reports={myReports} emptyMessage="You haven't submitted any reports yet." isLoading={isLoading && myReports.length === 0} />
                    </div>
                     <div>
                        <h2 className="text-xl font-bold mb-4 font-headline">Latest Community Reports</h2>
                        <ReportList reports={allReports.slice(0, 10)} emptyMessage="No community reports yet. Be the first!" isLoading={isLoading} />
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
