// src/app/report/new/page.tsx
"use client";

import React from 'react';
import { Header } from "@/components/header";
import { ReportForm } from "@/components/report-form";
import withAuth from "@/components/with-auth";
import { AlertTriangle, Activity } from 'lucide-react';

function NewReportPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50/20 dark:from-slate-950 dark:via-orange-950/30 dark:to-red-950/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8 relative">
        <div className="max-w-3xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl text-center">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg animate-pulse">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                    Report a Hazard
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 text-lg font-medium mt-2">
                    Help your community by reporting issues you see 🚨
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full border border-orange-200/50 dark:border-orange-700/50">
                  <Activity className="h-4 w-4 text-orange-600 animate-pulse" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Quick & Easy Reporting</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full border border-red-200/50 dark:border-red-700/50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Immediate Response</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Report Form Container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <ReportForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(NewReportPage, { roles: ['reporter', 'admin'] });
