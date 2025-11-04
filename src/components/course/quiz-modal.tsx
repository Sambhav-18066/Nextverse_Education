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
  try {
    const sections = quizText.split('Question:').slice(1);
    return sections.map(section => {
      const questionMatch = section.match(/^(.*?)Options:/s);
      const optionsMatch = section.match(/Options:(.*?)Answer:/s);
      const answerMatch = section.match(/Answer:(.*)$/s);

      if (!questionMatch || !optionsMatch || !answerMatch) {
          throw new Error('Invalid quiz format for primary parser');
      }

      const question = questionMatch[1].trim();
      const options = optionsMatch[1].trim().split('\n').map(opt => opt.replace(/^[A-D]\)\s*/, '').trim());
      const answer = answerMatch[1].replace(/^[A-D]\)\s*/, '').trim();

      return { question, options, answer };
    });
  } catch (error) {
    console.error("Failed to parse quiz with primary parser, trying fallback:", error);
    try {
        const simpleSections = quizText.split('\n\n');
        return simpleSections.map(s => {
            const lines = s.split('\n');
            const question = lines[0].replace(/Question:\s*/, '').trim();
            const options = lines.slice(1, -1).map(o => o.replace(/^[A-D]\)\s*/, '').trim());
            const answerLine = lines[lines.length - 1];
            const answer = answerLine.replace(/Answer:\s*/, '').replace(/^[A-D]\)\s*/, '').trim();
            
            if (!question || options.length < 2 || !answer) {
              return null;
            }
            return { question, options, answer };
        }).filter((q): q is QuizQuestion => q !== null);
    } catch(e) {
        console.error("Fallback parser also failed", e);
        return [];
    }
  }
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
