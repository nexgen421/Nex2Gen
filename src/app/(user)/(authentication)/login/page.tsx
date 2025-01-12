import React from "react";
import LoginForm from "./_LoginForm";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerAuthSession();

  if (session !== null) {
    redirect("/dashboard");
  }

  return <LoginForm />;
};

export default page;
