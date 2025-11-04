
"use client";

import { useState, useRef } from "react";
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
import { useAuth, useFirestore, useStorage } from "@/firebase";
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

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user: initialUser }: ProfileFormProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const [user, setUser] = useState(initialUser);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
  };

  const handlePasswordReset = async () => {
    if (user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
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
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
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

      setUser({ ...user, photoURL });

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

  return (
    <Card className="text-center">
      <CardHeader>
        <div className="relative w-40 h-40 mx-auto group">
          <Avatar className="w-40 h-40 text-4xl">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-background/80 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
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

        <CardTitle className="mt-4">{user.displayName}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2">
            <Label>Email Status:</Label>
            {user.emailVerified ? (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">Verified</Badge>
            ) : (
                <Badge variant="destructive">Unverified</Badge>
            )}
        </div>

        {!user.emailVerified && (
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
