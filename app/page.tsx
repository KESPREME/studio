"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { AppFooter } from '@/components/app-footer';
import { AnimatedButton } from '@/components/animated-button';
import { FloatingElementsBlue } from '@/components/floating-elements';
import { ShieldCheck, Map, AlertTriangle, UserCheck, Users, Target, Siren, Zap, Globe, Activity, Camera, Lock, ChevronRight, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SolarSystem } from '../components/solar-system';

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

const FeatureCard = ({ icon, title, children, delay = 0.1, gradientFrom, gradientTo, titleColor = "text-slate-800 dark:text-white" }: {
  icon: React.ReactNode,
  title: string,
  children: React.ReactNode,
  delay?: number,
  gradientFrom: string,
  gradientTo: string,
  titleColor?: string
}) => (
  <ScrollReveal delay={delay} forceVisible={true}>
    <div className="group relative opacity-100 cursor-pointer card-spacing">
      {/* Very subtle layered gradient backgrounds */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-3xl blur-sm opacity-5 group-hover:opacity-15 transition-all duration-1000`}></div>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-3xl blur-lg opacity-3 group-hover:opacity-10 transition-all duration-1000`}></div>

      {/* Gentle border gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-3xl opacity-0 group-hover:opacity-50 transition-all duration-1000 p-0.5`}>
        <div className="w-full h-full bg-white/95 dark:bg-slate-900/90 rounded-3xl"></div>
      </div>

      <div className="relative bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/40 rounded-3xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-1000 group-hover:bg-white/98 dark:group-hover:bg-slate-900/95">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`relative p-4 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl shadow-md group-hover:scale-102 transition-all duration-1000 group-hover:shadow-lg overflow-hidden`}>
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-2000 ease-out"></div>
            {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8 text-white relative z-10 transition-all duration-1000" })}
          </div>
          <h3 className={`text-xl font-bold ${titleColor}`}>
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{children}</p>
        </div>
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-60 transition-all duration-1000">
          <div className={`w-1.5 h-1.5 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full animate-pulse transition-all duration-1000`}></div>
        </div>
      </div>
    </div>
  </ScrollReveal>
);

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrame: number;
    let lastTime = 0;
    const throttleDelay = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastTime >= throttleDelay) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        lastTime = currentTime;
      }
    };

    // Smooth interpolation for the gradient position
    const smoothUpdate = () => {
      setSmoothPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1, // Smooth interpolation factor
        y: prev.y + (mousePosition.y - prev.y) * 0.1
      }));
      animationFrame = requestAnimationFrame(smoothUpdate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrame = requestAnimationFrame(smoothUpdate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [mousePosition.x, mousePosition.y]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <FloatingElementsBlue />
      {/* Enhanced mouse-following gradient for both themes */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 opacity-15 dark:opacity-25"
        style={{
          background: `radial-gradient(800px circle at ${smoothPosition.x}px ${smoothPosition.y}px,
            rgba(59, 130, 246, 0.06),
            rgba(147, 51, 234, 0.04),
            rgba(34, 197, 94, 0.04),
            transparent 60%)`
        }}
      />

      {/* Light mode subtle animated background */}
      <div className="fixed inset-0 -z-20 opacity-100 dark:opacity-0 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-green-50/40 via-transparent to-blue-50/40 animate-gradient-flow-slow"></div>

        {/* Gentle floating particles for light mode - Optimized */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-blue-400/15 rounded-full animate-bounce-gentle" style={{ animationDelay: '0s', animationDuration: '8s' }}></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/12 rounded-full animate-bounce-gentle" style={{ animationDelay: '5s', animationDuration: '10s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 bg-green-400/18 rounded-full animate-bounce-gentle" style={{ animationDelay: '10s', animationDuration: '12s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-0.5 h-0.5 bg-orange-400/15 rounded-full animate-bounce-gentle" style={{ animationDelay: '7s', animationDuration: '9s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cyan-400/12 rounded-full animate-bounce-gentle" style={{ animationDelay: '3s', animationDuration: '11s' }}></div>
          <div className="absolute top-1/3 left-3/4 w-0.5 h-0.5 bg-pink-400/15 rounded-full animate-bounce-gentle" style={{ animationDelay: '12s', animationDuration: '13s' }}></div>
        </div>
      </div>
      {/* Subtle and Elegant Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Refined base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/15 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800/30"></div>

        {/* Gentle flowing gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/15 via-transparent to-purple-100/15 dark:from-blue-900/8 dark:via-transparent dark:to-purple-900/8 animate-gradient-flow-x"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-green-100/12 via-transparent to-blue-100/12 dark:from-green-900/6 dark:via-transparent dark:to-blue-900/6 animate-gradient-flow-x" style={{ animationDelay: '12s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-100/10 via-transparent to-pink-100/10 dark:from-purple-900/5 dark:via-transparent dark:to-pink-900/5 animate-gradient-flow-y" style={{ animationDelay: '8s' }}></div>

        {/* Subtle floating gradient orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-gradient-to-r from-blue-300/15 to-purple-300/15 dark:from-blue-400/8 dark:to-purple-400/8 rounded-full blur-3xl animate-subtle-drift"></div>
        <div className="absolute bottom-0 -right-4 w-80 h-80 bg-gradient-to-r from-green-300/12 to-blue-300/12 dark:from-green-400/6 dark:to-blue-400/6 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-300/10 to-pink-300/10 dark:from-purple-400/5 dark:to-pink-400/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '15s' }}></div>

        {/* Minimal ambient elements */}
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-orange-200/8 to-red-200/8 dark:from-orange-400/4 dark:to-red-400/4 rounded-full blur-2xl animate-breathe" style={{ animationDelay: '20s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-gradient-to-tr from-cyan-200/10 to-blue-200/10 dark:from-cyan-400/5 dark:to-blue-400/5 rounded-full blur-2xl animate-subtle-drift" style={{ animationDelay: '25s' }}></div>

        {/* Very subtle mesh gradient overlay */}
        <div className="absolute inset-0 opacity-20 dark:opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/15 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-green-50/20 via-transparent to-blue-50/20 dark:from-green-950/10 dark:via-transparent dark:to-blue-950/10"></div>
        </div>


      </div>

      <Header />
      <main className="flex-1 relative">
        {/* Enhanced Hero Section */}
        <section className="w-full pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-40">
          <div className="container px-4 md:px-6 z-10 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24">
              <div className="flex flex-col justify-center space-y-6">
                <ScrollReveal delay={0.1}>
                  <div className="space-y-6">
                    <div className="relative group cursor-pointer">
                      {/* Enhanced gradient background for both themes */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-cyan-500/15 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-cyan-400/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700 animate-gradient-flow-x"></div>

                      {/* Light mode floating sparkles */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 dark:opacity-0 transition-opacity duration-700 overflow-hidden rounded-2xl">
                        <div className="absolute top-2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-float-1 shadow-sm"></div>
                        <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float-2 shadow-sm"></div>
                        <div className="absolute bottom-3 left-8 w-1 h-1 bg-cyan-400 rounded-full animate-float-3 shadow-sm"></div>
                        <div className="absolute bottom-2 right-4 w-1 h-1 bg-indigo-400 rounded-full animate-float-1 shadow-sm" style={{animationDelay: '1.5s'}}></div>
                      </div>

                      {/* Dark mode floating particles */}
                      <div className="absolute inset-0 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-700 overflow-hidden rounded-2xl">
                        <div className="absolute top-2 left-4 w-1 h-1 bg-cyan-400 rounded-full animate-float-1"></div>
                        <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float-2"></div>
                        <div className="absolute bottom-3 left-8 w-1 h-1 bg-blue-400 rounded-full animate-float-3"></div>
                      </div>

                      <div className="relative inline-block bg-gradient-to-r from-blue-500/8 via-purple-500/6 to-cyan-500/8 dark:bg-gradient-to-r dark:from-blue-500/20 dark:via-purple-500/15 dark:to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 dark:border-blue-400/40 rounded-2xl px-6 py-3 group-hover:from-blue-500/15 group-hover:via-purple-500/12 group-hover:to-cyan-500/15 dark:group-hover:from-blue-500/30 dark:group-hover:via-purple-500/25 dark:group-hover:to-cyan-500/30 group-hover:scale-105 group-hover:border-blue-400/50 dark:group-hover:border-purple-400/60 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-700 overflow-hidden">
                        {/* Animated shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                        <div className="flex items-center space-x-2 relative z-10">
                          <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-cyan-300 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700" />
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-cyan-300 transition-colors duration-700">
                            Community Safety, Amplified
                          </span>
                        </div>
                      </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-slate-900 dark:text-white">
                      Report Hazards, Protect Your Community
                    </h1>
                    <p className="max-w-[600px] text-slate-600 dark:text-slate-300 md:text-xl leading-relaxed">
                      AlertFront empowers you to report local hazards quickly and efficiently, connecting you with response teams to make your area safer.
                    </p>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <div className="flex flex-col gap-4 min-[400px]:flex-row">
                    <Button asChild size="lg" className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:via-purple-600 dark:to-cyan-600 dark:hover:from-cyan-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white font-semibold hover:scale-110 transition-all duration-700 border-0 hover:-translate-y-1">
                      <Link href="/login" className="relative z-10 flex items-center">
                        {/* Enhanced animated background for both themes */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-blue-600/80 to-purple-600/80 dark:from-cyan-400/20 dark:via-purple-400/20 dark:to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-gradient-flow-x"></div>

                        {/* Light mode floating sparkles */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 dark:opacity-0 transition-opacity duration-700">
                          <div className="absolute top-2 left-4 w-1 h-1 bg-yellow-200 rounded-full animate-float-1 shadow-sm"></div>
                          <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-white/80 rounded-full animate-float-2 shadow-sm"></div>
                          <div className="absolute bottom-3 left-8 w-1 h-1 bg-blue-200 rounded-full animate-float-3 shadow-sm"></div>
                          <div className="absolute bottom-2 right-4 w-1 h-1 bg-purple-200 rounded-full animate-float-1 shadow-sm" style={{animationDelay: '1.5s'}}></div>
                        </div>

                        {/* Dark mode floating particles */}
                        <div className="absolute inset-0 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-700">
                          <div className="absolute top-2 left-4 w-1 h-1 bg-cyan-300 rounded-full animate-float-1"></div>
                          <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-pink-300 rounded-full animate-float-2"></div>
                          <div className="absolute bottom-3 left-8 w-1 h-1 bg-purple-300 rounded-full animate-float-3"></div>
                          <div className="absolute bottom-2 right-4 w-1 h-1 bg-blue-300 rounded-full animate-float-1" style={{animationDelay: '1.5s'}}></div>
                        </div>

                        {/* Enhanced shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-cyan-300/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse group-hover:text-yellow-200 dark:group-hover:text-cyan-200 transition-colors duration-300 relative z-10" />
                        <span className="relative z-10">Get Started</span>
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="group relative overflow-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border-2 border-blue-500/30 dark:border-blue-400/30 hover:bg-blue-50 dark:hover:bg-gradient-to-r dark:hover:from-blue-900/30 dark:hover:via-purple-900/20 dark:hover:to-green-900/30 hover:border-blue-500 dark:hover:border-purple-400 hover:scale-110 transition-all duration-700 hover:-translate-y-1">
                      <Link href="/community" className="relative z-10 flex items-center">
                        {/* Enhanced gradient background for both themes */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        {/* Light mode floating sparkles */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 dark:opacity-0 transition-opacity duration-700">
                          <div className="absolute top-2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-float-1 shadow-sm"></div>
                          <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float-2 shadow-sm"></div>
                          <div className="absolute bottom-3 left-8 w-1 h-1 bg-indigo-400 rounded-full animate-float-3 shadow-sm"></div>
                        </div>

                        {/* Moving gradient border effect for dark theme */}
                        <div className="absolute inset-0 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-700 rounded-lg">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-green-400/20 animate-gradient-flow-x rounded-lg"></div>
                        </div>

                        {/* Enhanced shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 dark:via-purple-300/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        <Globe className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:animate-pulse group-hover:text-cyan-500 dark:group-hover:text-purple-300 transition-all duration-300 relative z-10" />
                        <span className="relative z-10">View Community</span>
                      </Link>
                    </Button>
                  </div>
                </ScrollReveal>
              </div>

              {/* Enhanced Interactive Hero Visual - Increased container size to prevent clipping */}
              <div className="relative flex items-center justify-center min-h-[600px] lg:min-h-[700px]">
                <ScrollReveal delay={0.3} className="w-full h-full">
                  <div className="relative w-full aspect-square max-w-xl mx-auto">
                    {/* Enhanced Orbital Background Rings with dark theme colors */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute w-96 h-96 rounded-full border border-blue-500/10 dark:border-cyan-400/20 animate-spin hover:border-blue-500/20 dark:hover:border-cyan-400/40 transition-colors duration-700" style={{ animationDuration: '60s' }}></div>
                      <div className="absolute w-80 h-80 rounded-full border border-purple-500/10 dark:border-purple-400/20 animate-spin hover:border-purple-500/20 dark:hover:border-purple-400/40 transition-colors duration-700" style={{ animationDirection: 'reverse', animationDuration: '80s' }}></div>
                      <div className="absolute w-64 h-64 rounded-full border border-green-500/10 dark:border-green-400/20 animate-spin hover:border-green-500/20 dark:hover:border-green-400/40 transition-colors duration-700" style={{ animationDuration: '100s' }}></div>

                      {/* Enhanced floating particles with dark theme colors */}
                      <div className="absolute w-2 h-2 bg-blue-400/30 dark:bg-cyan-400/50 rounded-full animate-float-gentle-1 hover:bg-blue-400/50 dark:hover:bg-cyan-400/70 transition-colors duration-500" style={{ top: '20%', left: '30%' }}></div>
                      <div className="absolute w-1 h-1 bg-purple-400/40 dark:bg-purple-400/60 rounded-full animate-float-gentle-2 hover:bg-purple-400/60 dark:hover:bg-purple-400/80 transition-colors duration-500" style={{ top: '70%', right: '25%' }}></div>
                      <div className="absolute w-1.5 h-1.5 bg-green-400/35 dark:bg-green-400/55 rounded-full animate-float-gentle-3 hover:bg-green-400/55 dark:hover:bg-green-400/75 transition-colors duration-500" style={{ bottom: '30%', left: '20%' }}></div>

                      {/* Additional colorful particles for dark theme */}
                      <div className="absolute w-1 h-1 bg-pink-400/40 dark:bg-pink-400/60 rounded-full animate-float-gentle-1 opacity-0 dark:opacity-100 transition-opacity duration-700" style={{ top: '40%', right: '35%', animationDelay: '2s' }}></div>
                      <div className="absolute w-1.5 h-1.5 bg-yellow-400/35 dark:bg-yellow-400/55 rounded-full animate-float-gentle-2 opacity-0 dark:opacity-100 transition-opacity duration-700" style={{ bottom: '50%', left: '40%', animationDelay: '3s' }}></div>
                    </div>

                    {/* Central Hub Container */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative z-30 group cursor-pointer">
                        <div className="w-40 h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-2xl rounded-full border-2 border-blue-400/40 dark:border-blue-400/40 group-hover:border-blue-500/60 dark:group-hover:border-purple-400/60 group-hover:shadow-xl group-hover:shadow-blue-500/20 flex items-center justify-center transition-all duration-700 hover:scale-110">
                          {/* Enhanced animated gradient layers for both themes */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 to-purple-400/15 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full animate-pulse group-hover:from-blue-400/25 group-hover:to-purple-400/25 dark:group-hover:from-cyan-400/40 dark:group-hover:to-pink-400/40 transition-all duration-700" style={{animationDuration: '4s'}}></div>
                          <div className="absolute inset-0 bg-gradient-to-tl from-green-400/8 to-blue-400/8 dark:from-green-400/15 dark:to-cyan-400/15 rounded-full opacity-0 group-hover:opacity-100 animate-gradient-rotate transition-opacity duration-700"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/8 to-pink-400/8 dark:from-purple-400/15 dark:to-pink-400/20 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700" style={{animationDuration: '3s'}}></div>

                          {/* Light mode floating sparkles */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 dark:opacity-0 transition-opacity duration-700 rounded-full overflow-hidden">
                            <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-blue-400 rounded-full animate-float-1 shadow-sm"></div>
                            <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-float-2 shadow-sm"></div>
                            <div className="absolute bottom-6 left-8 w-1 h-1 bg-cyan-400 rounded-full animate-float-3 shadow-sm"></div>
                            <div className="absolute bottom-8 right-6 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-float-1 shadow-sm" style={{animationDelay: '1s'}}></div>
                            <div className="absolute top-12 left-12 w-1 h-1 bg-green-400 rounded-full animate-float-2 shadow-sm" style={{animationDelay: '2s'}}></div>
                          </div>

                          {/* Dark mode floating particles */}
                          <div className="absolute inset-0 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-700 rounded-full overflow-hidden">
                            <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-float-1"></div>
                            <div className="absolute top-8 right-8 w-1 h-1 bg-pink-300 rounded-full animate-float-2"></div>
                            <div className="absolute bottom-6 left-8 w-1 h-1 bg-purple-300 rounded-full animate-float-3"></div>
                            <div className="absolute bottom-8 right-6 w-1.5 h-1.5 bg-green-300 rounded-full animate-float-1" style={{animationDelay: '1s'}}></div>
                            <div className="absolute top-12 left-12 w-1 h-1 bg-blue-300 rounded-full animate-float-2" style={{animationDelay: '2s'}}></div>
                          </div>



                          <div className="relative z-10 text-center transition-all duration-700 group-hover:scale-105">
                            <Map className="h-12 w-12 lg:h-16 lg:w-16 text-blue-500/50 dark:text-blue-400/50 mx-auto mb-2 animate-pulse group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-all duration-700" style={{animationDuration: '6s'}} />
                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-colors duration-700">AlertFront</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-700">Command Center</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Solar System Orbit */}
                    <div className="absolute inset-0">
                      <SolarSystem />
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
            <div className="mx-auto grid max-w-5xl items-start gap-16 py-12 lg:grid-cols-3 lg:gap-12 xl:gap-16 hover-container">
              <FeatureCard
                title="1. Report an Issue"
                icon={<AlertTriangle className="h-8 w-8" />}
                delay={0.1}
                gradientFrom="from-red-500/20"
                gradientTo="to-orange-500/20"
                titleColor="!text-red-600 dark:!text-red-400"
              >
                See a hazard? Open the app, fill out a quick form with details, photo, and location. Your report is instantly logged.
              </FeatureCard>
              <FeatureCard
                title="2. Team Dispatch"
                icon={<ShieldCheck className="h-8 w-8" />}
                delay={0.2}
                gradientFrom="from-green-500/20"
                gradientTo="to-emerald-500/20"
                titleColor="!text-green-600 dark:!text-green-400"
              >
                The nearest NDRF team is immediately notified with all the details, ensuring a rapid and informed response.
              </FeatureCard>
              <FeatureCard
                title="3. Resolution & Update"
                icon={<UserCheck className="h-8 w-8" />}
                delay={0.3}
                gradientFrom="from-blue-500/20"
                gradientTo="to-purple-500/20"
                titleColor="!text-blue-600 dark:!text-blue-400"
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
            <div className="mx-auto grid max-w-6xl items-center gap-12 py-12 lg:grid-cols-3 lg:gap-12 xl:gap-16 hover-container">
              <FeatureCard
                title="Quick Reporting"
                icon={<AlertTriangle className="h-8 w-8" />}
                delay={0.3}
                gradientFrom="from-red-500/20"
                gradientTo="to-orange-500/20"
                titleColor="!text-red-600 dark:!text-red-400"
              >
                Report hazards instantly with our streamlined interface. Upload photos, add descriptions, and pinpoint exact locations.
              </FeatureCard>
              <FeatureCard
                title="Real-time Mapping"
                icon={<Map className="h-8 w-8" />}
                delay={0.4}
                gradientFrom="from-blue-500/20"
                gradientTo="to-cyan-500/20"
                titleColor="!text-blue-600 dark:!text-blue-400"
              >
                View all reported incidents on an interactive map. Track patterns and stay informed about your area's safety status.
              </FeatureCard>
              <FeatureCard
                title="Direct Response"
                icon={<IconDirectLine />}
                delay={0.5}
                gradientFrom="from-green-500/20"
                gradientTo="to-emerald-500/20"
                titleColor="!text-green-600 dark:!text-green-400"
              >
                Your reports go directly to NDRF teams and local authorities for immediate action and coordinated response.
              </FeatureCard>
              <FeatureCard
                title="Community Insights"
                icon={<Users className="h-8 w-8" />}
                delay={0.4}
                gradientFrom="from-purple-500/20"
                gradientTo="to-pink-500/20"
                titleColor="!text-purple-600 dark:!text-purple-400"
              >
                Access AI-powered community safety insights, trends, and actionable recommendations based on collective data.
              </FeatureCard>
              <FeatureCard
                title="Smart Alerts"
                icon={<Target className="h-8 w-8" />}
                delay={0.5}
                gradientFrom="from-yellow-500/20"
                gradientTo="to-orange-500/20"
                titleColor="!text-orange-600 dark:!text-orange-400"
              >
                Receive intelligent notifications about hazards in your area and safety tips tailored to your location.
              </FeatureCard>
              <FeatureCard
                title="Status Tracking"
                icon={<Siren className="h-8 w-8" />}
                delay={0.6}
                gradientFrom="from-indigo-500/20"
                gradientTo="to-purple-500/20"
                titleColor="!text-indigo-600 dark:!text-indigo-400"
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
            <div className="mx-auto grid items-stretch gap-12 py-12 md:grid-cols-2 lg:gap-16 hover-container max-w-6xl">
              <ScrollReveal delay={0.2}>
                <div className="group relative opacity-100 cursor-pointer card-spacing">
                  {/* Enhanced gradient background for both themes */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 dark:from-blue-400/30 dark:via-cyan-400/20 dark:to-purple-400/25 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 dark:group-hover:opacity-40 transition-all duration-500"></div>

                  {/* Light mode floating sparkles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 dark:opacity-0 transition-opacity duration-700 rounded-3xl overflow-hidden">
                    <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-blue-400 rounded-full animate-float-1 shadow-sm"></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-cyan-400 rounded-full animate-float-2 shadow-sm"></div>
                    <div className="absolute bottom-6 left-8 w-1 h-1 bg-indigo-400 rounded-full animate-float-3 shadow-sm"></div>
                    <div className="absolute bottom-8 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float-1 shadow-sm" style={{animationDelay: '1s'}}></div>
                  </div>

                  {/* Dark mode floating particles */}
                  <div className="absolute inset-0 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-700 rounded-3xl overflow-hidden">
                    <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-float-1"></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-blue-300 rounded-full animate-float-2"></div>
                    <div className="absolute bottom-6 left-8 w-1 h-1 bg-purple-300 rounded-full animate-float-3"></div>
                    <div className="absolute bottom-8 right-6 w-1.5 h-1.5 bg-teal-300 rounded-full animate-float-1" style={{animationDelay: '1s'}}></div>
                  </div>

                  <div className="relative bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 group-hover:border-blue-400/50 dark:group-hover:border-cyan-400/40 group-hover:shadow-xl group-hover:shadow-blue-500/10 rounded-3xl p-8 transition-all duration-500 group-hover:bg-white/98 dark:group-hover:bg-slate-900/95 h-full flex flex-col min-h-[320px] overflow-hidden">
                    <div className="flex flex-col items-center text-center space-y-6 h-full">
                      <div className="relative p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-400/30 dark:to-cyan-400/30 rounded-2xl group-hover:scale-105 group-hover:from-cyan-400/40 dark:group-hover:from-cyan-300/40 group-hover:to-blue-400/40 dark:group-hover:to-purple-400/40 transition-all duration-500 overflow-hidden flex-shrink-0">
                        {/* Enhanced shine effect for dark theme */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-cyan-300/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        <UserCheck className="h-10 w-10 text-white relative z-10 group-hover:text-cyan-100 dark:group-hover:text-cyan-200 transition-all duration-500" />
                      </div>
                      <div className="flex-grow flex flex-col justify-center space-y-6">
                        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 dark:group-hover:text-cyan-300 group-hover:scale-105 transition-all duration-500">
                          Community Reporters
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-500 flex-grow flex items-center">
                          As a community member, you are the first line of defense. Report hazards like fallen trees, flooding, or power outages to alert response teams and protect your neighbors.
                        </p>
                        <div className="pt-4">
                          <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-105">
                            <Link href="/report/new">Report an Issue</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <div className="group relative opacity-100 cursor-pointer card-spacing">
                  {/* Enhanced gradient background for both themes */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 to-red-500/15 dark:from-orange-400/30 dark:via-red-400/20 dark:to-pink-400/25 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 dark:group-hover:opacity-40 transition-all duration-500"></div>

                  {/* Light mode floating sparkles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 dark:opacity-0 transition-opacity duration-700 rounded-3xl overflow-hidden">
                    <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-orange-400 rounded-full animate-float-1 shadow-sm"></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-red-400 rounded-full animate-float-2 shadow-sm"></div>
                    <div className="absolute bottom-6 left-8 w-1 h-1 bg-pink-400 rounded-full animate-float-3 shadow-sm"></div>
                    <div className="absolute bottom-8 right-6 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-float-1 shadow-sm" style={{animationDelay: '1s'}}></div>
                  </div>

                  {/* Dark mode floating particles */}
                  <div className="absolute inset-0 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-700 rounded-3xl overflow-hidden">
                    <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-orange-300 rounded-full animate-float-1"></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-red-300 rounded-full animate-float-2"></div>
                    <div className="absolute bottom-6 left-8 w-1 h-1 bg-pink-300 rounded-full animate-float-3"></div>
                    <div className="absolute bottom-8 right-6 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-float-1" style={{animationDelay: '1s'}}></div>
                  </div>

                  <div className="relative bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 group-hover:border-orange-400/50 dark:group-hover:border-orange-400/40 group-hover:shadow-xl group-hover:shadow-orange-500/10 rounded-3xl p-8 transition-all duration-500 group-hover:bg-white/98 dark:group-hover:bg-slate-900/95 h-full flex flex-col min-h-[320px] overflow-hidden">
                    <div className="flex flex-col items-center text-center space-y-6 h-full">
                      <div className="relative p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 dark:from-orange-400/30 dark:to-red-400/30 rounded-2xl group-hover:scale-105 group-hover:from-red-400/40 dark:group-hover:from-orange-300/40 group-hover:to-orange-400/40 dark:group-hover:to-pink-400/40 transition-all duration-500 overflow-hidden flex-shrink-0">
                        {/* Enhanced shine effect for dark theme */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-orange-300/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        <ShieldCheck className="h-10 w-10 text-white relative z-10 group-hover:text-orange-100 dark:group-hover:text-orange-200 transition-all duration-500" />
                      </div>
                      <div className="flex-grow flex flex-col justify-center space-y-6">
                        <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 dark:group-hover:text-orange-300 group-hover:scale-105 transition-all duration-500">
                          NDRF Responders
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-500 flex-grow flex items-center">
                          As an NDRF team member, you get a dedicated dashboard to view, manage, and track all reported incidents, enabling you to coordinate and dispatch resources effectively.
                        </p>
                        <div className="pt-4">
                          <Button asChild className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-105">
                            <Link href="/admin">Go to Dashboard</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Enhanced Final CTA */}
        <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/60 to-purple-50/40 dark:from-slate-950 dark:via-blue-950/40 dark:to-purple-950/30"></div>

          {/* Floating gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center">
                {/* Enhanced CTA Card */}
                <div className="group relative">
                  {/* Subtle background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                  <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 rounded-3xl p-12 md:p-16 shadow-2xl group-hover:shadow-3xl transition-all duration-700 group-hover:bg-white/95 dark:group-hover:bg-slate-900/95">
                    <div className="space-y-8">
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl font-headline bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-500">
                          Ready to Make Your Community Safer?
                        </h2>
                        <p className="mx-auto max-w-[700px] text-slate-600 dark:text-slate-300 md:text-xl lg:text-2xl leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-500">
                          Join AlertFront today. Your involvement is crucial for building a more resilient and secure environment for everyone.
                        </p>
                      </div>

                      <div className="flex justify-center items-center pt-6">
                        <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 text-lg px-12 py-6 rounded-2xl group-hover:animate-pulse relative overflow-hidden">
                          <Link href="/login" className="flex items-center gap-3 relative z-10">
                            <span className="font-semibold">Sign Up & Get Started</span>
                            <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                            {/* Enhanced shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                          </Link>
                        </Button>
                      </div>

                      {/* Trust indicators */}
                      <div className="pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Trusted by communities nationwide</p>
                        <div className="flex justify-center items-center gap-8 opacity-60 group-hover:opacity-80 transition-opacity duration-500">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-medium">Secure</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm font-medium">Fast Response</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-medium">Community Driven</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </main>
      <AppFooter />
    </div>
  );
}
