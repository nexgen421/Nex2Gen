import { type ReactNode } from "react";
import { getServerAuthSession } from "~/server/auth";
import { redirect, RedirectType } from "next/navigation";
import { api } from "~/trpc/server";
import UserAuthedLayout from "~/layouts/UserAuthedLayout";

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerAuthSession();
  if (!session || !session.user) {
    redirect("/login", RedirectType.replace);
  }
  const approved = await api.auth.isUserApproved({ id: session.user.id });

  if (!approved.isKycSubmitted) {
    redirect("/onboarding", RedirectType.replace);
  }

  if (!approved.isApproved) {
    redirect("/onboarding", RedirectType.replace);
  }

  return <UserAuthedLayout session={session}>{children}</UserAuthedLayout>;
};

export default layout;
