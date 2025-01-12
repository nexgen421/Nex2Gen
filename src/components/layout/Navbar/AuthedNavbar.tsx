"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "~/components/ui/sidebar";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import { User } from "lucide-react";
import { userSidebarMenu } from "~/lib/constants";
import { type Session } from "next-auth";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Nunito } from "next/font/google";
import { ScrollArea } from "~/components/ui/scroll-area";

const lora = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function SidebarDemo({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-x-hidden rounded-md border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 md:flex-row",
        "h-screen",
      )}
    >
      <Sidebar animate={false} open={false}>
        <SidebarBody className="justify-between">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {userSidebarMenu.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          <div>
            <SidebarLink
              link={{
                label: `${session.user.name}`,
                href: "/profile",
                icon: (
                  <Avatar>
                    <AvatarImage
                      src={session.user.image as string | undefined}
                      alt={session.user.name as string | undefined}
                    />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                ),
              }}
            />
          </div>

          <div className="w-full text-center text-sm font-semibold">
            &copy; Nex Gen Courier Service
          </div>
        </SidebarBody>
      </Sidebar>
      <ScrollArea className="w-full">{children}</ScrollArea>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image src={"/logo.png"} height={100} width={40} alt="logo" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${lora.className} whitespace-pre font-medium text-black dark:text-white`}
      >
        Nex Gen Courier Service
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image src={"/logo.png"} height={100} width={40} alt="logo" />
    </Link>
  );
};

export default SidebarDemo;
