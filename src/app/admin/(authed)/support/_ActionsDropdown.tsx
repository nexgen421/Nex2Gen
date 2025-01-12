"use client";

import { MoreHorizontal } from "lucide-react";
import { type Session } from "next-auth";
import React from "react";
import { buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const ActionsDropdown = ({
  session,
  ticketId,
  ticketStatus,
}: {
  session: Session | null;
  ticketStatus: "OPEN" | "CLOSED" | "RESOLVED";
  ticketId: number;
}) => {
  const router = useRouter();
  const { mutateAsync: intervene, isPending: isIntervenePending } =
    api.support.intervene.useMutation({
      onError(error) {
        toast.error(error.message);
      },
      onSuccess() {
        toast.success("Ticket status changed successfully");
        router.refresh();
      },
    });
  const { mutateAsync: changeTicketStatus, isPending: isTicketChangePending } =
    api.support.changeTicketStatus.useMutation({
      onError(error) {
        toast.error(error.message);
      },
      onSuccess() {
        toast.success("Ticket status changed successfully");
        router.refresh();
      },
    });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <MoreHorizontal className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Change Status
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={async (e) => {
                    e.preventDefault();
                    await changeTicketStatus({
                      status: "OPEN",
                      ticketId: ticketId,
                    });
                  }}
                  disabled={ticketStatus === "OPEN" || isTicketChangePending}
                >
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={
                    ticketStatus === "RESOLVED" || isTicketChangePending
                  }
                  onClick={async (e) => {
                    e.preventDefault();
                    await changeTicketStatus({
                      status: "RESOLVED",
                      ticketId: ticketId,
                    });
                  }}
                >
                  Resolve
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={ticketStatus === "CLOSED" || isTicketChangePending}
                  onClick={async (e) => {
                    e.preventDefault();
                    await changeTicketStatus({
                      status: "CLOSED",
                      ticketId: ticketId,
                    });
                  }}
                >
                  Close
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSubTrigger>
        </DropdownMenuSub>
        <DropdownMenuItem
          disabled={isIntervenePending}
          onClick={async (e) => {
            e.preventDefault();
            await intervene({ supportId: ticketId });
          }}
        >
          Intervene
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsDropdown;
