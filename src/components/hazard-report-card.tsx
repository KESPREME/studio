// src/components/hazard-report-card.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Languages, Loader2 } from 'lucide-react';

import type { Report } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { translateToTamil } from '@/ai/flows/translate-to-tamil';
import { useToast } from '@/hooks/use-toast';
import { TimeAgo } from './time-ago';
import { Skeleton } from './ui/skeleton';
import { supabase } from '@/lib/supabase';

type HazardReportCardProps = {
  report: Report;
};

export function HazardReportCard({ report }: HazardReportCardProps) {
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let objectUrl: string | null = null;
    const loadImage = async () => {
      if (report.imageUrl) {
        setIsImageLoading(true);
        const { data, error } = await supabase.storage
          .from('images')
          .download(report.imageUrl); // report.imageUrl is now the path

        if (error) {
          console.error('Error downloading image:', error);
          setImageUrl(null);
        } else if (data) {
          objectUrl = URL.createObjectURL(data);
          setImageUrl(objectUrl);
        }
        setIsImageLoading(false);
      } else {
        setIsImageLoading(false);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [report.imageUrl]);


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
          <div className="w-full sm:w-48 sm:h-auto flex-shrink-0 relative aspect-video">
            {isImageLoading ? (
              <Skeleton className="h-full w-full" />
            ) : imageUrl ? (
              <Image
                src={imageUrl}
                alt={report.description}
                fill
                className="rounded-md object-cover"
                data-ai-hint="hazard street"
              />
            ) : (
               <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                  Image not available
                </div>
            )}
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
