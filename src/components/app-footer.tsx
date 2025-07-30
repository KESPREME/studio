// src/components/app-footer.tsx
"use client";

import { useState, useEffect } from 'react';

export function AppFooter() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-4 text-center text-sm text-muted-foreground h-10">
      {year ? (
        <p>&copy; {year} AlertFront. All rights reserved.</p>
      ) : (
        <div className="h-full w-full" />
      )}
    </footer>
  );
}
