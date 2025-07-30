"use client";

import dynamic from "next/dynamic";
import type { Report } from "@/lib/types";

const DynamicMap = dynamic(() => import('@/components/dynamic-map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted rounded-lg animate-pulse" />,
});

interface MapWrapperProps {
  reports: Report[];
}

export default function MapWrapper({ reports }: MapWrapperProps) {
  return (
    <DynamicMap reports={reports} />
  )
}
