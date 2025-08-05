"use client";

import React from 'react';
import { ShieldCheck, Map, AlertTriangle, UserCheck, Users, Target, Siren, Zap, Globe, Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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

const RotatingFeatureCard = ({
  icon,
  title,
  children,
  delay = 0.1,
  gradientFrom,
  gradientTo,
  position,
  index = 0
}: {
  icon: React.ReactNode,
  title: string,
  children: React.ReactNode,
  delay?: number,
  gradientFrom: string,
  gradientTo: string,
  position: {
    x: number;
    y: number;
    rotation: number;
  },
  index?: number
}) => (
  <div
    className="absolute transition-all duration-1000 hover:scale-110"
    style={{
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: `translate(-50%, -50%)`,
      zIndex: 20 + index, // Higher z-index to ensure visibility
      opacity: 1, // Force full opacity
      visibility: 'visible', // Force visibility
    }}
  >
    <div className="group relative transition-all duration-500 hover:-translate-y-2" style={{ opacity: 1 }}>
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
      <div className="relative bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-3xl p-4 shadow-2xl hover:shadow-3xl transition-all duration-500 w-56">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-3 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 text-white" })}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">{children}</p>
        </div>
        <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

export function RotatingFeatureCards() {
  // Define positions for the rotating cards - adjusted for better visibility and container constraints
  const cardPositions = [
    { x: 50, y: 20, rotation: 0 },    // Top center
    { x: 75, y: 35, rotation: 0 },    // Top right
    { x: 75, y: 65, rotation: 0 },    // Bottom right
    { x: 50, y: 80, rotation: 0 },    // Bottom center
    { x: 25, y: 65, rotation: 0 },    // Bottom left
    { x: 25, y: 35, rotation: 0 },    // Top left
  ];

  return (
    <div className="relative w-full min-h-[700px] flex items-center justify-center my-16 overflow-visible">
      {/* Animated background circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-96 h-96 rounded-full border-2 border-blue-500/20 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute w-80 h-80 rounded-full border-2 border-purple-500/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>
        <div className="absolute w-64 h-64 rounded-full border-2 border-green-500/20 animate-spin" style={{ animationDuration: '30s' }}></div>
      </div>
      
      {/* Animated connecting lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        {/* Center to all cards */}
        {cardPositions.map((pos, index) => (
          <line
            key={index}
            x1="50%"
            y1="50%"
            x2={`${pos.x}%`}
            y2={`${pos.y}%`}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            className="animate-pulse"
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        ))}
        
        {/* Between adjacent cards */}
        {cardPositions.map((pos, index) => {
          const nextIndex = (index + 1) % cardPositions.length;
          return (
            <line
              key={`adj-${index}`}
              x1={`${pos.x}%`}
              y1={`${pos.y}%`}
              x2={`${cardPositions[nextIndex].x}%`}
              y2={`${cardPositions[nextIndex].y}%`}
              stroke="url(#lineGradient2)"
              strokeWidth="1"
              className="animate-pulse"
              style={{ animationDelay: `${index * 0.3}s` }}
            />
          );
        })}
        
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center point */}
      <div className="absolute w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg z-10 animate-pulse"></div>
      
      {/* Rotating feature cards */}
      <RotatingFeatureCard
        title="Instant Reporting"
        icon={<AlertTriangle className="h-8 w-8" />}
        delay={0.1}
        gradientFrom="from-red-500/20"
        gradientTo="to-orange-500/20"
        position={cardPositions[0]}
        index={0}
      >
        Report hazards instantly with photos, location, and details. Your report goes directly to emergency responders.
      </RotatingFeatureCard>

      <RotatingFeatureCard
        title="Real-Time Updates"
        icon={<IconRealTime />}
        delay={0.3}
        gradientFrom="from-blue-500/20"
        gradientTo="to-cyan-500/20"
        position={cardPositions[1]}
        index={1}
      >
        Track the status of your report in real-time as response teams are dispatched and work to resolve the issue.
      </RotatingFeatureCard>

      <RotatingFeatureCard
        title="Direct Communication"
        icon={<IconDirectLine />}
        delay={0.5}
        gradientFrom="from-green-500/20"
        gradientTo="to-emerald-500/20"
        position={cardPositions[2]}
        index={2}
      >
        Communicate directly with response teams through our secure messaging system for critical updates.
      </RotatingFeatureCard>

      <RotatingFeatureCard
        title="Photo Documentation"
        icon={<Globe className="h-8 w-8" />}
        delay={0.7}
        gradientFrom="from-blue-500/20"
        gradientTo="to-cyan-500/20"
        position={cardPositions[3]}
        index={3}
      >
        Capture and upload photos of hazards directly from your mobile device for accurate reporting.
      </RotatingFeatureCard>

      <RotatingFeatureCard
        title="GPS Location"
        icon={<Map className="h-8 w-8" />}
        delay={0.9}
        gradientFrom="from-emerald-500/20"
        gradientTo="to-green-500/20"
        position={cardPositions[4]}
        index={4}
      >
        Automatic location detection for precise hazard reporting and response team dispatch.
      </RotatingFeatureCard>

      <RotatingFeatureCard
        title="Team Coordination"
        icon={<Users className="h-8 w-8" />}
        delay={1.1}
        gradientFrom="from-purple-500/20"
        gradientTo="to-pink-500/20"
        position={cardPositions[5]}
        index={5}
      >
        Dedicated dashboards for response teams to manage and coordinate multiple incidents simultaneously.
      </RotatingFeatureCard>
    </div>
  );
}
