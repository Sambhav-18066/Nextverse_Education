
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Rocket, RefreshCcw } from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

type QuizModalProps = {
  quiz: QuizQuestion[] | null;
  isLoading: boolean;
  onClose: () => void;
  onQuizComplete: (score: number) => void;
  onRegenerate: () => void;
};

export function QuizModal({ quiz, isLoading, onClose, onQuizComplete, onRegenerate }: QuizModalProps) {
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Reset state when quiz changes (e.g., for a new topic or regeneration)
  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  }, [quiz]);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers(prev => ({...prev, [questionIndex]: value}));
  }

  const handleSubmit = () => {
    if(!quiz) return;
    let correctAnswers = 0;
    quiz.forEach((q, i) => {
        const selectedAnswer = answers[i];
        // Handle cases where AI might add extra chars to options or answers
        const isCorrect = selectedAnswer?.trim().toLowerCase() === q.answer.trim().toLowerCase();
        if(isCorrect) {
            correctAnswers++;
        }
    });
    const finalScore = Math.round((correctAnswers / quiz.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
  }
  
  const handleCompletionAcknowledged = () => {
      if (score !== null) {
          onQuizComplete(score);
      }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 min-h-[200px]">
            <Rocket className="h-12 w-12 animate-pulse text-primary" />
            <p className="text-muted-foreground">Generating your personalized quiz...</p>
        </div>
      );
    }

    if (submitted && score !== null) {
        return (
            <div className="p-8 text-center space-y-4">
                <h2 className="text-2xl font-bold">Quiz Results</h2>
                <p className={`text-6xl font-bold ${score >= 75 ? 'text-primary' : 'text-destructive'}`}>{score}%</p>
                <p className="text-muted-foreground">You answered {Math.round(score / 100 * (quiz?.length || 0))} out of {quiz?.length} questions correctly.</p>
                <Button onClick={handleCompletionAcknowledged}>
                    {score >= 75 ? "Continue to Next Topic" : (score < 20 ? "Try New Questions" : "Close and Try Again")}
                </Button>
            </div>
        )
    }

    if (quiz) {
      return (
        <div className="space-y-8">
          {quiz.map((q, qIndex) => (
            <div key={qIndex} className="space-y-4">
              <p className="font-semibold">{qIndex + 1}. {q.question}</p>
              <RadioGroup onValueChange={(value) => handleAnswerChange(qIndex, value)}>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`q${qIndex}o${oIndex}`} />
                    <Label htmlFor={`q${qIndex}o${oIndex}`}>{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      );
    }
    
    // This case handles if loading is false but quiz is null (e.g. an error occurred before modal opened)
    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 min-h-[200px]">
            <p className="text-destructive">Could not load the quiz.</p>
            <p className="text-muted-foreground text-center">There was an issue generating the quiz. Please try again.</p>
            <Button onClick={onClose}>Close</Button>
        </div>
    );
  }

  const allQuestionsAnswered = quiz && Object.keys(answers).length === quiz.length;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Knowledge Check</DialogTitle>
          <DialogDescription>Test your understanding of the video content.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4 p-1">
            {renderContent()}
        </ScrollArea>
        {!submitted && !isLoading && !!quiz && (
            <DialogFooter className="justify-between sm:justify-between">
                <Button variant="ghost" onClick={onRegenerate}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Regenerate
                </Button>
                <Button onClick={handleSubmit} disabled={!allQuestionsAnswered}>Submit Quiz</Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
