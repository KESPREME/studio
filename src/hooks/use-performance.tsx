"use client";

import { useMemo } from 'react';

// Performance-optimized animation variants
export const useOptimizedVariants = () => {
  return useMemo(() => ({
    // Reduced complexity variants for better performance
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
    },
  }), []);
};

// Performance-optimized animation settings
export const useAnimationSettings = () => {
  return useMemo(() => ({
    // Animation settings
    enableAnimations: true,
    shouldUseGPUAcceleration: true,
    // Reduced duration for better performance
    fast: {
      duration: 0.2,
      ease: "easeOut",
    },
    normal: {
      duration: 0.3,
      ease: "easeInOut",
    },
    slow: {
      duration: 0.5,
      ease: "easeInOut",
    },
  }), []);
};
