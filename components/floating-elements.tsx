"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingElementsProps {
  count?: number;
  colors?: string[];
  size?: "sm" | "md" | "lg";
  speed?: "slow" | "normal" | "fast";
}

export function FloatingElements({ 
  count = 15, 
  colors = ["blue", "purple", "pink", "cyan"],
  size = "md",
  speed = "normal"
}: FloatingElementsProps) {
  const [elements, setElements] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const newElements = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: speed === "fast" ? 2 + Math.random() * 2 : 
                speed === "slow" ? 6 + Math.random() * 4 : 
                4 + Math.random() * 3,
    }));
    setElements(newElements);
  }, [count, colors, speed]);

  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const getColorClass = (color: string) => {
    const colorMap = {
      blue: "bg-blue-400/30",
      purple: "bg-purple-400/30",
      pink: "bg-pink-400/30",
      cyan: "bg-cyan-400/30",
      green: "bg-green-400/30",
      yellow: "bg-yellow-400/30",
      red: "bg-red-400/30",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute rounded-full ${sizeClasses[size]} ${getColorClass(element.color)} blur-sm`}
          initial={{
            x: `${element.x}vw`,
            y: `${element.y}vh`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: [
              `${element.x}vw`,
              `${(element.x + 20) % 100}vw`,
              `${(element.x + 40) % 100}vw`,
              `${element.x}vw`,
            ],
            y: [
              `${element.y}vh`,
              `${(element.y + 15) % 100}vh`,
              `${(element.y + 30) % 100}vh`,
              `${element.y}vh`,
            ],
            opacity: [0, 0.6, 0.8, 0.6, 0],
            scale: [0, 1, 1.2, 1, 0],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Preset configurations for different moods
export function FloatingElementsBlue() {
  return <FloatingElements colors={["blue", "cyan"]} count={12} speed="slow" />;
}

export function FloatingElementsPurple() {
  return <FloatingElements colors={["purple", "pink"]} count={10} speed="normal" />;
}

export function FloatingElementsRainbow() {
  return <FloatingElements colors={["blue", "purple", "pink", "cyan", "green"]} count={20} speed="fast" size="sm" />;
}
