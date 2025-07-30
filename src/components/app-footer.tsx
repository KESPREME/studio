
// src/components/app-footer.tsx
"use client";

import { useState, useEffect } from 'react';

export function AppFooter() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  if (!isMounted) {
    return <div className="h-10" />;
  }

  return (
    <footer className="py-4 text-center text-sm text-muted-foreground h-10">
      <p>&copy; {currentYear} AlertFront. All rights reserved.</p>
    </footer>
  );
}
