
// src/components/hazard-report-card.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Languages, Loader2, ImageOff } from 'lucide-react';

import type { Report } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { translateToTamil } from '@/ai/flows/translate-to-tamil';
import { useToast } from '@/hooks/use-toast';
import { TimeAgo } from './time-ago';
import { Skeleton } from './ui/skeleton';

type HazardReportCardProps = {
  report: Report;
};

const HazardReportCardSkeleton = () => {
    return (
        <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                <Skeleton className="w-full sm:w-48 sm:h-auto flex-shrink-0 aspect-video rounded-md" />
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                       <Skeleton className="h-4 w-1/3" />
                       <Skeleton className="h-8 w-24" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


export function HazardReportCard({ report }: HazardReportCardProps) {
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (isTranslating) return;
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

  const imageUrl = report.imageUrl;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48 sm:h-auto flex-shrink-0 relative aspect-video">
          {(isImageLoading && imageUrl) && <Skeleton className="h-full w-full absolute" />}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={report.description}
              fill
              className="rounded-md object-cover"
              data-ai-hint="hazard street"
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                console.error("Image failed to load:", imageUrl);
                setIsImageLoading(false);
              }}
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-md flex flex-col items-center justify-center text-xs text-muted-foreground gap-2">
              <ImageOff className="w-6 h-6"/>
              <span>No Image</span>
            </div>
          )}
        </div>
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

HazardReportCard.Skeleton = HazardReportCardSkeleton;
