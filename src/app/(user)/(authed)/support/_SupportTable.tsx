"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";
import moment from "moment";
import { Badge } from "~/components/ui/badge";
import { type TicketStatus } from "@prisma/client";
import SupportTableSkeleton from "./_SupportTableSkeleton";
import SupportConversationSheet from "./_SupportConversationSheet";
import { type Session } from "next-auth";

const SupportTable = ({
  variant,
  session,
}: {
  variant: TicketStatus;
  session: Session | null;
}) => {
  const { data, isLoading } = api.support.fetchAllUserTickets.useQuery({
    variant: variant,
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Issue Id</TableHead>
          <TableHead>Issue Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Ticket Created</TableHead>
          <TableHead>Last Update</TableHead>
          <TableHead>Chat</TableHead>
        </TableRow>
      </TableHeader>
      {isLoading && <SupportTableSkeleton />}
      {!isLoading && (
        <TableBody>
          {data?.map((ticket) => {
            return (
              <TableRow key={ticket.id}>
                <TableCell>#{ticket.id}</TableCell>
                <TableCell className="max-w-md truncate">
                  {ticket.reason.supportReason.title}
                </TableCell>
                <TableCell>{ticket.reason?.reason}</TableCell>
                <TableCell>
                  {moment(ticket.timestamp).format("Do MMMM YYYY")}
                </TableCell>
                <TableCell>
                  <Badge>{ticket.ticketStatus}</Badge>
                </TableCell>
                <TableCell>
                  <SupportConversationSheet
                    session={session}
                    supportTicketId={ticket.id}
                    issueTitle={ticket.reason.supportReason.title}
                    conversationId={ticket.conversation?.id}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      )}
    </Table>
  );
};

export default SupportTable;
