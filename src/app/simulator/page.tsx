// src/app/simulator/page.tsx
"use client";

import { Header } from '@/components/header';
import { AppFooter } from '@/components/app-footer';
import { DisasterSimulationTool } from './_components/disaster-simulation-tool';
import withAuth from '@/components/with-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function SimulatorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
           <div className="mb-6">
            <Button asChild variant="outline">
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <DisasterSimulationTool />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

// Secure this page to be accessible only by admin users
export default withAuth(SimulatorPage, { roles: ['admin'] });
