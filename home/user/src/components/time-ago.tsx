// src/components/time-ago.tsx
"use client";

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface TimeAgoProps {
  dateString: string;
}

export function TimeAgo({ dateString }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (dateString) {
      setTimeAgo(formatDistanceToNow(new Date(dateString), { addSuffix: true }));
    }
  }, [dateString]);

  if (!timeAgo) {
    return null;
  }

  return <span>{timeAgo}</span>;
}
