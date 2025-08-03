// src/app/admin/simulator/page.tsx
"use client";

import withAuth from "@/components/with-auth";
import { Header } from "@/components/header";
import { AppFooter } from "@/components/app-footer";
import { DisasterSimulator } from "./_components/disaster-simulator";

function SimulatorPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <DisasterSimulator />
                </div>
            </main>
            <AppFooter />
        </div>
    );
}

export default withAuth(SimulatorPage, { roles: ['admin'] });
