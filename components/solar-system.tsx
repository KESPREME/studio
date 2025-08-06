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
      hoverShadow: 'hover:shadow-red-200/30 dark:hover:shadow-red-900/20',
    },
    {
      id: 'verified',
      title: 'Report Verified',
      description: 'Priority: High',
      icon: <UserCheck className="h-5 w-5 text-white" />,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-cyan-500',
      borderColor: 'border-blue-200/50 dark:border-blue-700/50',
      hoverShadow: 'hover:shadow-blue-200/30 dark:hover:shadow-blue-900/20',
    },
    {
      id: 'team',
      title: 'Team Dispatched',
      description: 'Response Unit #42',
      icon: <ShieldCheck className="h-5 w-5 text-white" />,
      gradientFrom: 'from-green-500',
      gradientTo: 'to-emerald-500',
      borderColor: 'border-green-200/50 dark:border-green-700/50',
      hoverShadow: 'hover:shadow-green-200/30 dark:hover:shadow-green-900/20',
    },
    {
      id: 'media',
      title: 'Media Captured',
      description: '3 photos, 1 video',
      icon: <Camera className="h-5 w-5 text-white" />,
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-pink-500',
      borderColor: 'border-purple-200/50 dark:border-purple-700/50',
      hoverShadow: 'hover:shadow-purple-200/30 dark:hover:shadow-purple-900/20',
    },
    {
      id: 'secured',
      title: 'Area Secured',
      description: 'Safety zone established',
      icon: <Lock className="h-5 w-5 text-white" />,
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-yellow-500',
      borderColor: 'border-amber-200/50 dark:border-amber-700/50',
      hoverShadow: 'hover:shadow-amber-200/30 dark:hover:shadow-amber-900/20',
    },
  ];

  // Orbit radii for each card
  const orbitRadii = [120, 180, 240, 300, 360];
  // Animation durations for each orbit (in seconds)
  const orbitDurations = [360, 300, 240, 180, 120];
  // Starting angles for each card (in degrees)
  const startAngles = [0, 300, 300, 360, 420];

  return (
    <div className="relative w-full h-full">
      {/* Orbit Paths (visual guides) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {orbitRadii.map((radius, i) => (
          <div 
            key={`orbit-${i}`}
            className="absolute rounded-full border border-dashed border-gray-200/30 dark:border-gray-700/30"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
            }}
          />
        ))}
      </div>

      {/* Cards */}
      {cards.map((card, index) => {
        const radius = orbitRadii[index];
        const duration = orbitDurations[index];
        const startAngle = startAngles[index];
        
        return (
          <div
            key={card.id}
            className={`absolute top-1/2 left-1/2 animate-orbit-${index + 1}`}
            style={{
              '--orbit-radius': `${radius}px`,
              '--orbit-duration': `${duration}s`,
              '--start-angle': `${startAngle}deg`,
            } as React.CSSProperties}
          >
            <div className="group relative -translate-x-1/2 -translate-y-1/2">
              <div
                className={`absolute -inset-2 rounded-2xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-700 bg-gradient-to-r ${card.gradientFrom}/10 ${card.gradientTo}/10`}
              />
              <div
                className={`card-3d relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 sm:p-4 rounded-xl shadow-lg border ${card.borderColor} hover:scale-110 transition-all duration-500 w-56 sm:w-64 ${card.hoverShadow}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg shadow-md bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo}`}>
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
