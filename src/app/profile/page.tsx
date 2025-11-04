
"use client";

import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileForm } from "@/components/profile/profile-form";
import { CourseProgress } from "@/components/profile/course-progress";
import { doc } from "firebase/firestore";

interface UserProfile {
    name: string;
    email: string;
    photoURL?: string;
    mobileNumber: string;
    emailVerified: boolean;
    mobileNumberVerified: boolean;
}

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Card className="text-center">
                <CardHeader>
                    <Skeleton className="w-40 h-40 rounded-full mx-auto" />
                    <Skeleton className="h-8 w-3/4 mx-auto mt-4" />
                    <Skeleton className="h-6 w-full mx-auto" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1">
          <ProfileForm user={user} />
        </div>
        <div className="md:col-span-2">
          <CourseProgress userId={user.uid} />
        </div>
      </div>
    </div>
  );
}

// Need to define Card components used in skeleton for it to render
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
