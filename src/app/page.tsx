import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { StatCard } from '@/components/stat-card';
import { HazardReportCard } from '@/components/hazard-report-card';
import type { Report } from '@/lib/types';
import MapWrapper from '@/components/map-wrapper';
import { AppFooter } from '@/components/app-footer';
import { getReports } from '@/lib/api';


export default async function Dashboard() {
  const reports: Report[] = await getReports();

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
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Dashboard</h1>
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

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4 font-headline">Hazard Map</h2>
              <div className="rounded-lg overflow-hidden shadow-md">
                <MapWrapper reports={reports} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4 font-headline">Latest Reports</h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {reports.slice(0, 10).map((report) => (
                  <HazardReportCard key={report._id as string} report={report} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
      <AppFooter />
    </div>
  );
}
