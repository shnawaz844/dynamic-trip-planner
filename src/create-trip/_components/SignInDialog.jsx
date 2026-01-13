import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { FcGoogle } from "react-icons/fc";

const SignInDialog = ({
    open = false,
    onOpenChange = () => { },
    onGoogleLogin = () => { },
    title = "Sign In With Google",
    welcomeTitle = "Welcome to UAE Trip Planner",
    welcomeMessage = "Sign in to create your personalized UAE adventure itinerary"
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-neutral-200 dark:border-neutral-800 transition-colors">
                <DialogHeader>
                    <DialogTitle className="text-neutral-900 dark:text-white">{title}</DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col items-center justify-center p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-center mb-2 text-neutral-900 dark:text-white transition-colors">{welcomeTitle}</h2>
                                <p className="text-neutral-600 dark:text-neutral-400 text-center transition-colors">{welcomeMessage}</p>
                            </div>

                            <Button
                                onClick={onGoogleLogin}
                                className="w-full flex gap-4 items-center justify-center py-6 text-lg border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white transition-all"
                                variant="outline"
                            >
                                <FcGoogle className='h-7 w-7' />
                                Continue with Google
                            </Button>

                            <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-6 text-center transition-colors">
                                By signing in, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default SignInDialog;