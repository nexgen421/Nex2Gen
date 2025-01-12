"use client";

import { adminLogOut } from "~/lib/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouter } from "next/navigation";

const DropdownUser = () => {
  const { data, isLoading } = api.adminAuth.fetchSession.useQuery();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={data?.image ?? undefined} alt="pp" />
          <AvatarFallback>
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-full" />
            ) : (
              data?.name
                .split(" ")
                .map((word) => word.at(0))
                .join("")
                .toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/terms-and-conditions");
          }}
        >
          Terms & Conditions
        </DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem
          onClick={() => {
            adminLogOut();
            router.push("/admin/login");
          }}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownUser;
