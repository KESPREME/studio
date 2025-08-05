// app/community/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedCard } from "@/components/animated-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/header";
import { 
  TrendingUp, 
  Shield, 
  Lightbulb, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  Target,
  BookOpen,
  RefreshCw,
  BarChart3,
  Sparkles,
  Zap,
  Brain,
  Activity
} from "lucide-react";

// Interface that handles both AI and fallback responses
interface CommunityInsights {
  summary: {
    totalReports: number;
    highPriorityCount?: number;
    resolvedCount?: number;
    averageResponseTime: string;
  };
  guidelines: string[] | Array<{
    title: string;
    description: string;
    priority: string;
    category?: string;
    actionItems?: string[];
  }>;
  safetyTips: string[] | Array<{
    category: string;
    tip: string;
    reasoning?: string;
    applicability?: string;
  }>;
  preventionStrategies: string[] | Array<{
    strategy: string;
    description: string;
    targetAudience?: string;
    expectedImpact?: string;
  }>;
  communityActions: string[] | Array<{
    action: string;
    description: string;
    difficulty?: string;
    timeframe?: string;
    benefits?: string[];
  }>;
  trends: string[] | Array<{
    emergingPatterns?: string[];
    seasonalTrends?: string[];
    geographicHotspots?: Array<{
      area: string;
      issueType: string;
      frequency: number;
    }>;
  }>;
  aiGenerated?: boolean;
}

