// src/components/peeking-raccoon.tsx
"use client";

import { cn } from "@/lib/utils";

type PeekingRaccoonProps = {
  isPeeking: boolean;
  isHiding: boolean;
};

export function PeekingRaccoon({ isPeeking, isHiding }: PeekingRaccoonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute -top-14 -right-20 w-48 h-48 transition-all duration-500 ease-in-out z-0",
        isPeeking && "-translate-x-12 translate-y-8 -rotate-12",
        isHiding && "translate-x-16 -translate-y-10 rotate-12",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="drop-shadow-lg"
      >
        {/* Head */}
        <path
          d="M100 20 C 50 20, 30 60, 30 100 C 30 140, 50 180, 100 180 C 150 180, 170 140, 170 100 C 170 60, 150 20, 100 20 Z"
          fill="#5D6D7E"
        />

        {/* Mask */}
        <path
          d="M 40 90 C 20 110, 25 150, 50 140 L 150 140 C 175 150, 180 110, 160 90 C 140 70, 60 70, 40 90 Z"
          fill="#2C3E50"
        />
        <path
          d="M60 75 Q 100 65, 140 75 L 155 100 Q 100 115, 45 100 Z"
          fill="#34495E"
        />

        {/* Eyes */}
        <circle cx="75" cy="100" r="10" fill="white" />
        <circle cx="125" cy="100" r="10" fill="white" />
        <circle
          cx="75"
          cy="100"
          r="5"
          fill="#2C3E50"
          className={cn(
            "transition-transform duration-300",
            isPeeking ? "translate-x-1" : "translate-x-0"
          )}
        />
        <circle
          cx="125"
          cy="100"
          r="5"
          fill="#2C3E50"
          className={cn(
            "transition-transform duration-300",
            isPeeking ? "translate-x-1" : "translate-x-0"
          )}
        />

        {/* Nose */}
        <path d="M 90 125 C 90 120, 110 120, 110 125 Q 100 140, 90 125 Z" fill="#2C3E50" />
        
        {/* Ears */}
        <path d="M 40 40 C 20 60, 40 80, 60 60 Z" fill="#4D5656" />
        <path d="M 160 40 C 180 60, 160 80, 140 60 Z" fill="#4D5656" />
        <path d="M 50 50 C 40 60, 50 70, 60 60 Z" fill="#99A3A4" />
        <path d="M 150 50 C 160 60, 150 70, 140 60 Z" fill="#99A3A4" />
      </svg>
    </div>
  );
}
