// src/app/admin/simulator/page.tsx
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import withAuth from "@/components/with-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MapWrapper from "@/components/map-wrapper";
import type { Report } from "@/lib/types";
import { SimulatorSettings } from "./_components/simulator-settings";
import { useToast } from "@/hooks/use-toast";

function SimulatorPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const handleStartSimulation = async (values: any) => {
    setIsSimulating(true);
    setIsLoading(true);
    setReports([]);
    toast({
      title: "Simulation Starting",
      description: `Simulating a ${values.intensity} ${values.disasterType}.`,
    });

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start simulation');
      }

      const generatedReports = await response.json();
      setReports(generatedReports);

      toast({
        title: "Simulation Complete",
        description: `${generatedReports.length} reports have been generated and added to the map.`,
      });
    } catch (error: any) {
      console.error("Simulation error:", error);
      toast({
        title: "Simulation Failed",
        description: error.message || "Could not run the simulation. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
      setIsLoading(false);
    }
  };

  const handleCalculateResources = () => {
    const resourceNeeds = {
      'Emergency Team': 0,
      'Maintenance Crew': 0,
      'Volunteer Group': 0,
    };

    reports.forEach(report => {
      if (report.urgency === 'High') {
        resourceNeeds['Emergency Team']++;
      } else if (report.urgency === 'Moderate') {
        resourceNeeds['Maintenance Crew']++;
      } else {
        resourceNeeds['Volunteer Group']++;
      }
    });

    toast({
      title: "Resource Allocation Suggestion",
      description: (
        <ul className="list-disc pl-5">
          <li>Emergency Teams: {resourceNeeds['Emergency Team']}</li>
          <li>Maintenance Crews: {resourceNeeds['Maintenance Crew']}</li>
          <li>Volunteer Groups: {resourceNeeds['Volunteer Group']}</li>
        </ul>
      ),
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">Disaster Simulator</h1>
            <p className="text-muted-foreground mt-2">
              Create and visualize disaster scenarios to test response strategies and resource allocation.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] rounded-md overflow-hidden shadow-md">
                    <MapWrapper reports={reports} isLoading={isLoading} />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Simulator Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimulatorSettings
                    onStartSimulation={handleStartSimulation}
                    onCalculateResources={handleCalculateResources}
                    isSimulating={isSimulating}
                    hasReports={reports.length > 0}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(SimulatorPage, { roles: ['admin'] });
