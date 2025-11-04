"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailWarning } from "lucide-react";
import { useAuth } from "@/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function UnverifiedPage() {
    const auth = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        // If the user lands here but is verified, send them to the dashboard.
        if (auth.currentUser && auth.currentUser.emailVerified) {
            router.replace('/dashboard');
        }
    }, [auth.currentUser, router]);
    
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
                    description: error.message || "Could not send verification email. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setIsSending(false);
            }
        } else {
            toast({
                title: "Not Logged In",
                description: "You must be logged in to resend a verification email.",
                variant: "destructive",
            });
            setIsSending(false);
            router.push('/login');
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <MailWarning className="h-12 w-12 text-primary"/>
                    </div>
                    <CardTitle>Please Verify Your Email</CardTitle>
                    <CardDescription>
                        Your account has not been verified yet. Check your inbox for a verification link to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Didn&apos;t receive an email? Click the button below to resend it.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleResend} disabled={isSending} className="w-full">
                        {isSending ? "Sending..." : "Resend Verification Email"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
