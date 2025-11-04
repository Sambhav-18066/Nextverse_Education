"use client";

import type { Course } from "@/lib/courses-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

type CourseCardProps = {
  course: Course;
  onClick?: () => void;
  action?: 'explore' | 'learn';
};

export function CourseCard({ course, onClick, action = 'explore' }: CourseCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === course.imageId);

  return (
    <motion.div layoutId={`card-container-${course.id}`} className="cursor-pointer" onClick={onClick}>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
        {image && (
          <div className="aspect-video relative">
            <Image
              src={image.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription className="line-clamp-2">{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="outline" className="w-full">
                {action === 'explore' ? 'Explore' : 'Start Learning'}
            </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
