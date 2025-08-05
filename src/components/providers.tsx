"use client";

import React from 'react';
import { AuthProvider } from '@/hooks/use-auth';
import { PageTransition } from '@/components/page-transition';
import { Toaster } from "@/components/ui/toaster";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <PageTransition>
        {children}
        <Toaster />
      </PageTransition>
    </AuthProvider>
  );
}
