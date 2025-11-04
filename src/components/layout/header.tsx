"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/verify-email";
  const isLandingPage = pathname === "/";

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (isAuthPage && !isUserLoading && !user) {
    return null; // Don't show header on auth pages for a cleaner look if logged out
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block">NextVerse</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {(!user && !isUserLoading) || isLandingPage ? (
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
          {isUserLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          ) : user ? (
             <Button variant="outline" onClick={handleLogout}>Logout</Button>
          ) : (
             <Link href="/login">
                <Button>Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
