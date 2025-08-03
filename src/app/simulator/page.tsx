// src/app/simulator/page.tsx
"use client";

import { Header } from '@/components/header';
import { AppFooter } from '@/components/app-footer';
import { GlobalDisasterSimulator } from '@/components/global-disaster-simulator';
import withAuth from '@/components/with-auth';

function SimulatorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <GlobalDisasterSimulator />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

// Secure this page to be accessible only by admin users
export default withAuth(SimulatorPage, { roles: ['admin'] });
