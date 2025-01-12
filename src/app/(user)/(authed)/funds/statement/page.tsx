"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { usePathname, useSearchParams } from "next/navigation";
import PagePagination from "~/components/layout/PagePagination";
import { api } from "~/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import moment from "moment";
import { Badge } from "~/components/ui/badge";

const StatementPage = () => {
  const params = useSearchParams();
  const cursor = +(params.get("page") ?? "0");
  const { data, isLoading } = api.wallet.getWalletStatement.useQuery({
    cursor: cursor,
  });
  const pathname = usePathname();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funds Statements</CardTitle>
        <CardDescription>Get your statements of Debit & Credit</CardDescription>

        <CardContent>
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Number</TableHead>
                <TableHead>Transaction Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.map((statement) => (
                <TableRow key={statement.id}>
                  <TableCell>{statement.id}</TableCell>
                  <TableCell>
                    {moment(statement.createdAt).format("Do MMMM YYYY")}
                  </TableCell>
                  <TableCell>₹{statement.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        statement.status === "SUCCESS"
                          ? "default"
                          : "destructive"
                      }
                      className="rounded-full"
                    >
                      {statement.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
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
      </CardHeader>
    </Card>
  );
};

export default StatementPage;
