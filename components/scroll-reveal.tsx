
"use client";

import { useRef, useEffect, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '50px', // Start animation 50px before element enters viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  // Improved visibility logic - show content immediately if above fold or after mount
  const shouldBeVisible = isVisible || (isMounted && ref.current && ref.current.getBoundingClientRect().top < window.innerHeight);

  const style = {
    transition: `opacity 0.6s ease-out, transform 0.6s ease-out`,
    opacity: shouldBeVisible ? 1 : 0.3, // Start with some opacity instead of completely hidden
    transform: shouldBeVisible ? 'translateY(0)' : 'translateY(20px)',
    transitionDelay: `${delay}s`,
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
