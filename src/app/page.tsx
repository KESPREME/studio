import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { AppFooter } from '@/components/app-footer';
import { ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                    Community Safety
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Report Hazards, Protect Your Community
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    AlertFront empowers you to report local hazards quickly and efficiently, connecting you with response teams to make your area safer.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
               <img
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="community safety team"
                className="mx-auto aspect-[3/2] overflow-hidden rounded-xl object-cover sm:w-full"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A simple three-step process to ensure community safety and rapid response.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-12 py-12 lg:grid-cols-3 lg:gap-8">
              <div className="grid gap-1 text-center">
                 <ShieldCheck className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-lg font-bold">1. Report an Issue</h3>
                <p className="text-sm text-muted-foreground">
                  See a hazard? Open the app, fill out a quick form with details and location.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                 <ShieldCheck className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-lg font-bold">2. Team Dispatch</h3>
                <p className="text-sm text-muted-foreground">
                  The nearest NDRF team is notified with all the details of your report.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                 <ShieldCheck className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-lg font-bold">3. Resolution</h3>
                <p className="text-sm text-muted-foreground">
                  The response team addresses the hazard, and the status is updated in the system.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}