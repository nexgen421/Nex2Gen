import { redirect } from "next/navigation";
import React from "react";
import DefaultLayout from "~/layouts/DefaultLayout";
import { api } from "~/trpc/server";

const layout = async ({ children }: { children: React.ReactNode }) => {
  try {
    await api.adminAuth.fetchSession();
    return <DefaultLayout>{children}</DefaultLayout>;
  } catch (error) {
    redirect("/admin/login");
  }
};

export default layout;
