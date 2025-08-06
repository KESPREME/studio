"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | "glow";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = "default", size = "default", className, disabled, loading, ...props }, ref) => {
    const baseClasses = "relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden transform-gpu";

    const variants = {
      default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25",
      destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25",
      outline: "border-2 border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-lg",
      secondary: "bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 text-slate-900 dark:text-slate-100 shadow-lg hover:shadow-xl",
      ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-lg",
      link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline",
      gradient: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25",
      glow: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/25",
    };

    const sizes = {
      default: "h-12 px-6 py-3 text-sm",
      sm: "h-9 px-4 py-2 text-xs",
      lg: "h-14 px-8 py-4 text-base",
      icon: "h-12 w-12",
    };

    const buttonVariants = {
      initial: { scale: 1, rotateX: 0, rotateY: 0 },
      hover: { 
        scale: 1.05, 
        rotateX: -5, 
        rotateY: 5,
        transition: { duration: 0.2, ease: "easeOut" }
      },
      tap: { 
        scale: 0.95, 
        rotateX: 5, 
        rotateY: -5,
        transition: { duration: 0.1, ease: "easeInOut" }
      },
    };

    const shineVariants = {
      initial: { x: "-100%", opacity: 0 },
      hover: { 
        x: "100%", 
        opacity: [0, 1, 0],
        transition: { duration: 0.6, ease: "easeInOut" }
      },
    };

    const glowVariants = {
      initial: { opacity: 0, scale: 0.8 },
      hover: { 
        opacity: 1, 
        scale: 1.2,
        transition: { duration: 0.3, ease: "easeOut" }
      },
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        disabled={disabled || loading}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        {...props}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-white/10 opacity-0"
          variants={glowVariants}
        />

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
          variants={shineVariants}
        />

        {/* 3D Border Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-white/10 pointer-events-none" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {loading && (
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
          {children}
        </span>


      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
