"use client";

import type { Course } from "@/lib/courses-data";
import { CourseCard } from "./course-card";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


type CourseListProps = {
  courses: Course[];
};

export function CourseList({ courses }: CourseListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCourse = courses.find((course) => course.id === selectedId);

  const detailImages = selectedCourse?.detailImageIds.map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean) as any[];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onClick={() => setSelectedId(course.id)}
          />
        ))}
      </div>
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`card-container-${selectedCourse.id}`}
              className="bg-card rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full text-white"
                    onClick={() => setSelectedId(null)}
                >
                    <XIcon className="h-6 w-6" />
                </Button>

                {detailImages && detailImages.length > 0 ? (
                    <Carousel className="w-full">
                        <CarouselContent>
                            {detailImages.map((img, index) => (
                                <CarouselItem key={index}>
                                    <div className="aspect-video relative">
                                        <Image
                                            src={img.imageUrl}
                                            alt={selectedCourse.title}
                                            fill
                                            className="object-cover rounded-t-lg"
                                            data-ai-hint={img.imageHint}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4"/>
                        <CarouselNext className="right-4"/>
                    </Carousel>
                ) : (
                    <div className="aspect-video relative">
                        <Image
                            src={PlaceHolderImages.find(img => img.id === selectedCourse.imageId)?.imageUrl || ''}
                            alt={selectedCourse.title}
                            fill
                            className="object-cover rounded-t-lg"
                            data-ai-hint={PlaceHolderImages.find(img => img.id === selectedCourse.imageId)?.imageHint}
                        />
                    </div>
                )}
              </div>

              <motion.div className="p-8">
                <motion.h2 className="text-3xl font-bold mb-4">{selectedCourse.title}</motion.h2>
                <motion.p className="text-muted-foreground mb-6">{selectedCourse.description}</motion.p>
                <Link href={`/courses/${selectedCourse.id}`}>
                    <Button size="lg" className="w-full md:w-auto">Start Learning</Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
