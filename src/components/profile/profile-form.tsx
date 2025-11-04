
"use client";

import { useState, useRef, useEffect } from "react";
import type { User } from "firebase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, useStorage, useDoc, useMemoFirebase } from "@/firebase";
import {
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface ProfileFormProps {
  user: User;
}

interface UserProfile {
    name: string;
    email: string;
    photoURL?: string;
    mobileNumber: string;
    emailVerified: boolean;
    mobileNumberVerified: boolean;
}

export function ProfileForm({ user: initialUser }: ProfileFormProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userDocRef = useMemoFirebase(() => doc(firestore, `users/${initialUser.uid}`), [firestore, initialUser.uid]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
  };

  const handlePasswordReset = async () => {
    if (userProfile?.email) {
      try {
        await sendPasswordResetEmail(auth, userProfile.email);
        toast({
          title: "Password Reset Email Sent",
          description:
            "Check your inbox for a link to reset your password.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to send password reset email.",
        });
      }
    }
  };

  const handleEmailVerification = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        const actionCodeSettings = {
          url: `${window.location.origin}/profile`,
          handleCodeInApp: true,
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
        toast({
          title: "Verification Email Sent",
          description: "Check your inbox to verify your email address.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to send verification email.",
        });
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !auth.currentUser) return;

    setIsUploading(true);
    try {
      const storageRef = ref(
        storage,
        `avatars/${auth.currentUser.uid}/${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);

      await updateProfile(auth.currentUser, { photoURL });

      const userDocRef = doc(firestore, `users/${auth.currentUser.uid}`);
      setDocumentNonBlocking(userDocRef, { photoURL }, { merge: true });

      toast({
        title: "Avatar Updated",
        description: "Your new profile picture has been saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Could not upload your new avatar.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isProfileLoading) {
      return (
        <Card className="text-center">
            <CardHeader>
                <Skeleton className="w-40 h-40 rounded-full mx-auto" />
                <Skeleton className="h-8 w-3/4 mx-auto mt-4" />
                <Skeleton className="h-6 w-full mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-6 w-1/2 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="text-center">
      <CardHeader>
        <div className="relative w-40 h-40 mx-auto group">
          <Avatar className="w-40 h-40 text-4xl">
            <AvatarImage src={userProfile?.photoURL || ""} alt={userProfile?.name || "User"} />
            <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-background/80 rounded-full h-10 w-10 hover:bg-background transition-opacity"
            onClick={handleAvatarClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            ) : (
              <Pencil className="h-5 w-5" />
            )}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
          />
        </div>

        <CardTitle className="mt-4">{userProfile?.name}</CardTitle>
        <CardDescription>{userProfile?.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2">
            <Label>Email Status:</Label>
            {userProfile?.emailVerified ? (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">Verified</Badge>
            ) : (
                <Badge variant="destructive">Unverified</Badge>
            )}
        </div>
        
        <div className="flex items-center justify-center gap-2">
            <Label>Mobile Status:</Label>
            {userProfile?.mobileNumberVerified ? (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">Verified</Badge>
            ) : (
                <Badge variant="destructive">Unverified</Badge>
            )}
        </div>

        {!userProfile?.emailVerified && (
            <Button onClick={handleEmailVerification} variant="outline" className="w-full">
                Resend Verification Email
            </Button>
        )}

        <Button onClick={handlePasswordReset} className="w-full">
          Reset Password
        </Button>
      </CardContent>
    </Card>
  );
}
