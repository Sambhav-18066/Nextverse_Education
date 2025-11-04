import { Hero } from "@/components/landing/hero";
import { ExploreSection } from "@/components/landing/explore-section";
import SpaceBackground from "@/components/landing/space-background";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <SpaceBackground />
      <div className="relative z-10">
        <Hero />
        <ExploreSection />
      </div>
    </div>
  );
}
