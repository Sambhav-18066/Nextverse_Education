
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
import { generateQuizFromTranscript, type GenerateQuizFromTranscriptOutput } from '@/ai/flows/generate-quiz-from-transcript';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Rocket } from 'lucide-react';

type QuizModalProps = {
  transcript: string;
  onClose: () => void;
  onQuizComplete: (score: number) => void;
};

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

const parseQuiz = (quizText: string): QuizQuestion[] => {
  if (!quizText) return [];
  
  const questions: QuizQuestion[] = [];
  const questionBlocks = quizText.split(/Q\d+:|Question \d+:|\n\d+\./).filter(s => s.trim().length > 10);

  questionBlocks.forEach(block => {
    const lines = block.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length < 3) return;

    const question = lines[0].trim();
    let answer = '';
    const options: string[] = [];

    const answerLineIndex = lines.findIndex(line => line.toLowerCase().includes('answer:'));
    if (answerLineIndex !== -1) {
      answer = lines[answerLineIndex].replace(/.*Answer:\s*/i, '').replace(/[A-D]\)\s/i, '').trim();
      lines.splice(answerLineIndex, 1);
    } else {
      return; // No answer found for this block
    }

    lines.slice(1).forEach(line => {
      if (line.match(/^[A-D]\)/i)) {
        options.push(line.replace(/^[A-D]\)\s*/i, '').trim());
      }
    });

    if (question && options.length >= 2 && answer) {
      // Find the full option text that matches the answer key
      const correctAnswer = options.find(opt => opt.toLowerCase().startsWith(answer.toLowerCase()));
      if (correctAnswer) {
        questions.push({
          question,
          options,
          answer: correctAnswer
        });
      }
    }
  });

  return questions;
};


export function QuizModal({ transcript, onClose, onQuizComplete }: QuizModalProps) {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await generateQuizFromTranscript({ transcript });
        const parsedQuiz = parseQuiz(result.quiz);
        if (parsedQuiz.length === 0) {
            throw new Error("Quiz parsing resulted in no questions.");
        }
        setQuiz(parsedQuiz);
      } catch (err) {
        setError('Failed to generate or parse the quiz. The AI might be busy or the format is unexpected. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [transcript]);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers(prev => ({...prev, [questionIndex]: value}));
  }

  const handleSubmit = () => {
    if(!quiz) return;
    let correctAnswers = 0;
    quiz.forEach((q, i) => {
        if(answers[i] === q.answer) {
            correctAnswers++;
        }
    });
    const finalScore = Math.round((correctAnswers / quiz.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <Rocket className="h-12 w-12 animate-pulse text-primary" />
            <p className="text-muted-foreground">Generating quiz...</p>
        </div>
      );
    }

    if (error) {
        return <p className="text-destructive p-4">{error}</p>;
    }

    if (submitted && score !== null) {
        return (
            <div className="p-8 text-center space-y-4">
                <h2 className="text-2xl font-bold">Quiz Results</h2>
                <p className="text-6xl font-bold" style={{color: score >= 75 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}}>{score}%</p>
                <p className="text-muted-foreground">You answered {Math.round(score / 100 * (quiz?.length || 0))} out of {quiz?.length} questions correctly.</p>
                <Button onClick={() => onQuizComplete(score)}>
                    {score >= 75 ? "Continue to Next Topic" : "Close and Try Again"}
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
    return null;
  }

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
        {!submitted && !isLoading && !error && (
            <DialogFooter>
                <Button onClick={handleSubmit} disabled={!quiz || Object.keys(answers).length !== quiz?.length}>Submit Quiz</Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
