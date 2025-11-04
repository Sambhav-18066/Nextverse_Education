"use client";

import { useState } from "react";
import { CourseList } from "@/components/course/course-list";
import { coursesData, type Course } from "@/lib/courses-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, BrainCircuit } from "lucide-react";
import { enhanceSearch } from "@/ai/flows/enhance-search-with-ai";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const initialState: { courses: Course[] | null; enhancedQuery: string | null } = {
    courses: null,
    enhancedQuery: null
};

function SearchButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <BrainCircuit className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
            <span className="sr-only">Search</span>
        </Button>
    )
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const searchAction = async (prevState: typeof initialState, formData: FormData): Promise<typeof initialState> => {
    const query = formData.get("search") as string;
    if (!query) {
      return { courses: coursesData, enhancedQuery: "" };
    }
    
    try {
        const { enhancedQuery } = await enhanceSearch({
            query: query,
            availableCourses: coursesData.map(c => c.title),
        });

        const lowercasedQuery = enhancedQuery.toLowerCase();
        const filteredCourses = coursesData.filter(course =>
            course.title.toLowerCase().includes(lowercasedQuery)
        );

        return { courses: filteredCourses, enhancedQuery };

    } catch (e) {
        console.error(e);
        // Fallback to simple search on AI error
        const lowercasedQuery = query.toLowerCase();
        const filteredCourses = coursesData.filter(course =>
            course.title.toLowerCase().includes(lowercasedQuery) ||
            course.description.toLowerCase().includes(lowercasedQuery)
        );
        return { courses: filteredCourses, enhancedQuery: `Error using AI search for: ${query}.` };
    }
  }

  const [state, formAction] = useActionState(searchAction, initialState);

  const displayedCourses = state.courses ?? coursesData;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Welcome, Learner!</h1>
        <p className="text-lg text-muted-foreground">
          What new knowledge will you discover today?
        </p>
        <form action={formAction} className="max-w-xl flex gap-2">
            <Input 
                name="search"
                placeholder="Search for 'space' or 'qunatum phisics'..." 
                className="text-lg"
            />
            <SearchButton />
        </form>
        {state.enhancedQuery && (
            <p className="text-sm text-muted-foreground">
                Showing results for: <span className="font-semibold text-primary">{state.enhancedQuery}</span>
            </p>
        )}
      </div>

      <CourseList courses={displayedCourses} />
    </div>
  );
}
