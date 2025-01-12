"use client";

import React from "react";
import PagePagination from "~/components/layout/PagePagination";
import {
  Card,
  CardHeader,
  CardFooter,
  CardDescription,
  CardContent,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import TicketPreviewCard from "./_TicketPreviewCard";
import { api } from "~/trpc/react";
import { usePathname, useSearchParams } from "next/navigation";
import { type Session } from "next-auth";
import { Badge } from "~/components/ui/badge";
import ActionsDropdown from "./_ActionsDropdown";
import Loading from "~/app/loading";
import TicketChatCard from "./_TicketChatCard";

const SupportTable = ({
  session,
  type,
}: {
  session: Session | null;
  type: "OPEN" | "CLOSED" | "RESOLVED";
}) => {
  const params = useSearchParams();
  const { data, isLoading } = api.support.fetchAllTickets.useQuery({
    cursor: +(params.get("page") ?? 0),
    type: type,
  });
  const pathname = usePathname();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
        <CardDescription>View all your support tickets</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket Number</TableHead>
              <TableHead>Raised By</TableHead>
              <TableHead>Intervened By</TableHead>
              <TableHead>Ticket Status</TableHead>
              <TableHead>View</TableHead>
              <TableHead>Chat</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((ticket) => {
              return (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium"># {ticket.id}</TableCell>
                  <TableCell>
                    {ticket.user.kycDetails?.companyInfo?.companyName}
                  </TableCell>
                  <TableCell>{ticket.intervener?.name ?? "NONE"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ticket.ticketStatus === "OPEN" ? "default" : "outline"
                      }
                    >
                      {ticket.ticketStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TicketPreviewCard ticketId={ticket.id} />
                  </TableCell>
                  <TableCell>
                    <TicketChatCard ticketId={ticket.id} />
                  </TableCell>
                  <TableCell>
                    <ActionsDropdown
                      session={session}
                      ticketStatus={ticket.ticketStatus}
                      ticketId={ticket.id}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <PagePagination
          pageUrl={pathname}
          totalItems={data?.length ?? 0}
          itemsPerPage={10}
        />
      </CardFooter>
    </Card>
  );
};

export default SupportTable;
