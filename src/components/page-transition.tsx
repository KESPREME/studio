"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useOptimizedVariants, useAnimationSettings } from '@/hooks/use-performance';

interface PageTransitionProps {
  children: React.ReactNode;
}

// Optimized transition variants - reduced complexity and duration for better performance
const pageVariants = {
  // Landing page - simple fade with minimal scale
  landing: {
    initial: { opacity: 0, scale: 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1], // Optimized easing curve
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Auth pages - simple slide
  auth: {
    initial: { opacity: 0, x: 30 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      x: -30,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Dashboard pages - minimal fade
  dashboard: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Admin pages - simple slide up
  admin: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Report pages - simple slide
  report: {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Community pages - simple fade with minimal scale
  community: {
    initial: { opacity: 0, scale: 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Settings pages - simple slide
  settings: {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Default transition - minimal
  default: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: "easeOut" }
    }
  }
};

// Function to determine page type based on pathname
const getPageType = (pathname: string): keyof typeof pageVariants => {
  if (pathname === '/') return 'landing';
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) return 'auth';
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/report')) return 'report';
  if (pathname.startsWith('/community')) return 'community';
  if (pathname.startsWith('/settings')) return 'settings';
  return 'default';
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const pageType = getPageType(pathname);
  const { enableAnimations, shouldUseGPUAcceleration } = useAnimationSettings();
  const optimizedVariants = useOptimizedVariants();

  // Use optimized variants based on page type and performance
  const getOptimizedVariant = () => {
    if (!enableAnimations) return optimizedVariants.fadeIn;

    switch (pageType) {
      case 'landing':
      case 'community':
        return optimizedVariants.scale;
      case 'auth':
      case 'report':
        return optimizedVariants.slideRight;
      case 'admin':
      case 'settings':
        return optimizedVariants.slideUp;
      default:
        return optimizedVariants.fadeIn;
    }
  };

  const variants = getOptimizedVariant();

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className="min-h-screen"
        style={{
          ...(shouldUseGPUAcceleration() && {
            willChange: 'opacity, transform',
            backfaceVisibility: 'hidden',
            perspective: 1000,
            transform: 'translate3d(0, 0, 0)'
          })
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Optimized component for individual page sections
export function SectionTransition({
  children,
  delay = 0,
  className = ""
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}
