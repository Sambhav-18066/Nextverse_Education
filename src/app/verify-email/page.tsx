"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useAuth } from "@/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function VerifyEmailPage() {
    const auth = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        // This is a simple check. A more robust solution might involve a listener.
        const interval = setInterval(async () => {
            if (auth.currentUser) {
                await auth.currentUser.reload();
                if (auth.currentUser.emailVerified) {
                    clearInterval(interval);
                    toast({
                        title: "Email Verified!",
                        description: "You can now log in.",
                    });
                    router.replace("/login");
                }
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [auth.currentUser, router, toast]);

    const handleResend = async () => {
        setIsSending(true);
        if (auth.currentUser) {
            try {
                await sendEmailVerification(auth.currentUser);
                toast({
                    title: "Verification Email Sent",
                    description: "Check your inbox for a new verification link.",
                });
            } catch (error: any) {
                toast({
                    title: "Error Sending Email",
                    description: "Please wait a moment before trying again.",
                    variant: "destructive",
                });
            } finally {
                setIsSending(false);
            }
        } else {
             toast({
                title: "Not Logged In",
                description: "You need to be logged in to perform this action.",
                variant: "destructive",
            });
            router.push('/login');
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <MailCheck className="h-12 w-12 text-primary"/>
                    </div>
                    <CardTitle>Verify Your Email</CardTitle>
                    <CardDescription>
                        We&apos;ve sent a verification link to your email address. Please click the link to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Once verified, you can log in to your account. This page will automatically redirect you after you verify.
                    </p>
                     <Button onClick={handleResend} disabled={isSending} variant="secondary" className="w-full">
                        {isSending ? "Sending..." : "Resend Verification Email"}
                    </Button>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
