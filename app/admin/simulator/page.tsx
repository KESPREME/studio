// src/app/admin/simulator/page.tsx
"use client";

import "./simulator-animations.css";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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
  // Safety check to ensure simulatedReports is an array
  if (!Array.isArray(simulatedReports)) {
    console.warn('simulatedReports is not an array:', simulatedReports);
    return [];
  }

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

    // Safety check to ensure reports is an array
    if (Array.isArray(reports)) {
      reports.forEach(report => {
        if (report.urgency === 'High') {
          resourceNeeds['Emergency Team']++;
        } else if (report.urgency === 'Moderate') {
          resourceNeeds['Maintenance Crew']++;
        } else {
          resourceNeeds['Volunteer Group']++;
        }
      });
    }

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

      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="particle" style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ top: '20%', left: '80%', animationDelay: '1s' }}></div>
        <div className="particle" style={{ top: '60%', left: '20%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ top: '80%', left: '70%', animationDelay: '3s' }}></div>
        <div className="particle" style={{ top: '40%', left: '90%', animationDelay: '4s' }}></div>
        <div className="particle" style={{ top: '70%', left: '5%', animationDelay: '5s' }}></div>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10 animate-in slide-in-from-bottom-4 duration-1000">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header Section with 3D Effects */}
          <div className="text-center space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500 hover:-translate-y-2 group-hover:border-indigo-300 dark:group-hover:border-indigo-600"
                   style={{
                     transformStyle: 'preserve-3d',
                     perspective: '1000px'
                   }}>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative">
                    <AlertTriangle className="h-8 w-8 text-white animate-pulse" />
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 drop-shadow-lg transition-all duration-500 hover:text-indigo-500 dark:hover:text-indigo-300 animate-in slide-in-from-top-4 duration-1000 delay-300">
                  AI Disaster Simulation Center
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300">
                  Use cutting-edge AI to model realistic disaster scenarios and generate comprehensive incident reports for training and preparedness 🎆
                </p>

                {/* Quick Stats with 3D Hover Effects */}
                <div className="flex justify-center gap-6 mt-6">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-200/50 dark:border-indigo-700/50 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-300/70 dark:hover:border-indigo-600/70 transform hover:scale-110 hover:-translate-y-1 hover:rotate-1 transition-all duration-500 cursor-pointer hover:shadow-lg">
                    <MapPin className="h-4 w-4 text-indigo-600 animate-pulse hover:animate-bounce" />
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Location-Based</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200/50 dark:border-purple-700/50 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-300/70 dark:hover:border-purple-600/70 transform hover:scale-110 hover:-translate-y-1 hover:-rotate-1 transition-all duration-500 cursor-pointer hover:shadow-lg">
                    <AlertTriangle className="h-4 w-4 text-purple-600 hover:animate-spin" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI-Powered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-stretch">
            {/* Enhanced Settings Panel with 3D Effects */}
            <div className="relative group h-full perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
              <Card className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl h-full flex flex-col transform hover:scale-[1.01] hover:-translate-y-2 group-hover:border-indigo-300 dark:group-hover:border-indigo-600"
                   style={{
                     transformStyle: 'preserve-3d',
                     perspective: '1000px'
                   }}>
                <CardHeader className="pb-4 transform transition-all duration-500 group-hover:translate-z-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-500 hover:-translate-y-1 group-hover:animate-pulse">
                      <AlertTriangle className="h-5 w-5 text-white group-hover:animate-bounce" />
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold drop-shadow-sm hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-300">
                      Simulation Settings
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <SimulatorSettings 
                    onStartSimulation={handleStartSimulation} 
                    onCalculateResources={handleCalculateResources}
                    isLoading={isLoading}
                    isSimulating={isSimulating}
                    hasReports={Array.isArray(reports) && reports.length > 0}
                  />
                  
                  {Array.isArray(reports) && reports.length > 0 && (
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={handleCalculateResources}
                        disabled={isLoading || isSimulating}
                        className="w-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-300 dark:border-purple-600 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-500 font-semibold transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:hover:scale-100 disabled:hover:translate-y-0"
                      >
                        <span className="inline-flex items-center gap-2 transform transition-transform duration-300 hover:scale-110">
                          📊 Calculate Resource Allocation
                        </span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Map Panel with 3D Effects */}
            <div className="relative group h-full perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
              <Card className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl h-full flex flex-col transform hover:scale-[1.01] hover:-translate-y-2 group-hover:border-purple-300 dark:group-hover:border-purple-600"
                   style={{
                     transformStyle: 'preserve-3d',
                     perspective: '1000px'
                   }}>
                <CardHeader className="pb-4 transform transition-all duration-500 group-hover:translate-z-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-110 hover:-rotate-12 transition-all duration-500 hover:-translate-y-1 group-hover:animate-pulse">
                      <MapPin className="h-5 w-5 text-white group-hover:animate-bounce" />
                    </div>
                    <span className="text-purple-600 dark:text-purple-400 font-bold drop-shadow-sm hover:text-purple-500 dark:hover:text-purple-300 transition-colors duration-300">
                      Live Simulation Map
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-1 transform transition-all duration-500 group-hover:translate-z-2">
                  <div className="h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-700/30 dark:border-slate-600/50 shadow-inner bg-gradient-to-br from-slate-900/20 to-slate-800/30 hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-500">
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
          {Array.isArray(reports) && reports.length > 0 && (
            <div className="mt-8">
              <div className="relative group perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-3xl opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
                <Card className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl transform hover:scale-[1.01] hover:-translate-y-2 group-hover:border-pink-300 dark:group-hover:border-pink-600"
                     style={{
                       transformStyle: 'preserve-3d',
                       perspective: '1000px'
                     }}>
                  <CardHeader className="pb-4 transform transition-all duration-500 group-hover:translate-z-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-500 hover:-translate-y-1 group-hover:animate-pulse">
                        <FileText className="h-5 w-5 text-white group-hover:animate-bounce" />
                      </div>
                      <span className="text-pink-600 dark:text-pink-400 font-bold drop-shadow-sm hover:text-pink-500 dark:hover:text-pink-300 transition-colors duration-300">
                        Generated Reports ({Array.isArray(reports) ? reports.length : 0})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reports.map((report, index) => (
                        <div
                          key={report.id}
                          className="group relative overflow-hidden border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.01] hover:-translate-y-1"
                          style={{
                            animationDelay: `${index * 100}ms`,
                            transformStyle: 'preserve-3d'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 shimmer"></div>
                          <div className="relative flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-1.5 rounded-lg transform hover:scale-110 hover:rotate-12 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                                  report.urgency === 'High' ? 'bg-red-500/20 hover:bg-red-500/30 hover:shadow-red-500/25' :
                                  report.urgency === 'Moderate' ? 'bg-yellow-500/20 hover:bg-yellow-500/30 hover:shadow-yellow-500/25' :
                                  'bg-green-500/20 hover:bg-green-500/30 hover:shadow-green-500/25'
                                }`}>
                                  <AlertTriangle className={`h-4 w-4 transition-all duration-300 hover:animate-pulse ${
                                    report.urgency === 'High' ? 'text-red-500' :
                                    report.urgency === 'Moderate' ? 'text-yellow-500' :
                                    'text-green-500'
                                  }`} />
                                </div>
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 transform hover:scale-105">{report.title}</h3>
                                <Badge
                                  variant={report.urgency === 'High' ? 'destructive' :
                                          report.urgency === 'Moderate' ? 'default' : 'secondary'}
                                  className="font-medium transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg cursor-pointer"
                                >
                                  {report.urgency}
                                </Badge>
                              </div>
                              
                              <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">{report.description}</p>
                              
                              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2 group/location hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                                  <div className="p-1 bg-blue-500/20 rounded transform group-hover/location:scale-110 group-hover/location:rotate-12 transition-all duration-300 group-hover/location:bg-blue-500/30 group-hover/location:shadow-lg group-hover/location:shadow-blue-500/25">
                                    <MapPin className="h-3 w-3 text-blue-600 group-hover/location:animate-bounce" />
                                  </div>
                                  <span className="font-mono transform group-hover/location:scale-105 transition-transform duration-300">{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
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
                          <span className="font-medium text-slate-700 dark:text-slate-300">Total: {Array.isArray(reports) ? reports.length : 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-slate-600 dark:text-slate-400">High: {Array.isArray(reports) ? reports.filter(r => r.urgency === 'High').length : 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-slate-600 dark:text-slate-400">Moderate: {Array.isArray(reports) ? reports.filter(r => r.urgency === 'Moderate').length : 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-slate-600 dark:text-slate-400">Low: {Array.isArray(reports) ? reports.filter(r => r.urgency === 'Low').length : 0}</span>
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

      {/* Enhanced Loading Overlay */}
      {(isLoading || isSimulating) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-2xl transform animate-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animate-reverse"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 animate-pulse">
                  {isSimulating ? '🚀 Generating AI Simulation...' : '⚡ Processing...'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 animate-pulse">
                  {isSimulating ? 'Creating realistic disaster scenarios and reports' : 'Please wait while we process your request'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(SimulatorPage, { roles: ['admin'] });
