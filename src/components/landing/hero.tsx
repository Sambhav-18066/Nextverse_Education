"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const exploreSection = document.getElementById("explore");
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center text-center">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter glowing-text">
          NextVerse Education
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Your Learning Universe
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="neon-glow">
              Get Started
            </Button>
          </Link>
          <a href="#explore" onClick={handleScroll}>
            <Button size="lg" variant="outline" className="neon-glow">
              Explore
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
