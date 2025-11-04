"use client";

import { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { coursesData, type Topic } from '@/lib/courses-data';
import { Button } from '@/components/ui/button';
import { BrainCircuit, BookOpen, Check, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SummaryModal } from '@/components/course/summary-modal';
import { QuizModal } from '@/components/course/quiz-modal';

type TopicProgress = {
  [topicId: string]: {
    unlocked: boolean;
    score: number | null;
  };
};

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const course = useMemo(() => coursesData.find((c) => c.id === params.courseId), [params.courseId]);
  const { toast } = useToast();

  const [activeTopic, setActiveTopic] = useState<Topic | null>(course?.topics[0] ?? null);
  const [topicProgress, setTopicProgress] = useState<TopicProgress>(() => {
    const progress: TopicProgress = {};
    course?.topics.forEach((topic, index) => {
      progress[topic.id] = {
        unlocked: index === 0,
        score: null,
      };
    });
    return progress;
  });

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  if (!course || !activeTopic) {
    return notFound();
  }

  const handleQuizComplete = (score: number) => {
    const newProgress = { ...topicProgress };
    newProgress[activeTopic.id].score = score;
    
    if (score >= 75) {
      const currentIndex = course.topics.findIndex(t => t.id === activeTopic.id);
      if (currentIndex < course.topics.length - 1) {
        const nextTopic = course.topics[currentIndex + 1];
        newProgress[nextTopic.id].unlocked = true;
        toast({
          title: "Congratulations! 🎉",
          description: `You've unlocked "${nextTopic.title}"!`,
        });
      } else {
         toast({
          title: "Course Completed! 🚀",
          description: "You've mastered all topics in this course.",
        });
      }
    } else {
        toast({
          title: "Keep Trying! 💪",
          description: "You need a score of 75% or higher to unlock the next topic.",
          variant: "destructive"
        });
    }

    setTopicProgress(newProgress);
    setShowQuizModal(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-theme(height.14))]">
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="aspect-video bg-card rounded-lg mb-6 overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${activeTopic.videoId}`}
            title={activeTopic.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{activeTopic.title}</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => setShowSummaryModal(true)}>
              <BookOpen className="mr-2 h-4 w-4" /> Generate Summary
            </Button>
            <Button onClick={() => setShowQuizModal(true)}>
              <BrainCircuit className="mr-2 h-4 w-4" /> Take Quiz
            </Button>
          </div>
          <p className="text-muted-foreground pt-4">
            Watch the video and use the buttons above to generate a summary or take a quiz to test your knowledge.
            Score 75% or more on the quiz to unlock the next topic.
          </p>
        </div>
      </main>

      <aside className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l bg-card/50 overflow-y-auto p-4">
        <h2 className="text-xl font-semibold mb-4">{course.title}</h2>
        <ul className="space-y-2">
          {course.topics.map((topic) => {
            const progress = topicProgress[topic.id];
            const isUnlocked = progress.unlocked;
            const isActive = topic.id === activeTopic.id;
            const score = progress.score;
            return (
              <li key={topic.id}>
                <button
                  onClick={() => isUnlocked && setActiveTopic(topic)}
                  disabled={!isUnlocked}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent disabled:bg-transparent'
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium">{topic.title}</p>
                    {score !== null && (
                         <p className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>Score: {score}%</p>
                    )}
                  </div>
                  {!isUnlocked ? (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    score !== null && score >= 75 && <Check className="h-5 w-5 text-green-400"/>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {showSummaryModal && (
        <SummaryModal
          transcript={activeTopic.transcript}
          onClose={() => setShowSummaryModal(false)}
        />
      )}
      {showQuizModal && (
        <QuizModal
          transcript={activeTopic.transcript}
          onClose={() => setShowQuizModal(false)}
          onQuizComplete={handleQuizComplete}
        />
      )}
    </div>
  );
}
