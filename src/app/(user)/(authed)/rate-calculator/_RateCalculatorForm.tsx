"use client";

import { LucideCalculator } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
//   SelectItem,
//   SelectGroup,
// } from "~/components/ui/select";
import { toast } from "sonner";
import { TRPCClientError } from "@trpc/client";
import { api } from "~/trpc/react";

interface TRateCalculation {
  paymentMode: "cod" | "prepaid";
  pickupAreaPincode: number;
  destinationAreaPincode: number;
  weight: number;
  length: number;
  breadth: number;
  height: number;
  declaredValue: number;
}

const RateCalculatorForm = () => {
  const { mutateAsync: estimateRateMutation, isPending } =
    api.order.estimateRate.useMutation();

  const { register, handleSubmit } = useForm<TRateCalculation>();

  const [estimatedCost, setEstimatedCost] = React.useState<number | null>(null);

  const handleRateCalculation = async (data: TRateCalculation) => {
    try {
      const payload = {
        fromPincode: String(data.pickupAreaPincode),
        toPincode: String(data.destinationAreaPincode),
        physicalWeight: parseFloat(String(data.weight)),
        shipmentLength: 1,
        shipmentBreadth: 1,
        shipmentHeight: 1,
        shipmentWeight: parseFloat(String(data.weight)),
      };

      const response = await estimateRateMutation(payload);
      setEstimatedCost(response.estimatedCost);

      toast.success("Rate estimated successfully!");
    } catch (error) {
      setEstimatedCost(null);
      if (error instanceof TRPCClientError) {
        toast.error(`Rate estimation failed: ${error.message}`);
      } else {
        toast.error("Something went wrong during rate estimation.");
      }
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <form
        onSubmit={handleSubmit(handleRateCalculation)}
        className="mt-10 flex max-w-4xl flex-col flex-wrap gap-6 px-2 py-4 md:flex-row"
      >
        {/* <div className="flex flex-col gap-2">
          <Label>Payment Mode</Label>
          <Select
            onValueChange={(val) => {
              reset((prev) => ({
                ...prev,
                paymentMode: val as "cod" | "prepaid",
              }));
            }}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select Payment Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Services</SelectLabel>
                <SelectItem value="cod">Cash On Delivery</SelectItem>
                <SelectItem value="prepaid">Pre-Paid</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}

        <div className="flex flex-col gap-2">
          <Label htmlFor="pickupPincode">Source Pincode</Label>
          <Input
            id="pickupPincode"
            type="number"
            {...register("pickupAreaPincode")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="destPincode">Destination Pincode</Label>
          <Input
            id="destPincode"
            type="number"
            {...register("destinationAreaPincode")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="weight">Weight</Label>
          <div className="flex w-full md:max-w-xs">
            <Input
              id="weight"
              type="number"
              step="0.01"
              {...register("weight")}
              className="rounded-r-none"
            />
            <span className="flex min-h-full w-1/6 items-center justify-center rounded-r-md bg-blue-500 text-xs font-medium text-white">
              Kg
            </span>
          </div>
        </div>

        {/* <div className="flex flex-col gap-2">
          <Label htmlFor="dimensions">Dimensions (CM)</Label>
          <div className="flex w-full items-center gap-4 md:max-w-sm">
            <Input type="number" {...register("length")} placeholder="Length" />
            <Input
              type="number"
              {...register("breadth")}
              placeholder="Breadth"
            />
            <Input type="number" {...register("height")} placeholder="Height" />
          </div>
        </div> */}

        <div className="flex flex-grow flex-col gap-2">
          <Label htmlFor="declaredValue">Declared Value In INR</Label>
          <div className="flex">
            <span className="flex w-1/6 items-center justify-center rounded-l-md bg-blue-500 text-white">
              ₹
            </span>
            <Input
              type="number"
              {...register("declaredValue")}
              className="rounded-l-none"
            />
          </div>
        </div>

        <div className="pt-5">
          <Button
            type="submit"
            className="w-full gap-2"
            size={"lg"}
            disabled={isPending}
          >
            <LucideCalculator /> {isPending ? "Calculating..." : "Calculate"}
          </Button>
        </div>
      </form>

      {/* Show the estimated cost if available */}
      {estimatedCost !== null && (
        <div className="mt-6 rounded-md border bg-green-50 p-4 text-green-800 shadow-sm">
          <p className="text-lg font-semibold">
            Shipping Cost: ₹{estimatedCost}
          </p>
        </div>
      )}
    </div>
  );
};

export default RateCalculatorForm;
