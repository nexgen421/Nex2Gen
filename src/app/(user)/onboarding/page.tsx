import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { redirect, RedirectType } from "next/navigation";
import { api } from "~/trpc/server";
import OnboardingForm from "./OnboardingForm";
import LogOutStrip from "./LogOutStrip";
import AlreadySubmitted from "./AlreadySubmitted";

const Onboarding = async () => {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/login", RedirectType.replace);
  }

  const { isApproved, isKycSubmitted } = await api.auth.isUserApproved({
    id: session?.user.id,
  });

  if (isApproved) {
    redirect("/dashboard", RedirectType.replace);
  }

  if (isKycSubmitted) {
    return <AlreadySubmitted />;
  }

  return (
    <>
      <LogOutStrip />
      <OnboardingForm session={session} />
    </>
  );
};

export default Onboarding;
