// src/app/admin/page.tsx
"use client";

import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { AppFooter } from '@/components/app-footer';
import withAuth from '@/components/with-auth';
import { DisasterSimulationTool } from '@/components/disaster-simulation-tool';

function AdminDashboard() {
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

          <div className="mt-6">
            <DisasterSimulationTool />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

export default withAuth(AdminDashboard, { roles: ['admin'] });
