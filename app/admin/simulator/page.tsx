// src/app/admin/simulator/page.tsx
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import withAuth from "@/components/with-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MapWrapper from "@/components/map-wrapper";
import type { Report } from "@/lib/types";
import { SimulatorSettings } from "./_components/simulator-settings";
import { Header } from "@/components/header";
import { AlertTriangle, MapPin, Clock, FileText } from "lucide-react";

// Define the simulated report type that matches our API response
interface SimulatedReport {
  id: string;
  title: string;
  description: string;
  urgency: 'Low' | 'Moderate' | 'High';
  latitude: number;
  longitude: number;
  timestamp: string;
  type: string;
  imageUrl?: string;
}

// Convert SimulatedReport to Report for MapWrapper compatibility
const convertToMapReports = (simulatedReports: SimulatedReport[]): Report[] => {
  return simulatedReports.map(report => ({
    id: report.id,
    description: report.description,
    latitude: report.latitude,
    longitude: report.longitude,
    urgency: report.urgency as 'Low' | 'Moderate' | 'High',
    status: 'New' as const,
    imageUrl: report.imageUrl,
    reportedBy: 'AI Simulator',
    assignedTo: undefined,
    createdAt: report.timestamp,
    updatedAt: report.timestamp,
    resolvedAt: undefined,
  }));
};

function SimulatorPage() {
  const [reports, setReports] = useState<SimulatedReport[]>([]);
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
      // Since this page is already protected by withAuth, we can make the API call directly
      // The withAuth HOC ensures only authenticated admin users can access this page
      console.log('Making API request for simulation...');
      
      const response = await fetch('/api/simulate/disaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start simulation');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header Section */}
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                    <AlertTriangle className="h-8 w-8 text-white animate-pulse" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 drop-shadow-lg">
                  AI Disaster Simulation Center
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Use cutting-edge AI to model realistic disaster scenarios and generate comprehensive incident reports for training and preparedness 🎆
                </p>
                
                {/* Quick Stats */}
                <div className="flex justify-center gap-6 mt-6">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-200/50 dark:border-indigo-700/50">
                    <MapPin className="h-4 w-4 text-indigo-600 animate-pulse" />
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Location-Based</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200/50 dark:border-purple-700/50">
                    <AlertTriangle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI-Powered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Settings Panel */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold drop-shadow-sm">
                      Simulation Settings
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimulatorSettings 
                    onStartSimulation={handleStartSimulation} 
                    onCalculateResources={handleCalculateResources}
                    isLoading={isLoading}
                    isSimulating={isSimulating}
                    hasReports={reports.length > 0}
                  />
                  
                  {reports.length > 0 && (
                    <div className="mt-6">
                      <Button 
                        variant="outline" 
                        onClick={handleCalculateResources}
                        disabled={isLoading || isSimulating}
                        className="w-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-500 transition-all duration-300 font-semibold"
                      >
                        📊 Calculate Resource Allocation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Map Panel */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-purple-600 dark:text-purple-400 font-bold drop-shadow-sm">
                      Live Simulation Map
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-96 rounded-2xl overflow-hidden border border-white/10 dark:border-slate-700/50">
                    <MapWrapper 
                      reports={convertToMapReports(reports)} 
                      isLoading={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Reports Section */}
          {reports.length > 0 && (
            <div className="mt-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-pink-600 dark:text-pink-400 font-bold drop-shadow-sm">
                        Generated Reports ({reports.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reports.map((report, index) => (
                        <div key={report.id} className="group relative overflow-hidden border border-white/20 dark:border-slate-700/50 rounded-2xl p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:shadow-lg">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-1.5 rounded-lg ${
                                  report.urgency === 'High' ? 'bg-red-500/20' :
                                  report.urgency === 'Moderate' ? 'bg-yellow-500/20' :
                                  'bg-green-500/20'
                                }`}>
                                  <AlertTriangle className={`h-4 w-4 ${
                                    report.urgency === 'High' ? 'text-red-500' :
                                    report.urgency === 'Moderate' ? 'text-yellow-500' :
                                    'text-green-500'
                                  }`} />
                                </div>
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{report.title}</h3>
                                <Badge 
                                  variant={report.urgency === 'High' ? 'destructive' : 
                                          report.urgency === 'Moderate' ? 'default' : 'secondary'}
                                  className="font-medium"
                                >
                                  {report.urgency}
                                </Badge>
                              </div>
                              
                              <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">{report.description}</p>
                              
                              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                  <div className="p-1 bg-blue-500/20 rounded">
                                    <MapPin className="h-3 w-3 text-blue-600" />
                                  </div>
                                  <span className="font-mono">{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="p-1 bg-purple-500/20 rounded">
                                    <Clock className="h-3 w-3 text-purple-600" />
                                  </div>
                                  <span>{new Date(report.timestamp).toLocaleString()}</span>
                                </div>
                                {report.type && (
                                  <Badge variant="outline" className="text-xs bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-300 dark:border-indigo-600">
                                    {report.type}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="px-3 py-1 bg-gradient-to-r from-slate-500/10 to-slate-600/10 rounded-full">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                  #{index + 1}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-6 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Total: {reports.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-slate-600 dark:text-slate-400">High: {reports.filter(r => r.urgency === 'High').length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-slate-600 dark:text-slate-400">Moderate: {reports.filter(r => r.urgency === 'Moderate').length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-slate-600 dark:text-slate-400">Low: {reports.filter(r => r.urgency === 'Low').length}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setReports([])}
                        disabled={isLoading || isSimulating}
                        className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 transition-all duration-300 font-semibold"
                      >
                        🗑️ Clear Reports
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default withAuth(SimulatorPage, { roles: ['admin'] });
