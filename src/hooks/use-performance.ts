"use client";

import { useEffect, useState } from 'react';

interface PerformanceConfig {
  enableAnimations: boolean;
  reducedMotion: boolean;
  deviceTier: 'low' | 'medium' | 'high';
  connectionSpeed: 'slow' | 'fast';
}

export function usePerformance(): PerformanceConfig {
  const [config, setConfig] = useState<PerformanceConfig>({
    enableAnimations: true,
    reducedMotion: false,
    deviceTier: 'high',
    connectionSpeed: 'fast'
  });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detect device capabilities
    const detectDeviceTier = (): 'low' | 'medium' | 'high' => {
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 2;
      
      // Check memory (if available)
      const memory = (navigator as any).deviceMemory || 4;
      
      // Check if device supports hardware acceleration
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const hasWebGL = !!gl;
      
      // Determine tier based on capabilities
      if (cores >= 8 && memory >= 8 && hasWebGL) {
        return 'high';
      } else if (cores >= 4 && memory >= 4 && hasWebGL) {
        return 'medium';
      } else {
        return 'low';
      }
    };

    // Detect connection speed
    const detectConnectionSpeed = (): 'slow' | 'fast' => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      if (connection) {
        const effectiveType = connection.effectiveType;
        return effectiveType === '4g' || effectiveType === '3g' ? 'fast' : 'slow';
      }
      
      // Fallback: assume fast connection
      return 'fast';
    };

    const deviceTier = detectDeviceTier();
    const connectionSpeed = detectConnectionSpeed();
    
    // Determine if animations should be enabled
    const enableAnimations = !prefersReducedMotion && deviceTier !== 'low';

    setConfig({
      enableAnimations,
      reducedMotion: prefersReducedMotion,
      deviceTier,
      connectionSpeed
    });

    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({
        ...prev,
        reducedMotion: e.matches,
        enableAnimations: !e.matches && prev.deviceTier !== 'low'
      }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return config;
}

// Hook for getting optimized animation settings
export function useAnimationSettings() {
  const { enableAnimations, deviceTier, reducedMotion } = usePerformance();

  const getAnimationDuration = (baseMs: number): number => {
    if (reducedMotion) return 0;
    if (!enableAnimations) return 0;
    
    switch (deviceTier) {
      case 'low':
        return Math.max(baseMs * 0.5, 100); // Faster animations for low-end devices
      case 'medium':
        return baseMs * 0.75;
      case 'high':
      default:
        return baseMs;
    }
  };

  const getStaggerDelay = (baseMs: number): number => {
    if (reducedMotion || !enableAnimations) return 0;
    
    switch (deviceTier) {
      case 'low':
        return Math.max(baseMs * 0.3, 20);
      case 'medium':
        return baseMs * 0.6;
      case 'high':
      default:
        return baseMs;
    }
  };

  const shouldUseGPUAcceleration = (): boolean => {
    return enableAnimations && deviceTier !== 'low';
  };

  const getEasing = (): string => {
    if (reducedMotion || !enableAnimations) return 'linear';
    return 'cubic-bezier(0.4, 0, 0.2, 1)'; // Material Design easing
  };

  return {
    enableAnimations,
    getAnimationDuration,
    getStaggerDelay,
    shouldUseGPUAcceleration,
    getEasing,
    deviceTier,
    reducedMotion
  };
}

// Hook for performance-aware Framer Motion variants
export function useOptimizedVariants() {
  const { getAnimationDuration, getEasing, enableAnimations, shouldUseGPUAcceleration } = useAnimationSettings();

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: getAnimationDuration(250) / 1000,
        ease: getEasing()
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: getAnimationDuration(150) / 1000,
        ease: 'easeOut'
      }
    }
  };

  const slideUp = enableAnimations ? {
    initial: { 
      opacity: 0, 
      y: shouldUseGPUAcceleration() ? 20 : 0,
      ...(shouldUseGPUAcceleration() && { transform: 'translate3d(0, 20px, 0)' })
    },
    animate: { 
      opacity: 1, 
      y: 0,
      ...(shouldUseGPUAcceleration() && { transform: 'translate3d(0, 0, 0)' }),
      transition: {
        duration: getAnimationDuration(300) / 1000,
        ease: getEasing()
      }
    },
    exit: { 
      opacity: 0, 
      y: shouldUseGPUAcceleration() ? -10 : 0,
      transition: {
        duration: getAnimationDuration(200) / 1000,
        ease: 'easeOut'
      }
    }
  } : fadeIn;

  const slideRight = enableAnimations ? {
    initial: { 
      opacity: 0, 
      x: shouldUseGPUAcceleration() ? 30 : 0,
      ...(shouldUseGPUAcceleration() && { transform: 'translate3d(30px, 0, 0)' })
    },
    animate: { 
      opacity: 1, 
      x: 0,
      ...(shouldUseGPUAcceleration() && { transform: 'translate3d(0, 0, 0)' }),
      transition: {
        duration: getAnimationDuration(300) / 1000,
        ease: getEasing()
      }
    },
    exit: { 
      opacity: 0, 
      x: shouldUseGPUAcceleration() ? -30 : 0,
      transition: {
        duration: getAnimationDuration(200) / 1000,
        ease: 'easeOut'
      }
    }
  } : fadeIn;

  const scale = enableAnimations ? {
    initial: { 
      opacity: 0, 
      scale: shouldUseGPUAcceleration() ? 0.98 : 1,
      ...(shouldUseGPUAcceleration() && { transform: 'scale3d(0.98, 0.98, 1)' })
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      ...(shouldUseGPUAcceleration() && { transform: 'scale3d(1, 1, 1)' }),
      transition: {
        duration: getAnimationDuration(300) / 1000,
        ease: getEasing()
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: getAnimationDuration(150) / 1000,
        ease: 'easeOut'
      }
    }
  } : fadeIn;

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: getAnimationDuration(50) / 1000,
        delayChildren: getAnimationDuration(100) / 1000
      }
    }
  };

  return {
    fadeIn,
    slideUp,
    slideRight,
    scale,
    staggerContainer
  };
}
