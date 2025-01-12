"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import React from "react";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import { usePathname, useSearchParams } from "next/navigation";
import Loading from "~/app/loading";
import PagePagination from "~/components/layout/PagePagination";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export const UserOrderDashboardTable = () => {
  const params = useSearchParams();
  const { isLoading, data: orderData } =
    api.order.getUserWithOrderRequestCounts.useQuery({
      cursor: +(params.get("page") ?? 0),
    });
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading) return <Loading />;

  return (
    <Table className="border text-xs">
      <TableHeader>
        <TableRow className="bg-slate-50">
          <TableHead className="font-semibold">User Details</TableHead>
          <TableHead className="font-semibold">User Email</TableHead>
          <TableHead className="text-center font-semibold">
            Orders Booked
          </TableHead>
          {/* <TableHead className="text-center font-semibold">
            Orders Processing
          </TableHead> */}
          <TableHead className="font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderData?.userData?.map((user:any) => (
          <TableRow key={user.id} className="hover:bg-slate-50">
            <TableCell className="font-medium">
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-500">{user.companyName}</div>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-center">
              <Badge className="rounded-full px-4" variant="outline">
                {user.bookedOrdersCount}
              </Badge>
            </TableCell>
            {/* <TableCell className="text-center">
              <Badge className="rounded-full px-4" variant="default">
                {user.processingOrdersCount}
              </Badge>
            </TableCell> */}
            <TableCell>
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-slate-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/admin/order/requests/order-request/${user.id}`);
                }}
              >
                View All Orders
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="bg-white">
            <PagePagination
              pageUrl={pathname}
              totalItems={orderData?.userCount ?? 0}
              itemsPerPage={10}
            />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default UserOrderDashboardTable;
