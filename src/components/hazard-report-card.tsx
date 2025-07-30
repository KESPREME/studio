// src/components/hazard-report-card.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Languages, Loader2 } from 'lucide-react';

import type { Report } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { translateToTamil } from '@/ai/flows/translate-to-tamil';
import { useToast } from '@/hooks/use-toast';
import { TimeAgo } from './time-ago';

type HazardReportCardProps = {
  report: Report;
};

export function HazardReportCard({ report }: HazardReportCardProps) {
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    setIsTranslating(true);
    setTranslatedText('');
    try {
      const result = await translateToTamil({ text: report.description });
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: 'Translation Failed',
        description: 'Could not translate the report at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'New':
        return 'bg-primary';
      case 'In Progress':
        return 'bg-accent';
      case 'Resolved':
        return 'bg-green-500';
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
        {report.imageUrl && (
          <div className="w-full sm:w-48 sm:h-auto flex-shrink-0 relative aspect-square">
            <Image
              src={report.imageUrl}
              alt={report.description}
              fill
              className="rounded-md object-cover"
              data-ai-hint="hazard street"
            />
          </div>
        )}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-foreground">{report.description}</p>
            {translatedText && (
              <p className="text-primary mt-2 p-2 bg-primary/10 rounded-md">
                {translatedText}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant={report.urgency === 'High' ? 'destructive' : report.urgency === 'Moderate' ? 'secondary' : 'default'} className="capitalize">
              {report.urgency} Urgency
            </Badge>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${getStatusColor(report.status)}`}></span>
              <span>{report.status}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <TimeAgo dateString={report.createdAt} />
            <Button onClick={handleTranslate} disabled={isTranslating} size="sm" variant="ghost">
              {isTranslating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Languages className="mr-2 h-4 w-4" />
              )}
              Translate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
