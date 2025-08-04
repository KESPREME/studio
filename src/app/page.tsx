
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { AppFooter } from '@/components/app-footer';
import { ShieldCheck, Map, AlertTriangle, UserCheck, Users, Target, Siren, Zap, Globe, Activity } from 'lucide-react';
import { ScrollReveal } from '@/components/scroll-reveal';

// Custom SVG Icon Components for a more unique look
const IconRealTime = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <path d="M4.1 11.9a1 1 0 0 1 1.8 0L8 15.3l3.9-8.5a1 1 0 0 1 1.8 0L16 12.3l2.1-4.2a1 1 0 0 1 1.8 0l2.1 4.2" />
    <path d="M12 22a10 10 0 1 1 10-10" />
  </svg>
);

const IconDirectLine = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M12 2L8 6h8L12 2z" />
        <path d="M12 22l4-4H8l4 4z" />
        <path d="M12 3v18" />
    </svg>
);

const FeatureCard = ({ icon, title, children, delay = 0.1, gradientFrom, gradientTo }: { 
  icon: React.ReactNode, 
  title: string, 
  children: React.ReactNode, 
  delay?: number,
  gradientFrom: string,
  gradientTo: string
}) => (
  <ScrollReveal delay={delay}>
    <div className="group relative transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`p-4 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8 text-white" })}
          </div>
          <h3 className={`text-xl font-bold bg-gradient-to-r ${gradientFrom.replace('from-', 'from-').replace('/20', '')} ${gradientTo.replace('to-', 'to-').replace('/20', '')} bg-clip-text text-transparent`}>
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{children}</p>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </ScrollReveal>
);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header />
      <main className="flex-1 relative">
        {/* Enhanced Hero Section */}
        <section className="w-full pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-40 relative">
          <div className="container px-4 md:px-6 z-10 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24">
              <div className="flex flex-col justify-center space-y-6">
                <ScrollReveal delay={0.1}>
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur"></div>
                      <div className="relative inline-block bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl px-6 py-3 shadow-lg">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
                          <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Community Safety, Amplified
                          </span>
                        </div>
                      </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent animate-pulse">
                      Report Hazards, Protect Your Community
                    </h1>
                    <p className="max-w-[600px] text-slate-600 dark:text-slate-300 md:text-xl leading-relaxed">
                      AlertFront empowers you to report local hazards quickly and efficiently, connecting you with response teams to make your area safer.
                    </p>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <div className="flex flex-col gap-4 min-[400px]:flex-row">
                    <Button asChild size="lg" className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border-0">
                      <Link href="/login">
                        <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                        Get Started
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="group bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border-2 border-blue-500/30 dark:border-blue-400/30 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-105 transition-all duration-300">
                      <Link href="/community">
                        <Globe className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:animate-pulse" />
                        View Community
                      </Link>
                    </Button>
                  </div>
                </ScrollReveal>
              </div>

              {/* Enhanced Interactive Hero Visual - Rotating Circle Design */}
              <div className="relative flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
                <ScrollReveal delay={0.3} className="w-full h-full">
                  <div className="relative w-full aspect-square max-w-lg mx-auto">
                    {/* Central Hub Container */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative z-20">
                        <div className="w-40 h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-2xl rounded-full border-2 border-white/30 dark:border-slate-700/30 shadow-2xl flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full animate-pulse" style={{animationDuration: '4s'}}></div>
                          <div className="relative z-10 text-center">
                            <Map className="h-12 w-12 lg:h-16 lg:w-16 text-blue-500/40 dark:text-blue-400/40 mx-auto mb-2 animate-pulse" style={{animationDuration: '6s'}} />
                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">AlertFront</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Command Center</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rotating Circle System */}
                    <div className="absolute inset-0 animate-rotate-slow">
                      
                      {/* Card 1: Pothole Report */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-counter-rotate" style={{ transform: 'translateY(-140px)'}}>
                        <div className="group relative">
                          <div className="absolute -inset-2 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-2xl blur-lg opacity-80 group-hover:opacity-100 transition-all duration-700"></div>
                          <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 sm:p-4 rounded-xl shadow-2xl border border-red-200/50 dark:border-red-700/30 hover:scale-110 transition-all duration-500 w-64 sm:w-72 hover:shadow-red-200/50 dark:hover:shadow-red-900/30">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg shadow-lg"><AlertTriangle className="h-5 w-5 text-white" /></div>
                              <div>
                                <h4 className="font-bold text-sm">Pothole Reported</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Main St & 2nd Ave</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card 2: Team Dispatched */}
                      <div className="absolute top-1/2 left-1/2 animate-counter-rotate" style={{ transform: 'rotate(120deg) translateX(180px) rotate(-120deg)' }}>
                         <div className="group relative">
                           <div className="absolute -inset-2 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur-lg opacity-80 group-hover:opacity-100 transition-all duration-700"></div>
                           <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 sm:p-4 rounded-xl shadow-2xl border border-green-200/50 dark:border-green-700/50 hover:scale-110 transition-all duration-500 w-64 sm:w-72 hover:shadow-green-200/50 dark:hover:shadow-green-900/30">
                             <div className="flex items-center gap-3">
                               <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg"><ShieldCheck className="h-5 w-5 text-white" /></div>
                               <div>
                                 <h4 className="font-bold text-sm">Team Dispatched</h4>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">Response Unit #42</p>
                               </div>
                             </div>
                           </div>
                         </div>
                      </div>
                      
                      {/* Card 3: Report Verified */}
                      <div className="absolute top-1/2 left-1/2 animate-counter-rotate" style={{ transform: 'rotate(240deg) translateX(180px) rotate(-240deg)' }}>
                         <div className="group relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur-lg opacity-80 group-hover:opacity-100 transition-all duration-700"></div>
                            <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 sm:p-4 rounded-xl shadow-2xl border border-blue-200/50 dark:border-blue-700/50 hover:scale-110 transition-all duration-500 w-64 sm:w-72 hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg"><UserCheck className="h-5 w-5 text-white" /></div>
                                <div>
                                  <h4 className="font-bold text-sm">Report Verified</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Priority: High</p>
                                </div>
                              </div>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                  </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Simple, Lifesaving Process</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our streamlined three-step system ensures every report is handled with speed and care.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="mx-auto grid max-w-5xl items-start gap-12 py-12 lg:grid-cols-3 lg:gap-8">
              <FeatureCard 
                title="1. Report an Issue" 
                icon={<AlertTriangle className="h-8 w-8" />} 
                delay={0.1}
                gradientFrom="from-red-500/20"
                gradientTo="to-orange-500/20"
              >
                See a hazard? Open the app, fill out a quick form with details, photo, and location. Your report is instantly logged.
              </FeatureCard>
              <FeatureCard 
                title="2. Team Dispatch" 
                icon={<ShieldCheck className="h-8 w-8" />} 
                delay={0.2}
                gradientFrom="from-green-500/20"
                gradientTo="to-emerald-500/20"
              >
                The nearest NDRF team is immediately notified with all the details, ensuring a rapid and informed response.
              </FeatureCard>
              <FeatureCard 
                title="3. Resolution & Update" 
                icon={<UserCheck className="h-8 w-8" />} 
                delay={0.3}
                gradientFrom="from-blue-500/20"
                gradientTo="to-purple-500/20"
              >
                The response team addresses the hazard, and the status is updated in real-time for everyone's awareness.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* Why AlertFront Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6 mx-auto">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold shadow-sm">
                    Core Features
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Built for Safety and Speed</h2>
                   <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    AlertFront provides the tools necessary for effective community hazard management.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="mx-auto grid max-w-6xl items-center gap-8 py-12 lg:grid-cols-3 lg:gap-8">
              <FeatureCard 
                title="Quick Reporting" 
                icon={<AlertTriangle className="h-8 w-8" />} 
                delay={0.3}
                gradientFrom="from-red-500/20"
                gradientTo="to-orange-500/20"
              >
                Report hazards instantly with our streamlined interface. Upload photos, add descriptions, and pinpoint exact locations.
              </FeatureCard>
              <FeatureCard 
                title="Real-time Mapping" 
                icon={<Map className="h-8 w-8" />} 
                delay={0.4}
                gradientFrom="from-blue-500/20"
                gradientTo="to-cyan-500/20"
              >
                View all reported incidents on an interactive map. Track patterns and stay informed about your area's safety status.
              </FeatureCard>
              <FeatureCard 
                title="Direct Response" 
                icon={<IconDirectLine />} 
                delay={0.5}
                gradientFrom="from-green-500/20"
                gradientTo="to-emerald-500/20"
              >
                Your reports go directly to NDRF teams and local authorities for immediate action and coordinated response.
              </FeatureCard>
              <FeatureCard 
                title="Community Insights" 
                icon={<Users className="h-8 w-8" />} 
                delay={0.4}
                gradientFrom="from-purple-500/20"
                gradientTo="to-pink-500/20"
              >
                Access AI-powered community safety insights, trends, and actionable recommendations based on collective data.
              </FeatureCard>
              <FeatureCard 
                title="Smart Alerts" 
                icon={<Target className="h-8 w-8" />} 
                delay={0.5}
                gradientFrom="from-yellow-500/20"
                gradientTo="to-orange-500/20"
              >
                Receive intelligent notifications about hazards in your area and safety tips tailored to your location.
              </FeatureCard>
              <FeatureCard 
                title="Status Tracking" 
                icon={<Siren className="h-8 w-8" />} 
                delay={0.6}
                gradientFrom="from-indigo-500/20"
                gradientTo="to-purple-500/20"
              >
                Follow the progress of your reported issue from submission to resolution in real-time.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* Who We Help Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
             <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Two Roles, One Mission</h2>
                   <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Whether you're a vigilant citizen or a dedicated responder, you have a vital part to play.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="mx-auto grid items-start gap-8 py-12 md:grid-cols-2">
              <ScrollReveal delay={0.2}>
                <div className="grid gap-6 p-8 rounded-lg border-2 border-transparent hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                    <UserCheck className="h-10 w-10 text-primary" />
                    <h3 className="text-2xl font-bold">Community Reporters</h3>
                    <p className="text-muted-foreground">As a community member, you are the first line of defense. Report hazards like fallen trees, flooding, or power outages to alert response teams and protect your neighbors.</p>
                    <Button asChild variant="outline">
                      <Link href="/report/new">Report an Issue</Link>
                    </Button>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                 <div className="grid gap-6 p-8 rounded-lg border-2 border-transparent hover:border-accent/50 hover:bg-accent/5 transition-all duration-300">
                    <ShieldCheck className="h-10 w-10 text-accent" />
                    <h3 className="text-2xl font-bold">NDRF Responders</h3>
                    <p className="text-muted-foreground">As an NDRF team member, you get a dedicated dashboard to view, manage, and track all reported incidents, enabling you to coordinate and dispatch resources effectively.</p>
                     <Button asChild variant="secondary">
                      <Link href="/admin">Go to Dashboard</Link>
                    </Button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5 text-center">
           <div className="container px-4 md:px-6 mx-auto">
              <ScrollReveal>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Ready to Make Your Community Safer?</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed mt-4">
                  Join AlertFront today. Your involvement is crucial for building a more resilient and secure environment for everyone.
                </p>
                <div className="mt-8">
                  <Button asChild size="lg" className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                    <Link href="/login">
                      Sign Up & Get Started
                    </Link>
                  </Button>
                </div>
              </ScrollReveal>
           </div>
        </section>

      </main>
      <AppFooter />
    </div>
  );
}
