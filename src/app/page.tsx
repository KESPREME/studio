
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { AppFooter } from '@/components/app-footer';
import { ShieldCheck, Map, AlertTriangle, UserCheck } from 'lucide-react';
import { ScrollReveal } from '@/components/scroll-reveal';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-40 relative overflow-hidden bg-primary/5">
          <div className="container px-4 md:px-6 z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24">
              <div className="flex flex-col justify-center space-y-4">
                <ScrollReveal delay={0.1}>
                  <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold shadow-sm">
                      Community Safety, Amplified
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                      Report Hazards, Protect Your Community
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      AlertFront empowers you to report local hazards quickly and efficiently, connecting you with response teams to make your area safer.
                    </p>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button asChild size="lg" className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                      <Link href="/login">
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </ScrollReveal>
              </div>

              {/* Interactive Hero Visual */}
              <div className="relative flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
                  <ScrollReveal delay={0.3} className="w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Map className="h-48 w-48 text-primary/10 animate-pulse-slow" />
                    </div>
                    <div className="absolute top-0 left-10 w-48 h-28 bg-card p-4 rounded-lg shadow-xl animate-float-slow-1">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                            <div>
                                <h4 className="font-bold">Pothole Reported</h4>
                                <p className="text-xs text-muted-foreground">Main St & 2nd Ave</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-10 w-56 h-32 bg-card p-4 rounded-lg shadow-xl animate-float-slow-2">
                         <div className="flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-green-500" />
                            <div>
                                <h4 className="font-bold">Team Dispatched</h4>
                                <p className="text-xs text-muted-foreground">Status: In Progress</p>
                            </div>
                        </div>
                    </div>
                     <div className="absolute -bottom-8 left-16 w-44 h-24 bg-card p-4 rounded-lg shadow-xl animate-float-slow-3">
                         <div className="flex items-center gap-3">
                            <UserCheck className="h-6 w-6 text-primary" />
                            <div>
                                <h4 className="font-bold">Report Verified</h4>
                                <p className="text-xs text-muted-foreground">Urgency: High</p>
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
          <div className="container px-4 md:px-6">
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
              <ScrollReveal delay={0.1}>
                <div className="grid gap-4 text-center p-6 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <AlertTriangle className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">1. Report an Issue</h3>
                  <p className="text-muted-foreground">
                    See a hazard? Open the app, fill out a quick form with details, photo, and location. Your report is instantly logged.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                 <div className="grid gap-4 text-center p-6 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ShieldCheck className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">2. Team Dispatch</h3>
                  <p className="text-muted-foreground">
                    The nearest NDRF team is immediately notified with all the details, ensuring a rapid and informed response.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                 <div className="grid gap-4 text-center p-6 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="flex items-center justify-center">
                     <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserCheck className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">3. Resolution & Update</h3>
                  <p className="text-muted-foreground">
                    The response team addresses the hazard, and the status is updated in real-time for everyone's awareness.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
