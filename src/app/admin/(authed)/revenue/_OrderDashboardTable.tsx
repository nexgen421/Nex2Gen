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
import Link from "next/link";
import { api } from "~/trpc/react";
import { usePathname, useSearchParams } from "next/navigation";
import Loading from "~/app/loading";
import PagePagination from "~/components/layout/PagePagination";
import { Card, CardContent, CardTitle, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { RefreshCw, Filter } from "lucide-react";


// Define the structure for shipment
interface Shipment {
  awbNumber?: string | null;
  courierProvider?: string | null;
}

// Define the structure for orderPricing
interface OrderPricing {
  price: number;
}

// Define the structure for the order
interface Order {
  id: string;
  orderId: string;
  status: string;
  shipment?: Shipment;
  orderPricing?: OrderPricing;
}

interface OrderData {
  orders: Order[];
}


const OrderDashboardTable = () => {
  const params = useSearchParams();
  const { isLoading, data: orderData } = api.order.getApprovedOrders.useQuery({
    cursor: +(params.get("page") ?? 0),
  });
  const pathname = usePathname();

  if (isLoading) return <Loading />;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Orders Dashboard</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">AWB Number</TableHead>
                <TableHead className="font-semibold">Order Amount</TableHead>
                <TableHead className="font-semibold">
                  Shipment Provider
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData?.orders?.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>
                    <Badge
                      className="rounded-full px-4"
                      variant={order.status === "BOOKED" ? "secondary" : "default"}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.shipment?.awbNumber ? (
                      <Link
                        href={`/track/${order.shipment.awbNumber}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {order.shipment.awbNumber}
                      </Link>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">₹{order.orderPricing?.price}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">{order.shipment?.courierProvider}</span>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="bg-white">
                  <PagePagination
                    pageUrl={pathname}
                    totalItems={orderData?.orderCount ?? 0}
                    itemsPerPage={10}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDashboardTable;
