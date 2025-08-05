
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Feature card title colors
    '!text-red-600', 'dark:!text-red-400',
    '!text-blue-600', 'dark:!text-blue-400',
    '!text-green-600', 'dark:!text-green-400',
    '!text-purple-600', 'dark:!text-purple-400',
    '!text-orange-600', 'dark:!text-orange-400',
    '!text-indigo-600', 'dark:!text-indigo-400',
    // Gradient animations
    'animate-gradient-flow-x', 'animate-gradient-flow-y', 'animate-gradient-rotate',
    'animate-shimmer', 'animate-glow-pulse', 'animate-bounce-gentle',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['"PT Sans"', 'sans-serif'],
        headline: ['"PT Sans"', 'sans-serif'],
        sans: ['"PT Sans"', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'float-1': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-3': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'gradient-flow-x': {
          '0%, 100%': { transform: 'translateX(-50%) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translateX(50%) scale(1.1)', opacity: '0.6' },
        },
        'gradient-flow-y': {
          '0%, 100%': { transform: 'translateY(-30%) scale(1)', opacity: '0.2' },
          '50%': { transform: 'translateY(30%) scale(1.2)', opacity: '0.5' },
        },
        'gradient-rotate': {
          '0%': { transform: 'rotate(0deg) scale(1)', opacity: '0.3' },
          '33%': { transform: 'rotate(120deg) scale(1.1)', opacity: '0.5' },
          '66%': { transform: 'rotate(240deg) scale(0.9)', opacity: '0.4' },
          '100%': { transform: 'rotate(360deg) scale(1)', opacity: '0.3' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(147, 51, 234, 0.4)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
        },
        'glow-breathe': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)', transform: 'scale(1)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.4), 0 0 60px rgba(147, 51, 234, 0.3)', transform: 'scale(1.01)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float-slow-1': 'float-1 6s ease-in-out infinite',
        'float-slow-2': 'float-2 7s ease-in-out infinite',
        'float-slow-3': 'float-3 5s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-flow-x': 'gradient-flow-x 20s ease-in-out infinite',
        'gradient-flow-y': 'gradient-flow-y 25s ease-in-out infinite',
        'gradient-rotate': 'gradient-rotate 30s linear infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'glow-breathe': 'glow-breathe 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
