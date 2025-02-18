"use client";

import React from "react";
import { buttonVariants } from "~/components/ui/button";
import Clock from "./_Clock";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import numeral from "numeral";
import { ShipmentStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Loading from "~/app/loading";

const Status: { text: string; key: string }[] = [
  { text: "Info Received", key: ShipmentStatus.INFORECEIVED },
  { text: "Pickup Scheduled", key: ShipmentStatus.PICKUP },
  { text: "Pickup Pending", key: ShipmentStatus.PENDING },
  { text: "In Transit", key: ShipmentStatus.TRANSIT },
  { text: "Delivered", key: ShipmentStatus.DELIVERED },
  { text: "Undelivered", key: ShipmentStatus.UNDELIVERED },
  { text: "Exception", key: ShipmentStatus.EXCEPTION },
];

const StatusObject = ({
  text,
  statusKey,
  count,
}: {
  text: string;
  statusKey: string;
  count: number;
}) => {
  return (
    <Link
      href={`/orders?status=${statusKey}`}
      className="flex flex-col items-center gap-2"
    >
      <div className="flex aspect-square items-center justify-center rounded-lg bg-blue-200 p-3">
        <p className="">{count}</p>
      </div>
      <p className="text-center text-xs">{text}</p>
    </Link>
  );
};

const page = () => {
  // debugger
  api.user.paymentWebhook.useQuery();
  const { data, isLoading } = api.user.getDashboardData.useQuery();
  console.log('obj');
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="col-span-1 h-full md:col-span-1">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back</p>
            <div className="flex items-center justify-between">
              <Clock />

              <Link
                href="/orders/create/single"
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className: "mt-5",
                })}
              >
                Start Creating Orders
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-1 h-full md:col-span-1">
          <div className="h-full rounded-lg bg-white p-8 shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">Wallet Details</h1>
            <div className="flex h-full justify-between">
              <div className="flex h-full w-full flex-col gap-8">
                <p className="text-muted-foreground">Current Balance</p>
                <div className="flex w-full items-center justify-between">
                  <p className="text-3xl font-semibold">
                    ₹{numeral(data?.wallet ?? 0).format("0.00")}
                  </p>
                  <Link
                    className={cn(
                      buttonVariants({
                        variant: "default",
                        size: "sm",
                      }),
                    )}
                    href="/funds/add"
                  >
                    Recharge Wallet
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Shipment Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-evenly gap-2">
            <StatusObject
              statusKey={"BOOKED"}
              count={data?.bookedCount ?? 0}
              text="Booked"
            />
            {Status.map((status) => (
              <StatusObject
                key={status.key}
                statusKey={status.key}
                count={
                  data?.shipmentCount[
                    status.key as keyof (typeof data)["shipmentCount"]
                  ] ?? 0
                }
                text={status.text}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default page;
