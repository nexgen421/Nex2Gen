"use client";

import { LucideCalculator } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectGroup,
} from "~/components/ui/select";

interface TRateCalculation {
  paymentMode: "cod" | "prepaid";
  pickupAreaPincode: number;
  destinationAreaPincode: number;
  weight: number;
  length: number; // these all will be in cm
  breadth: number; // ----
  height: number; // ------
  declaredValue: number;
}

const RateCalculatorForm = () => {
  const handleRateCalculation = (data: TRateCalculation) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<TRateCalculation>();

  return (
    <form
      onSubmit={handleSubmit(handleRateCalculation)}
      className="mt-10 flex max-w-xl flex-col flex-wrap gap-6 px-2 py-4 md:flex-row"
    >
      <div className="flex flex-col gap-2">
        <Label>Payment Mode</Label>
        <Select {...register("paymentMode")}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Payment Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Services</SelectLabel>
              <SelectItem value="cod">Cash On Delivery</SelectItem>
              <SelectItem value="Prepaid">Pre-Paid</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="pickupPincode">Source Pincode</Label>
        <Input id="pickupPincode" {...register("pickupAreaPincode")} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="destPincode">Destination Pincode</Label>
        <Input id="destPincode" {...register("destinationAreaPincode")} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="weight">Weight</Label>
        <div className="flex w-full md:max-w-xs">
          <Input
            id="weight"
            {...register("weight")}
            className="rounded-r-none"
          />
          <span className="flex min-h-full w-1/6 items-center justify-center rounded-r-md bg-blue-500 text-center leading-snug">
            <p className="text-xs font-medium text-white">Kg</p>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="dimensions">Dimensions</Label>
        <div className="flex w-full items-center gap-4 md:max-w-sm">
          <p className="text-sm font-medium text-blue-600">CM</p>
          <Input {...register("length")} placeholder="Length" />
          <Input {...register("breadth")} placeholder="Breadth" />
          <Input {...register("height")} placeholder="Height" />
        </div>
      </div>
      <div className="flex flex-grow flex-col gap-2">
        <Label htmlFor="declaredValue">Declared Value In INR</Label>
        <div className="flex">
          <span className="flex w-1/6 items-center justify-center rounded-l-md bg-blue-500 text-white">
            <p className="text-sm font-medium">₹</p>
          </span>
          <Input {...register("declaredValue")} className="rounded-l-none" />
        </div>
      </div>
      <div className="pt-5">
        <Button type="submit" className="w-full gap-2" size={"lg"}>
          <LucideCalculator /> Calculate
        </Button>
      </div>
    </form>
  );
};

export default RateCalculatorForm;
