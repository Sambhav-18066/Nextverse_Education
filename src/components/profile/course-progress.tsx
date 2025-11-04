
"use client";

import { useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { coursesData } from "@/lib/courses-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "../ui/button";

interface CourseProgressProps {
  userId: string;
}

interface UserCourseProgress {
  id: string;
  courseId: string;
  completedTopicIds: string[];
}

export function CourseProgress({ userId }: CourseProgressProps) {
  const firestore = useFirestore();

  const progressCollectionRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return collection(firestore, `users/${userId}/courseProgress`);
  }, [firestore, userId]);

  const {
    data: progressData,
    isLoading,
    error,
  } = useCollection<UserCourseProgress>(progressCollectionRef);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Learning Progress</CardTitle>
          <CardDescription>
            An overview of the courses you&apos;ve engaged with.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            Could not load your course progress.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const hasProgress = progressData && progressData.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Learning Progress</CardTitle>
        <CardDescription>
          An overview of the courses you&apos;ve engaged with.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {hasProgress ? (
          progressData.map((progress) => {
            const course = coursesData.find((c) => c.id === progress.courseId);
            if (!course) return null;

            const totalTopics = course.topics.length;
            const completedTopics = progress.completedTopicIds.length;
            const progressPercentage =
              totalTopics > 0
                ? Math.round((completedTopics / totalTopics) * 100)
                : 0;

            return (
              <div key={progress.id} className="space-y-3">
                <Link href={`/courses/${course.id}`}>
                    <h3 className="text-xl font-semibold hover:text-primary transition-colors">{course.title}</h3>
                </Link>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {completedTopics} of {totalTopics} topics completed ({progressPercentage}%)
                </p>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground mb-4">You haven't started any courses yet.</p>
            <Button asChild>
                <Link href="/dashboard">Explore Courses</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
