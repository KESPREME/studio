'use client';

import React from 'react';
import { AlertTriangle, UserCheck, ShieldCheck, Camera, Lock } from 'lucide-react';

type CardData = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  hoverShadow: string;
};

export function SolarSystem() {
  const cards: CardData[] = [
    {
      id: 'pothole',
      title: 'Pothole Reported',
      description: 'Main St & 2nd Ave',
      icon: <AlertTriangle className="h-5 w-5 text-white" />,
      gradientFrom: 'from-red-500',
      gradientTo: 'to-orange-500',
      borderColor: 'border-red-200/50 dark:border-red-700/30',
      hoverShadow: 'hover:shadow-red-200/50 dark:hover:shadow-red-900/30',
    },
    {
      id: 'verified',
      title: 'Report Verified',
      description: 'Priority: High',
      icon: <UserCheck className="h-5 w-5 text-white" />,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-cyan-500',
      borderColor: 'border-blue-200/50 dark:border-blue-700/50',
      hoverShadow: 'hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30',
    },
    {
      id: 'team',
      title: 'Team Dispatched',
      description: 'Response Unit #42',
      icon: <ShieldCheck className="h-5 w-5 text-white" />,
      gradientFrom: 'from-green-500',
      gradientTo: 'to-emerald-500',
      borderColor: 'border-green-200/50 dark:border-green-700/50',
      hoverShadow: 'hover:shadow-green-200/50 dark:hover:shadow-green-900/30',
    },
    {
      id: 'media',
      title: 'Media Captured',
      description: '3 photos, 1 video',
      icon: <Camera className="h-5 w-5 text-white" />,
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-pink-500',
      borderColor: 'border-purple-200/50 dark:border-purple-700/50',
      hoverShadow: 'hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30',
    },
    {
      id: 'secured',
      title: 'Area Secured',
      description: 'Safety zone established',
      icon: <Lock className="h-5 w-5 text-white" />,
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-yellow-500',
      borderColor: 'border-amber-200/50 dark:border-amber-700/50',
      hoverShadow: 'hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30',
    },
  ];

  // Orbit radii for each card - increased spacing to prevent overlap
  const orbitRadii = [140, 200, 260, 320, 380];
  // Animation durations for each orbit (in seconds) - more varied speeds to prevent clustering
  const orbitDurations = [30, 45, 70, 95, 130];
  // Starting angles for each card (in degrees) - evenly distributed
  const startAngles = [0, 72, 144, 216, 288];
  // Animation delays to stagger start times (in seconds)
  const animationDelays = [0, 6, 12, 18, 24];

  return (
    <div className="relative w-full h-full">
      {/* Central Hub */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 w-24 h-24 rounded-full shadow-2xl flex items-center justify-center">
            <div className="text-white font-bold text-sm text-center">
              <div>AlertFront</div>
              <div className="text-xs opacity-80">Command Center</div>
            </div>
          </div>
        </div>
      </div>

      {/* Orbit Paths (visual guides) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {orbitRadii.map((radius, i) => (
          <div
            key={`orbit-${i}`}
            className="absolute rounded-full border border-dashed border-gray-200/20 dark:border-gray-700/20"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              opacity: 0.3 + (i * 0.1), // Gradually increase opacity for outer orbits
            }}
          />
        ))}
      </div>

      {/* Cards */}
      {cards.map((card, index) => {
        const radius = orbitRadii[index];
        const duration = orbitDurations[index];
        const startAngle = startAngles[index];
        const delay = animationDelays[index];

        return (
          <div
            key={card.id}
            className="absolute top-1/2 left-1/2"
            style={{
              animation: `orbit-${index + 1} ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              transformOrigin: 'center center',
              willChange: 'transform',
              zIndex: 10 + index, // Proper z-index layering
            } as React.CSSProperties}
          >
            <div className="group relative -translate-x-1/2 -translate-y-1/2">
              <div
                className={`absolute -inset-3 rounded-2xl blur-lg opacity-60 group-hover:opacity-90 transition-all duration-700 bg-gradient-to-r ${card.gradientFrom}/30 ${card.gradientTo.replace('to-', 'to-').replace('/30', '')}/30`}
                style={{
                  filter: `blur(${8 + index * 2}px)`, // Varying blur for depth
                }}
              />
              <div
                className={`card-3d relative bg-white/98 dark:bg-slate-800/98 backdrop-blur-xl p-4 sm:p-5 rounded-xl shadow-2xl border-2 ${card.borderColor} hover:scale-105 transition-all duration-500 w-60 sm:w-72 ${card.hoverShadow}`}
                style={{
                  boxShadow: `0 ${10 + index * 5}px ${20 + index * 10}px rgba(0,0,0,0.1), 0 ${5 + index * 2}px ${10 + index * 5}px rgba(0,0,0,0.05)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg shadow-lg bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo}`}>
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{card.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{card.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
