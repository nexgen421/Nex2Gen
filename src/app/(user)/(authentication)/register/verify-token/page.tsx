"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Loader2 } from "lucide-react";

const VerifyTokenPage = () => {
  const params = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const { mutateAsync, isPending, isSuccess, isError } =
    api.auth.verifyToken.useMutation();

  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid token or email");
      return;
    }

    mutateAsync({ email, token }).catch((err) => {
      console.error(err);
    });
  }, [token, email, mutateAsync]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              Verifying Your Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPending && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-sm text-gray-600">
                  Please wait while we verify your email...
                </p>
              </div>
            )}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-green-600"
              >
                <p className="text-lg font-semibold">
                  Email verified successfully!
                </p>
                <p className="mt-2 text-sm">
                  You can now close this window and log in.
                </p>
              </motion.div>
            )}
            {isError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-red-600"
              >
                <p className="text-lg font-semibold">Verification failed</p>
                <p className="mt-2 text-sm">
                  Please try again or contact support.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyTokenPage;
