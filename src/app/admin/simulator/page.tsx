// src/app/admin/simulator/page.tsx
"use client";

import { Header } from "@/components/header";
import withAuth from "@/components/with-auth";
import { DisasterSimulator } from "@/app/admin/_components/disaster-simulator";
import { AppFooter } from "@/components/app-footer";

function SimulatorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">Disaster Response Simulator</h1>
            <p className="text-muted-foreground mt-2">
              Use AI to generate and analyze potential disaster scenarios and resource plans.
            </p>
          </div>
          <DisasterSimulator />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

// Secure this page to only be accessible by admins
export default withAuth(SimulatorPage, { roles: ['admin'] });
