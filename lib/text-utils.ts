/**
 * Text Visibility Utilities
 * 
 * This module provides utilities to ensure text visibility across all themes and backgrounds.
 * It replaces problematic gradient text effects with solid colors that maintain readability.
 */

import { cn } from "@/lib/utils";

/**
 * Text color variants that ensure visibility in both light and dark modes
 */
export const textColors = {
  primary: "text-blue-600 dark:text-blue-400",
  secondary: "text-purple-600 dark:text-purple-400", 
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  danger: "text-red-600 dark:text-red-400",
  info: "text-cyan-600 dark:text-cyan-400",
  neutral: "text-slate-600 dark:text-slate-400",
  heading: "text-slate-900 dark:text-white",
  body: "text-slate-700 dark:text-slate-300",
  muted: "text-slate-500 dark:text-slate-400",
  brand: "text-blue-600 dark:text-blue-400", // For AlertFront branding
} as const;

/**
 * Enhanced text styles with drop shadows for better visibility
 */
export const enhancedTextColors = {
  primary: "text-blue-600 dark:text-blue-400 drop-shadow-sm",
  secondary: "text-purple-600 dark:text-purple-400 drop-shadow-sm",
  success: "text-green-600 dark:text-green-400 drop-shadow-sm", 
  warning: "text-yellow-600 dark:text-yellow-400 drop-shadow-sm",
  danger: "text-red-600 dark:text-red-400 drop-shadow-sm",
  info: "text-cyan-600 dark:text-cyan-400 drop-shadow-sm",
  neutral: "text-slate-600 dark:text-slate-400 drop-shadow-sm",
  heading: "text-slate-900 dark:text-white drop-shadow-lg",
  body: "text-slate-700 dark:text-slate-300 drop-shadow-sm",
  muted: "text-slate-500 dark:text-slate-400 drop-shadow-sm",
  brand: "text-blue-600 dark:text-blue-400 drop-shadow-sm", // For AlertFront branding
} as const;

/**
 * Utility function to get safe text color classes
 * @param variant - The color variant to use
 * @param enhanced - Whether to include drop shadow for better visibility
 * @param className - Additional classes to merge
 */
export function getTextColor(
  variant: keyof typeof textColors = 'body',
  enhanced: boolean = false,
  className?: string
) {
  const baseColor = enhanced ? enhancedTextColors[variant] : textColors[variant];
  return cn(baseColor, className);
}

/**
 * Safe heading component props
 */
export interface SafeHeadingProps {
  variant?: keyof typeof textColors;
  enhanced?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Utility function for creating safe heading classes
 * Replaces problematic gradient text with solid colors
 */
export function getSafeHeadingClasses(
  variant: keyof typeof textColors = 'heading',
  enhanced: boolean = true,
  className?: string
) {
  return getTextColor(variant, enhanced, className);
}

/**
 * Utility function for creating safe brand text classes
 * Specifically for AlertFront branding to ensure visibility
 */
export function getSafeBrandClasses(className?: string) {
  return getTextColor('brand', true, className);
}

/**
 * Utility function to replace gradient text classes with safe alternatives
 * @param originalClasses - The original className string that may contain gradient text
 * @param fallbackVariant - The fallback color variant to use
 */
export function replaceGradientText(
  originalClasses: string,
  fallbackVariant: keyof typeof textColors = 'heading'
): string {
  // Remove problematic gradient text classes
  const cleanedClasses = originalClasses
    .replace(/bg-gradient-to-[a-z]+/g, '')
    .replace(/from-[a-z]+-\d+/g, '')
    .replace(/via-[a-z]+-\d+/g, '')
    .replace(/to-[a-z]+-\d+/g, '')
    .replace(/bg-clip-text/g, '')
    .replace(/text-transparent/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Add safe text color
  return cn(cleanedClasses, getTextColor(fallbackVariant, true));
}

/**
 * Vibrant gradient text patterns that maintain visibility
 * These gradients use close color values to prevent fading
 */
export const vibrantGradientPatterns = {
  // Brand gradients
  brandPrimary: "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent",
  brandSecondary: "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent",

  // Feature gradients
  featureRed: "bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-300 bg-clip-text text-transparent",
  featureBlue: "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent",
  featureGreen: "bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent",
  featurePurple: "bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent",
  featureOrange: "bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-400 dark:to-orange-300 bg-clip-text text-transparent",
  featureIndigo: "bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent",

  // Status gradients
  statusSuccess: "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent",
  statusWarning: "bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent",
  statusDanger: "bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent",
  statusInfo: "bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent",
} as const;

/**
 * Common safe text patterns for different use cases
 */
export const safeTextPatterns = {
  // Page titles
  pageTitle: "text-3xl md:text-4xl font-bold text-slate-900 dark:text-white drop-shadow-lg",
  sectionTitle: "text-2xl font-bold text-slate-800 dark:text-slate-200 drop-shadow-sm",
  cardTitle: "text-xl font-bold text-slate-700 dark:text-slate-300 drop-shadow-sm",

  // Brand text
  brandTitle: "text-2xl font-bold text-blue-600 dark:text-blue-400 drop-shadow-sm",
  brandSubtitle: "text-lg font-medium text-blue-500 dark:text-blue-300 drop-shadow-sm",

  // Status indicators
  statusSuccess: "text-green-600 dark:text-green-400 font-medium drop-shadow-sm",
  statusWarning: "text-yellow-600 dark:text-yellow-400 font-medium drop-shadow-sm",
  statusDanger: "text-red-600 dark:text-red-400 font-medium drop-shadow-sm",
  statusInfo: "text-blue-600 dark:text-blue-400 font-medium drop-shadow-sm",

  // Body text
  bodyText: "text-slate-600 dark:text-slate-300",
  mutedText: "text-slate-500 dark:text-slate-400",
  smallText: "text-sm text-slate-500 dark:text-slate-400",
} as const;

/**
 * Type for safe text pattern keys
 */
export type SafeTextPattern = keyof typeof safeTextPatterns;

/**
 * Get a predefined safe text pattern
 */
export function getSafeTextPattern(pattern: SafeTextPattern, className?: string) {
  return cn(safeTextPatterns[pattern], className);
}

/**
 * Type for vibrant gradient pattern keys
 */
export type VibrantGradientPattern = keyof typeof vibrantGradientPatterns;

/**
 * Get a vibrant gradient pattern that maintains visibility
 * These gradients use close color values to prevent fading
 */
export function getVibrantGradient(pattern: VibrantGradientPattern, className?: string) {
  return cn(vibrantGradientPatterns[pattern], className);
}

/**
 * Utility function to create theme-matching gradient text
 * @param baseColor - The base color (e.g., 'blue', 'red', 'green')
 * @param className - Additional classes to merge
 */
export function getThemeMatchingGradient(baseColor: string, className?: string) {
  const gradientClass = `bg-gradient-to-r from-${baseColor}-600 to-${baseColor}-700 dark:from-${baseColor}-400 dark:to-${baseColor}-300 bg-clip-text text-transparent`;
  return cn(gradientClass, className);
}
