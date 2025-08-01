// src/app/report/new/page.tsx
"use client";

import { Header } from "@/components/header";
import { ReportForm } from "@/components/report-form";
import withAuth from "@/components/with-auth";

function NewReportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">Report a Hazard</h1>
            <p className="text-muted-foreground mt-2">Help your community by reporting issues you see.</p>
          </div>
          <ReportForm />
        </div>
      </main>
    </div>
  );
}

export default withAuth(NewReportPage, { roles: ['reporter', 'admin'] });
