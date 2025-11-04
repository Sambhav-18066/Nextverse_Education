"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateVideoSummary, type GenerateVideoSummaryOutput } from '@/ai/flows/generate-video-summary';
import { Rocket } from 'lucide-react';

type SummaryModalProps = {
  transcript: string;
  onClose: () => void;
};

export function SummaryModal({ transcript, onClose }: SummaryModalProps) {
  const [summary, setSummary] = useState<GenerateVideoSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const result = await generateVideoSummary({ transcript });
        setSummary(result);
      } catch (err) {
        setError('Failed to generate summary. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [transcript]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Video Summary</DialogTitle>
          <DialogDescription>
            An AI-generated summary of the video content.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
                <Rocket className="h-12 w-12 animate-pulse text-primary" />
                <p className="text-muted-foreground">Generating summary...</p>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {summary && (
            <div className="prose prose-invert max-w-none">
              <p>{summary.summary}</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
