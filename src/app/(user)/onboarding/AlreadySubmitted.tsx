"use client";

import { signOut } from "next-auth/react";
import React from "react";
import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

const AlreadySubmitted = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="relative mx-auto mb-4 h-16 w-16">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Application Submitted
          </CardTitle>
          <CardDescription>Your details are being reviewed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Thank you for submitting your details. Our team is currently
            reviewing your application.
          </p>
          <p className="font-medium">
            Approval typically takes up to 24 hours.
          </p>
          <div className="text-sm text-muted-foreground">
            We&apos;ll notify you once the review is complete.
          </div>
          <CardFooter>
            <Button
              className="mx-auto"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Log Out
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlreadySubmitted;
