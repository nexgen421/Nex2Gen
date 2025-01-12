"use client";

import Image from "next/image";
import React from "react";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { setAdminSessionToken } from "~/lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface TLogin {
  email: string;
  password: string;
}

const LoginForm = () => {
  const {
    register,
    // formState: { errors },
    handleSubmit,
  } = useForm<TLogin>({});
  const router = useRouter();
  const { mutateAsync } = api.adminAuth.login.useMutation({
    onError(error) {
      toast.error(error.message);
    },
  });
  const handleLogin = async (data: TLogin) => {
    try {
      const { token } = await mutateAsync(data);
      setAdminSessionToken(token);
      toast.success("Logged In!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-16 w-auto"
            height={150}
            width={150}
            src="/logo.png"
            alt="Nex Gen Courier Service"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log In as Admin
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-primary hover:text-accent-foreground"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  {...register("password")}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </div>
            <div className="mt-10 flex items-center justify-end text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/admin/register"
                className="font-semibold text-blue-500 hover:text-blue-700"
              >
                {" "}
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
