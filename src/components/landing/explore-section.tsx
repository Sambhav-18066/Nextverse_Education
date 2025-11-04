import { CourseList } from "@/components/course/course-list";
import { coursesData } from "@/lib/courses-data";

export function ExploreSection() {
  return (
    <section id="explore" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Explore Our Universe of Knowledge
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Click on any subject to begin your journey. New topics unlock as you master the previous ones.
          </p>
        </div>
        <CourseList courses={coursesData} />
      </div>
    </section>
  );
}
