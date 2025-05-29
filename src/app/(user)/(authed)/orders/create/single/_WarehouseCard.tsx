"use client";

import React from "react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Loader2 } from "lucide-react";
import { type PickupLocation } from "@prisma/client";
import { cn } from "~/lib/utils";

interface ExtendedPickupLocation extends PickupLocation {
  name: string;
  pincode: number;
  address: string;
  famousLandmark: string;
  state: string;
  city: string;
  contactName: string;
  mobileNumber: string;
}

type SingleWarehouseCardProps = {
  warehouseDetails: ExtendedPickupLocation;
  onClickFunction: () => void;
  isActive: boolean;
};

const SingleWarehouseCard: React.FC<SingleWarehouseCardProps> = ({
  warehouseDetails,
  onClickFunction,
  isActive,
}) => {
  // const {
  //   pincode,
  //   address,
  //   famousLandmark,
  //   state,
  //   city,
  //   contactName,
  //   mobileNumber,
  //   name,
  // } = warehouseDetails;

  return (
    <div
      onClick={onClickFunction}
      className={cn(
        "mx-auto max-w-md cursor-pointer rounded-lg p-6 shadow-md",
        isActive ? "bg-muted" : "bg-white",
      )}
    >
      <p className="mb-2 text-gray-800">
        <strong>{warehouseDetails?.name}</strong>
        <br />
        {warehouseDetails?.address},{" "}
        {"near " + warehouseDetails?.famousLandmark}, {warehouseDetails?.city},{" "}
        {warehouseDetails?.state} - {warehouseDetails?.pincode}
        <br />
        <span>
          <strong>Contact:</strong> {warehouseDetails?.contactName} (
          {warehouseDetails?.mobileNumber})
        </span>
      </p>
    </div>
  );
};

type WarehouseCardProps = {
  selectedWarehouseId: string | null;
  setSelectedWarehouseId: React.Dispatch<React.SetStateAction<string | null>>;
};

const WarehouseCard: React.FC<WarehouseCardProps> = ({
  selectedWarehouseId,
  setSelectedWarehouseId,
}) => {
  const { data, isLoading } = api.order.getAllPickupLocation.useQuery();
  return (
    <Card className="min-h-[30vh] w-full">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Warehouses</CardTitle>
            <CardDescription>
              Select the warehouse you want to pickup your order from
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {isLoading ? (
        <div className="flex w-full items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          <SingleWarehouseCard
            warehouseDetails={data}
            onClickFunction={() =>
              setSelectedWarehouseId(data?.id as string | null)
            }
            isActive={selectedWarehouseId === data?.id}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default WarehouseCard;
