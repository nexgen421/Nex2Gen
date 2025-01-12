"use client";
import React, { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { type TRegisterValidator } from "~/types/validators/Auth";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { TRPCClientError } from "@trpc/client";

const RegisterForm = () => {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const { mutateAsync: submitRegisterRequest, status } =
    api.auth.register.useMutation({
      onError(error) {
        setError("root", error);
      },
    });

  const handleRegister = async (data: TRegisterValidator) => {
    try {
      toast.promise(submitRegisterRequest({ ...data, captchaToken }), {
        richColors: true,
        success: "Check Your Email for Verification Link!",
        error(data) {
          if (data instanceof TRPCClientError) {
            return data.message;
          } else {
            return "An error occurred!";
          }
        },
        loading: "Registering User With Nex Gen Courier Services",
      });
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<TRegisterValidator>();

  useEffect(() => {
    if (errors.root) {
      toast.error(errors.root.message);
    }
  }, [errors.root]);

  return (
    <div className="mx-auto mt-10 w-full max-w-md rounded-none bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Nex Gen Courier Services
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Register to Nex Gen Courier Services
      </p>
      {errors.root && (
        <p className="text-sm text-red-500">
          {JSON.stringify(errors.root.message)}
        </p>
      )}
      <form className="my-8" onSubmit={handleSubmit(handleRegister)}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              placeholder="Tyler"
              type="text"
              {...register("firstName")}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              placeholder="Durden"
              type="text"
              {...register("lastName")}
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            {...register("email")}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input
            id="mobile"
            placeholder="9787678XXX"
            maxLength={10}
            type="string"
            {...register("mobile")}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            {...register("password")}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmpassword">Confirm Password</Label>
          <Input
            id="confirmpassword"
            placeholder="••••••••"
            type="password"
            {...register("confirmPassword")}
          />
        </LabelInputContainer>

        <div className="mb-4 flex w-full items-center justify-center">
          <HCaptcha
            theme={"light"}
            sitekey="46e2b756-f9fa-4d70-a0a6-14b6cf0812ee"
            onVerify={(token) => setCaptchaToken(token)}
          />
        </div>

        <Button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={status === "pending" || !captchaToken}
        >
          Sign up &rarr;
          <BottomGradient />
        </Button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      </form>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default RegisterForm;
