"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "~/components/ui/card";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface TLoginForm {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TLoginForm>({});

  const handleLogin = async (data: TLoginForm) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen flex-col items-center">
      {/* Background image with subtle opacity */}
      <div className="container fixed -z-50 h-screen bg-login-bg bg-cover bg-center bg-no-repeat"></div>

      {/* Logo */}
      <div className="mb-8 mt-8 rounded-lg bg-white p-4 shadow-lg md:mt-12 lg:mt-24">
        <Image src={"/logo.png"} alt="logo" width={150} height={70} />
      </div>

      {/* Card container with opacity and padding */}
      <Card className="w-full max-w-[400px] bg-white/80 p-6 shadow-lg backdrop-blur-md md:p-8">
        <CardHeader className="space-y-1">
          <h1 className="text-center text-2xl font-semibold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="text-center text-sm text-gray-500">
            Enter your credentials to login
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  maxLength: {
                    value: 50,
                    message: "Email must be less than 50 characters",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  maxLength: {
                    value: 30,
                    message: "Password must be less than 30 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Create account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
