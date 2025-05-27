"use client";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  ClipboardCheckIcon,
  IndianRupeeIcon,
  ShipWheelIcon,
} from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import CustomCard from "~/components/ui/custom-card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";
import Loading from "~/app/loading";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { data, isLoading } =
    api.adminDashboard.getAdminDashboardDetails.useQuery();
  console.log(data);

  if (isLoading) return <Loading />;

  return (
    <div className="grid max-h-[80vh] grid-rows-4 gap-5 p-2">
      <div className="row-span-1 grid grid-cols-3 gap-5">
        <CustomCard className="col-span-1 flex items-center gap-4 bg-blue-50 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
            <ClipboardCheckIcon className="h-12 w-12 stroke-blue-600" />
          </div>
          <div className="flex h-full flex-col items-start justify-center gap-2">
            <h4 className="text-xl font-medium">
              Today&apos;s Orders: {data?.todayOrderCount}
            </h4>
            <p className="text-sm text-muted-foreground">
              Yesterday&apos;s Orders: {data?.yesterdayOrderCount}
            </p>
          </div>
        </CustomCard>
        <CustomCard className="col-span-2 flex flex-col gap-4 bg-blue-50 p-3">
          <h3 className="text-lg font-medium">Shipment Details</h3>
          <div className=" flex items-center justify-evenly gap-4">
            <div className="flex flex-col items-center gap-2">
              <CustomCard className="flex h-12 w-12 items-center justify-center bg-white">
                <p>{data?.shipmentCount.totalShipments}</p>
              </CustomCard>
              <h6 className="text-xs">Total Shipments</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CustomCard className="flex h-12 w-12 items-center justify-center bg-white">
                <p>{data?.shipmentCount.infoReceived}</p>
              </CustomCard>
              <h6 className="text-xs">Info Received</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CustomCard className="flex h-12 w-12 items-center justify-center bg-white">
                <p>{data?.shipmentCount.pending}</p>
              </CustomCard>
              <h6 className="text-xs">Courier Assign Pending</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CustomCard className="flex h-12 w-12 items-center justify-center bg-white">
                <p>{data?.shipmentCount.pickupPending}</p>
              </CustomCard>
              <h6 className="text-xs">Pickup Pending</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CustomCard className="flex h-12 w-12 items-center justify-center bg-white">
                <p>{data?.shipmentCount.inTransit}</p>
              </CustomCard>
              <h6 className="text-xs">In-Transit</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CustomCard className="flex h-12 w-12 items-center justify-center bg-white">
                <p>{data?.shipmentCount.delivered}</p>
              </CustomCard>
              <h6 className="text-xs">Delivered</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CustomCard className="flex h-12 w-12 items-center justify-center bg-white">
                <p>{data?.shipmentCount.undelivered}</p>
              </CustomCard>
              <h6 className="text-xs">Undelivered</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CustomCard className="flex h-12 w-12 items-center justify-center bg-white">
                <p>{data?.shipmentCount.exception}</p>
              </CustomCard>
              <h6 className="text-xs">Exception</h6>
            </div>
          </div>
        </CustomCard>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <CustomCard className="col-span-1 flex items-center gap-4 bg-green-50 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
            <IndianRupeeIcon className="h-12 w-12 stroke-blue-600" />
          </div>
          <div className="flex h-full flex-col items-start justify-center gap-2">
            <h4 className="text-xl font-medium">
              Today&apos;s Revenue: ₹{data?.todayTotalMoney}
            </h4>
            <p className="text-sm text-muted-foreground">
              Yesterday&apos;s Revenue: ₹{data?.yesterdayTotalMoney}
            </p>
          </div>
        </CustomCard>
        <CustomCard className="col-span-1 flex items-center gap-4 bg-purple-50 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
            <ShipWheelIcon className="h-12 w-12 stroke-blue-600" />
          </div>
          <div className="flex h-full flex-col items-start justify-center gap-2">
            <h4 className="text-xl font-medium">Average Shipping: ₹</h4>
          </div>
        </CustomCard>
      </div>
      <div className="row-span-2 w-full">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Identifier</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.pendingOrders.map((pendingOrder) => (
                    <TableRow
                      key={pendingOrder.id}
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/admin/order/approve/${pendingOrder.id}`);
                      }}
                    >
                      <TableCell>{pendingOrder.id}</TableCell>
                      <TableCell>
                        {
                          pendingOrder.user.kycDetails?.companyInfo
                            ?.companyName as string | null
                        }
                      </TableCell>
                      <TableCell>
                        {moment(pendingOrder.orderDate).format("Do MMMM YYYY")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      <Button
                        variant={"outline"}
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/admin/order/requests`);
                        }}
                      >
                        Load More
                      </Button>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
