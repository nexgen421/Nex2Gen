"use client";

import React from "react";
import PagePagination from "~/components/layout/PagePagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
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
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import moment from "moment";

const PaymentsHistoryPage = () => {
  const pathname = usePathname();
  ``;
  const params = useSearchParams();
  const { data, isLoading } = api.wallet.getApprovedWalletRequests.useQuery({
    cursor: +(params.get("page") ?? 0),
  });

  if (isLoading) {
    return <Loader2 className="animate-spin duration-500" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
        <CardDescription>
          Approve all the payments added into the application
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>UPI Reference Number</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((payment:any) => {
              return (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.wallet.user.name} (
                    {payment.wallet.user.kycDetails?.companyInfo?.companyName})
                  </TableCell>
                  <TableCell>{payment.referenceNumber}</TableCell>
                  <TableCell>₹{payment.amount}</TableCell>
                  <TableCell>
                    {moment(payment.createdAt).format(
                      "Do/MMMM/YYYY hh:mm:ss A",
                    )}
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

export default PaymentsHistoryPage;
