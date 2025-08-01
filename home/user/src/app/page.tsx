
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { AppFooter } from '@/components/app-footer';
import { ShieldCheck, Map, AlertTriangle, UserCheck, Users, Target, Siren } from 'lucide-react';
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

const FeatureCard = ({ icon, title, children, delay = 0.1 }: { icon: React.ReactNode, title: string, children: React.ReactNode, delay?: number }) => (
  <ScrollReveal delay={delay}>
    <div className="grid gap-4 text-center p-6 rounded-lg hover:bg-primary/5 transition-colors duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold font-headline">{title}</h3>
      <p className="text-muted-foreground">{children}</p>
    </div>
  </ScrollReveal>
);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-40 relative overflow-hidden bg-primary/5">
          <div className="container px-4 md:px-6 z-10 mx-auto">
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
              <FeatureCard title="1. Report an Issue" icon={<AlertTriangle className="h-8 w-8" />} delay={0.1}>
                See a hazard? Open the app, fill out a quick form with details, photo, and location. Your report is instantly logged.
              </FeatureCard>
              <FeatureCard title="2. Team Dispatch" icon={<ShieldCheck className="h-8 w-8" />} delay={0.2}>
                The nearest NDRF team is immediately notified with all the details, ensuring a rapid and informed response.
              </FeatureCard>
              <FeatureCard title="3. Resolution & Update" icon={<UserCheck className="h-8 w-8" />} delay={0.3}>
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
            <div className="mx-auto grid max-w-5xl items-start gap-12 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
               <FeatureCard title="Real-Time Alerts" icon={<IconRealTime />} delay={0.1}>
                  Instantly report hazards and receive notifications about new dangers in your area.
              </FeatureCard>
               <FeatureCard title="Interactive Map" icon={<Map className="h-8 w-8" />} delay={0.2}>
                  Visualize all reported hazards on a live, interactive map to stay aware of your surroundings.
              </FeatureCard>
               <FeatureCard title="Direct Line to Responders" icon={<IconDirectLine />} delay={0.3}>
                  Your reports are sent directly to NDRF teams, ensuring a fast and effective response.
              </FeatureCard>
               <FeatureCard title="Community Powered" icon={<Users className="h-8 w-8" />} delay={0.4}>
                  Be the eyes and ears of your community. Every report you make contributes to a safer neighborhood.
              </FeatureCard>
               <FeatureCard title="Targeted Notifications" icon={<Target className="h-8 w-8" />} delay={0.5}>
                  Receive high-urgency alerts only when a hazard is reported in your immediate vicinity.
              </FeatureCard>
               <FeatureCard title="Status Tracking" icon={<Siren className="h-8 w-8" />} delay={0.6}>
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
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
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