function CommunityDashboard() {
  const [insights, setInsights] = useState<CommunityInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('30');
  const { toast } = useToast();

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/community/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeframe: parseInt(timeframe),
          includeResolved: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch community insights');
      }

      const data = await response.json();
      setInsights(data);

      toast({
        title: "Insights Updated",
        description: "Community insights have been refreshed with the latest data.",
      });
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast({
        title: "Error",
        description: "Failed to load community insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [timeframe]);

  // Enhanced renderer that handles both string arrays and complex objects
  const renderInsightsList = (items: any, icon: React.ReactNode, gradientFrom: string, gradientTo: string) => {
    // Handle undefined/null cases
    if (!items) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
            <Activity className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No insights available yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Try refreshing to generate new insights</p>
        </div>
      );
    }

    // Convert complex objects to strings if needed
    let displayItems: string[] = [];
    
    if (Array.isArray(items)) {
      displayItems = items.map((item, index) => {
        if (typeof item === 'string') {
          return item;
        } else if (typeof item === 'object') {
          // Handle different object types
          if (item.title && item.description) {
            return `${item.title}: ${item.description}`;
          } else if (item.tip) {
            return item.tip;
          } else if (item.strategy) {
            return `${item.strategy}: ${item.description || ''}`;
          } else if (item.action) {
            return `${item.action}: ${item.description || ''}`;
          } else if (item.emergingPatterns) {
            return item.emergingPatterns.join(', ');
          }
          // Fallback: convert object to readable string
          return Object.values(item).filter(v => typeof v === 'string').join(': ');
        }
        return String(item);
      });
    } else {
      displayItems = [String(items)];
    }

    if (displayItems.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
            <Activity className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No insights available yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Try refreshing to generate new insights</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {displayItems.map((item, index) => (
          <div 
            key={index} 
            className="group relative transform transition-all duration-500 hover:scale-102 hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            <div className="relative flex items-start space-x-4 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex-shrink-0">
                <div className={`p-3 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-white" })}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                  {item}
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <main className="container mx-auto px-4 py-8 relative z-10 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-full border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm shadow-lg">
              <div className="relative">
                <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 drop-shadow-sm">
                AI-Powered Community Analysis
              </span>
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight drop-shadow-lg">
                Community
                <span className="block text-blue-600 dark:text-blue-400">
                  Insights
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Harness the power of AI to transform community incident reports into actionable safety strategies
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={fetchInsights}
                disabled={isLoading}
                className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 px-8 py-4 text-lg rounded-2xl border-0"
              >
                <RefreshCw className={`h-6 w-6 mr-3 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span>
                  {isLoading ? 'Analyzing Community Data...' : 'Generate Fresh Insights'}
                </span>
                {!isLoading && <Zap className="h-5 w-5 ml-2 group-hover:animate-pulse" />}
              </Button>
            </div>
          </div>

          {/* Enhanced Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="space-y-6">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-purple-400 border-b-transparent animate-spin animate-reverse"></div>
                  <Brain className="absolute inset-0 m-auto h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 drop-shadow-sm">
                    Analyzing Community Data
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Our AI is processing incident reports and generating actionable insights...
                  </p>
                </div>
                <div className="flex justify-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" 
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {insights && (
            <>
              {/* Enhanced 3D Summary Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                {/* Total Reports Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/50"></div>
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Reports</CardTitle>
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2 drop-shadow-sm">
                        {insights.summary.totalReports}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Last {timeframe} days</p>
                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-10 -mb-10"></div>
                    </CardContent>
                  </Card>
                </div>

                {/* High Priority Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-950/50"></div>
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">High Priority</CardTitle>
                      <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-4xl font-black text-red-600 dark:text-red-400 mb-2 drop-shadow-sm">
                        {insights.summary.highPriorityCount || 0}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Urgent incidents</p>
                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-transparent rounded-full -mr-10 -mb-10"></div>
                    </CardContent>
                  </Card>
                </div>

                {/* Resolved Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/50"></div>
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Resolved</CardTitle>
                      <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2 drop-shadow-sm">
                        {insights.summary.resolvedCount || 0}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Completed incidents</p>
                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-10 -mb-10"></div>
                    </CardContent>
                  </Card>
                </div>

                {/* Average Response Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/50"></div>
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Avg Response</CardTitle>
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2 drop-shadow-sm">
                        {insights.summary.averageResponseTime}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Response time</p>
                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-10 -mb-10"></div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Enhanced 3D Tabs Navigation */}
              <Tabs defaultValue="guidelines" className="w-full">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl"></div>
                  <TabsList className="relative grid w-full grid-cols-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-2 h-auto">
                    <TabsTrigger 
                      value="guidelines" 
                      className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-4 px-6 font-semibold hover:scale-105"
                    >
                      <BookOpen className="h-5 w-5 mb-2 mx-auto group-hover:animate-pulse" />
                      <span className="block text-sm">Guidelines</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="safety" 
                      className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-4 px-6 font-semibold hover:scale-105"
                    >
                      <Shield className="h-5 w-5 mb-2 mx-auto group-hover:animate-pulse" />
                      <span className="block text-sm">Safety Tips</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="prevention" 
                      className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-4 px-6 font-semibold hover:scale-105"
                    >
                      <Lightbulb className="h-5 w-5 mb-2 mx-auto group-hover:animate-pulse" />
                      <span className="block text-sm">Prevention</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="community" 
                      className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-4 px-6 font-semibold hover:scale-105"
                    >
                      <Users className="h-5 w-5 mb-2 mx-auto group-hover:animate-pulse" />
                      <span className="block text-sm">Community</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="trends" 
                      className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-4 px-6 font-semibold hover:scale-105"
                    >
                      <TrendingUp className="h-5 w-5 mb-2 mx-auto group-hover:animate-pulse" />
                      <span className="block text-sm">Trends</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="guidelines" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Community Guidelines
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderInsightsList(insights.guidelines, <Target className="h-4 w-4" />, "from-blue-500", "to-blue-600")}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="safety" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Safety Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderInsightsList(insights.safetyTips, <Shield className="h-4 w-4" />, "from-green-500", "to-green-600")}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="prevention" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Prevention Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderInsightsList(insights.preventionStrategies, <Lightbulb className="h-4 w-4" />, "from-yellow-500", "to-orange-500")}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="community" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Community Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderInsightsList(insights.communityActions, <Users className="h-4 w-4" />, "from-purple-500", "to-purple-600")}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="trends" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Trends & Patterns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderInsightsList(insights.trends, <TrendingUp className="h-4 w-4" />, "from-indigo-500", "to-indigo-600")}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default CommunityDashboard;
