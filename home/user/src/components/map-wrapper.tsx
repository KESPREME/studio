"use client";

import dynamic from "next/dynamic";
import type { Report } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import { MapPin } from "lucide-react";

const DynamicMap = dynamic(() => import('@/components/dynamic-map'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
      <MapPin className="w-12 h-12 text-muted-foreground/50 animate-bounce" />
      <p className="text-muted-foreground">Loading Map...</p>
      <Skeleton className="h-full w-full absolute" />
    </div>
  ),
});

interface MapWrapperProps {
  reports: Report[];
  isLoading: boolean;
}

export default function MapWrapper({ reports, isLoading }: MapWrapperProps) {
    if (isLoading && reports.length === 0) {
     return (
        <div className="h-[500px] w-full bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
          <MapPin className="w-12 h-12 text-muted-foreground/50 animate-bounce" />
          <p className="text-muted-foreground">Loading Map Data...</p>
          <Skeleton className="h-full w-full absolute" />
        </div>
      )
    }

  return (
    <DynamicMap reports={reports} />
  )
}
