"use client";

import React from "react";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";

import { Input } from "~/components/ui/input";
import { signOut } from "next-auth/react";
import AuthedNavbar from "~/components/layout/Navbar/AuthedNavbar";
import { type Session } from "next-auth";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import UniversalBreadcrumb from "~/components/layout/Navbar/UniversalBreadcrumb";
import { useRouter } from "next/navigation";

const UserAuthedLayout = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) => {
  const router = useRouter();
  return (
    <AuthedNavbar session={session}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <UniversalBreadcrumb />
            <div className="relative ml-auto h-full flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
            <DropdownMenu modal={true}>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={session.user.image as string | undefined}
                    alt="pp"
                  />
                  <AvatarFallback>
                    {session.user.name
                      ?.split(" ")
                      .map((word) => word.at(0))
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/terms-and-conditions");
                  }}
                >
                  Terms & Conditions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/refund-policy");
                  }}
                >
                  Refund Policy
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/privacy-policy");
                  }}
                >
                  Privacy Policy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="w-full p-4">{children}</main>
        </div>
      </div>
    </AuthedNavbar>
  );
};

export default UserAuthedLayout;
