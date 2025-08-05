"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: "default" | "glass" | "gradient" | "glow" | "floating";
  className?: string;
  hover3d?: boolean;
  glowColor?: string;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, variant = "default", className, hover3d = true, glowColor = "blue", ...props }, ref) => {
    const baseClasses = "relative overflow-hidden rounded-2xl transition-all duration-500 transform-gpu";

    const variants = {
      default: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg",
      glass: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl",
      gradient: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 border border-blue-200/50 dark:border-slate-700 shadow-xl",
      glow: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl",
      floating: "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 shadow-2xl",
    };

    const cardVariants = {
      initial: { 
        scale: 1, 
        rotateX: 0, 
        rotateY: 0,
        z: 0,
      },
      hover: hover3d ? { 
        scale: 1.02, 
        rotateX: -5, 
        rotateY: 5,
        z: 50,
        transition: { 
          duration: 0.3, 
          ease: "easeOut",
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      } : {
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      },
    };

    const glowVariants = {
      initial: { opacity: 0, scale: 0.8 },
      hover: { 
        opacity: variant === "glow" ? 0.6 : 0.3, 
        scale: 1.1,
        transition: { duration: 0.3, ease: "easeOut" }
      },
    };

    const shineVariants = {
      initial: { x: "-100%", opacity: 0 },
      hover: { 
        x: "100%", 
        opacity: [0, 0.5, 0],
        transition: { duration: 0.8, ease: "easeInOut" }
      },
    };

    const floatingVariants = {
      initial: { y: 0 },
      animate: variant === "floating" ? {
        y: [-2, 2, -2],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {},
    };

    const glowColors = {
      blue: "shadow-blue-500/25",
      purple: "shadow-purple-500/25",
      green: "shadow-green-500/25",
      red: "shadow-red-500/25",
      yellow: "shadow-yellow-500/25",
      pink: "shadow-pink-500/25",
      cyan: "shadow-cyan-500/25",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, variants[variant], className)}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        animate={variant === "floating" ? "animate" : "initial"}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        {...props}
      >
        {/* Glow Effect */}
        {(variant === "glow" || hover3d) && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-2xl blur-xl -z-10",
              glowColors[glowColor as keyof typeof glowColors] || glowColors.blue
            )}
            variants={glowVariants}
          />
        )}

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
          variants={shineVariants}
        />

        {/* 3D Border Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/5 to-white/5 pointer-events-none" />
        
        {/* Floating Particles for Special Variants */}
        {(variant === "glow" || variant === "floating") && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-full"
                animate={{
                  x: [0, Math.random() * 50 - 25],
                  y: [0, Math.random() * 50 - 25],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard };
