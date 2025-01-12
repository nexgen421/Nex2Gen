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
import { api } from "~/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, MoreHorizontal } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import moment from "moment";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const PaymentsPage = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const { data, isLoading } = api.wallet.getAllWalletRequests.useQuery({
    cursor: +(params.get("page") ?? 0),
  });
  const router = useRouter();

  const { mutateAsync: approveRequest } =
    api.wallet.approveWalletRequest.useMutation();

  const { mutateAsync: deleteRequest } =
    api.wallet.deleteWalletRequest.useMutation();

  const approveRequestHandler = async (id: string) => {
    await approveRequest({ walletRequestId: id });
    toast.success("Payment request approved successfully!");
    router.refresh();
  };

  const deleteRequestHandler = async (id: string) => {
    await deleteRequest({ walletRequestId: id });
  };

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
              <TableHead>User Details</TableHead>
              <TableHead>UPI Reference Number</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((payment) => {
              return (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.wallet.user.name} (
                    {payment.wallet.user.kycDetails?.companyInfo?.companyName ??
                      "N/A"}
                    )
                  </TableCell>
                  <TableCell>{payment.referenceNumber}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>
                    {moment(payment.createdAt).format("Do MMMM YYYY")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon",
                        })}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => approveRequestHandler(payment.id)}
                        >
                          Approve Request
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteRequestHandler(payment.id)}
                        >
                          Delete Request
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default PaymentsPage;
