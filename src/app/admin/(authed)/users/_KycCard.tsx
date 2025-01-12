"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Eye, Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import moment from "moment";

const KycCard = ({
  name,
  email,
  userId,
}: {
  userId: string;
  name: string;
  email: string;
}) => {
  const { data, isLoading } = api.user.fetchKycDetails.useQuery({ id: userId });

  if (isLoading) {
    return (
      <div className="absolute left-0 top-0 z-20 h-full w-full">
        <Loader2 className="animate-spin duration-200" />
      </div>
    );
  }

  console.log(data);

  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
      >
        <Eye className="text-accent-foreground" />
      </DialogTrigger>
      <DialogContent
        className="max-w-5xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>KYC Details</DialogTitle>
          <DialogDescription>View KYC Details for {name}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full">
          <div className="container flex flex-col gap-10">
            <div className="flex w-full items-center gap-10">
              <h3 className="w-[200px] text-lg font-semibold">
                Personal Details
              </h3>
              <ul>
                <li>
                  <strong>Name:</strong> {name}
                </li>
                <li>
                  <strong>Email:</strong> {email}
                </li>
              </ul>
            </div>

            <div className="flex w-full items-center gap-10">
              <h3 className="w-[200px] text-lg font-semibold">
                Company Details
              </h3>
              <ul>
                <li>
                  <strong>Company Name:</strong>{" "}
                  {data?.companyInfo?.companyName}
                </li>
                <li>
                  <strong>Company Email:</strong>{" "}
                  {data?.companyInfo?.companyEmail}
                </li>
                <li>
                  <strong>Company Type:</strong>{" "}
                  {data?.companyInfo?.companyType}
                </li>
              </ul>
            </div>

            <div className="flex w-full items-center gap-10">
              <h3 className="w-[200px] text-lg font-semibold">Aadhar Card</h3>
              <ul>
                <li>
                  <strong>Aadhar Number: </strong>{" "}
                  {data?.aadharInfo?.aadharNumber}
                </li>
                <li>
                  <strong>Aadhar Holder Name: </strong>{" "}
                  {data?.aadharInfo?.holderName}
                </li>
                <li>
                  <strong>Date Of Birth: </strong>{" "}
                  {moment(data?.aadharInfo?.dob).format("DD/MM/YYYY")}
                </li>
              </ul>
            </div>
            <div className="flex w-full items-center gap-10">
              <h3 className="w-[200px] text-lg font-semibold">Pan Card</h3>
              <ul>
                <li>
                  <strong>PAN Number: </strong>{" "}
                  <span className="uppercase">{data?.panInfo?.panNumber}</span>
                </li>
                <li>
                  <strong>PAN Holder Name: </strong> {data?.panInfo?.holderName}
                </li>
                <li>
                  <strong>Father&apos;s Name</strong>{" "}
                  {data?.panInfo?.fatherName}
                </li>
              </ul>
            </div>
            <div className="flex w-full items-center gap-10">
              <h3 className="w-[200px] text-lg font-semibold">
                Pickup Address
              </h3>
              <ul>
                <li>
                  <strong>Address: </strong>{" "}
                  <span className="">{data?.user.pickupLocation?.address}</span>
                </li>
                {data?.user.pickupLocation?.famousLandmark && (
                  <li>
                    <strong>Famous Landmark</strong>{" "}
                    <span className="">
                      {data?.user.pickupLocation?.famousLandmark}
                    </span>
                  </li>
                )}
                <li>
                  <strong>City</strong> {data?.user.pickupLocation?.city}
                </li>
                <li>
                  <strong>State</strong> {data?.user.pickupLocation?.state}
                </li>
                <li>
                  <strong>Pincode</strong> {data?.user.pickupLocation?.pincode}
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KycCard;
