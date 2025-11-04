"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isLandingPage = pathname === "/";

  if (isAuthPage) {
    return null; // Don't show header on auth pages for a cleaner look
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block">NextVerse</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {isLandingPage ? (
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Courses
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isLandingPage ? (
             <Link href="/login">
                <Button>Get Started</Button>
            </Link>
          ) : (
            <Link href="/">
                <Button variant="outline">Logout</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
