"use client";

import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TSignup {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TSignup>();
  const router = useRouter();
  const { mutateAsync } = api.adminAuth.createAdmin.useMutation({
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleAdminCreate = async (data: TSignup) => {
    await mutateAsync({
      email: data.email,
      mobile: data.mobile,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    });

    toast.success("Admin Created Successfully!");
    router.push("/admin/login");
  };

  return (
    <div className="mx-auto max-w-4xl p-6 font-[sans-serif] text-[#333]">
      <div className="mb-16 text-center">
        <a href="javascript:void(0)">
          <Image
            src="/logo.png"
            alt="logo"
            className="inline-block w-52"
            width={200}
            height={200}
          />
        </a>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up as Admin
        </h2>
      </div>
      <form onSubmit={handleSubmit(handleAdminCreate)}>
        <div className="grid gap-x-12 gap-y-7 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm">First Name</label>
            <input
              type="text"
              className="w-full rounded-md bg-gray-100 px-4 py-3.5 text-sm outline-blue-500"
              placeholder="Enter name"
              {...register("firstName")}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">Last Name</label>
            <input
              type="text"
              className="w-full rounded-md bg-gray-100 px-4 py-3.5 text-sm outline-blue-500"
              placeholder="Enter last name"
              {...register("lastName")}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">Email Id</label>
            <input
              type="text"
              className="w-full rounded-md bg-gray-100 px-4 py-3.5 text-sm outline-blue-500"
              placeholder="Enter email"
              {...register("email")}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">Mobile No.</label>
            <input
              type="number"
              className="w-full rounded-md bg-gray-100 px-4 py-3.5 text-sm outline-blue-500"
              placeholder="Enter mobile number"
              {...register("mobile")}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">Password</label>
            <input
              type="password"
              className="w-full rounded-md bg-gray-100 px-4 py-3.5 text-sm outline-blue-500"
              placeholder="Enter password"
              {...register("password")}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">Confirm Password</label>
            <input
              type="password"
              className="w-full rounded-md bg-gray-100 px-4 py-3.5 text-sm outline-blue-500"
              placeholder="Enter confirm password"
              {...register("confirmPassword")}
            />
          </div>
        </div>
        <div className="!mt-10">
          <button
            type="submit"
            className="min-w-[150px] rounded bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none"
          >
            Sign up
          </button>
        </div>

        <div className="!mt-10 flex items-center justify-end text-sm">
          Already have an account?{" "}
          <Link
            href="/admin/login"
            className="font-semibold text-blue-500 hover:text-blue-700"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
