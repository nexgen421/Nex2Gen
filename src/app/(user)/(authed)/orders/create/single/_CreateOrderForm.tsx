"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { productCategories } from "~/lib/constants";
import WarehouseCard from "./_WarehouseCard";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import RatePopover from "~/components/RatePopover";
import { getCityState } from "~/lib/pincode";
import { TRPCClientError } from "@trpc/client";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { IndianRupeeIcon } from "lucide-react";
import Loading from "~/app/loading";

interface TOrder {
  customerName: string;
  mobile: string;
  email: string;
  houseNumber: string;
  streetName: string;
  famousLandmark: string;
  orderId: string;
  productName: string;
  orderValue: number;
  physicalWeight: number;
  height: number;
  length: number;
  breadth: number;
}

const CreateOrderForm = () => {
  const router = useRouter();
  const { data, isLoading } = api.rate.getRateById.useQuery();
  const { mutateAsync, isPending } = api.order.createOrder.useMutation();
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm<TOrder>();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null,
  );
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [insured, setInsured] = useState<boolean>(false);
  const [productCategory, setProductCategory] = useState("");
  const getPincodeDetails = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const data = await getCityState(+pincode);
      console.log(data);
      setCity(data?.city ?? "");
      setState(data?.state ?? "");
    } catch (error) {
      // toast.error(JSON.stringify(error));
    }
  };

  const resetAllFields = () => {
    // Reset form fields managed by react-hook-form
    reset({
      breadth: 0,
      height: 0,
      length: 0,
      mobile: "",
      houseNumber: "",
      streetName: "",
      productName: "",
      email: "",
      customerName: "",
      famousLandmark: "",
      orderValue: 0,
      physicalWeight: 0,
    });

    // Reset all state variables
    setSelectedWarehouseId(null);
    setPincode("");
    setCity("");
    setState("");
    setInsured(false);
    setProductCategory("");
    router.refresh();
  };

  const handleOrderCreate = async (data: TOrder) => {
    console.log(data);
    console.log({ insured });
    console.log({ productCategory });
    console.log({ selectedWarehouseId });

    if (selectedWarehouseId === null) {
      toast.error("Select a Warehouse!");
      return;
    }

    if (productCategory === "") {
      toast.error("Select a Product Category!");
      return;
    }

    if (city === "" || state === "") {
      toast.error("Enter a valid Pincode and hit Get Details!");
      return;
    }

    try {
      await mutateAsync({
        breadth: +data.breadth,
        height: +data.height,
        length: +data.length,
        city: city,
        state: state,
        isInsured: insured,
        customerMobile: data.mobile,
        houseNumber: data.houseNumber,
        streetName: data.streetName,
        productName: data.productName,
        customerEmail: data.email?data.email:"dummy@gmail.com",
        customerName: data.customerName,
        famousLandmark: data.famousLandmark,
        pincode: +pincode,
        orderValue: +data.orderValue,
        physicalWeight: +data.physicalWeight,
        pickupLocationId: selectedWarehouseId,
        productCategory: productCategory,
        orderCategory: productCategory,
      });
      toast.success("Order Created Successfully");
      resetAllFields();
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error("Something went wrong!");
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <Alert variant={"destructive"}>
        <IndianRupeeIcon className="h-6 w-6" />
        <AlertTitle className="text-normal">Rate Issue</AlertTitle>
        <AlertDescription>
          Please Contact Admin To Fix Your Rates
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleOrderCreate)}
      className="flex w-full flex-col items-start gap-2"
    >
      <h3 className="font-semibold">Consignee Details</h3>
      <div className="flex flex-wrap items-center gap-10 py-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="customerName">Customer Full Name</Label>
          <Input id="customerName" {...register("customerName")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="Mobile No.">Mobile Number</Label>
          <Input id="Mobile No."  maxLength={10}  type="string" {...register("mobile")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register("email")} />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <h3 className="font-semibold">Complete Address</h3>
      <div className="flex flex-wrap items-center gap-10 py-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="houseNumber">House Number</Label>
          <Input id="houseNumber" {...register("houseNumber")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="streetName">Street Name</Label>
          <Input id="streetName" {...register("streetName")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="pincode">Pincode</Label>
          <div className="flex items-center gap-2">
            <Input id="pincode" onChange={(e) => setPincode(e.target.value)} />
            <Button onClick={getPincodeDetails}>Get Details</Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" disabled value={state} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" disabled value={city} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="famousLandmark">Famous Landmark</Label>
          <Input id="famousLandmark" {...register("famousLandmark")} />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <h3 className="font-semibold">Order Details</h3>
      <div className="flex flex-wrap items-center gap-10 py-5">
        {/* <div className="flex flex-col gap-2">
          <Label htmlFor="state">Payment Mode</Label>
          <Input id="state" {...register("state")} />
        </div> */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input id="productName" {...register("productName")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="famousLandmark">Category</Label>
          <Select
            onValueChange={(value) => setProductCategory(value)}
            value={productCategory}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select A Category" />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map((pc, index) => (
                <SelectItem key={index} value={pc}>
                  {pc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="orderValue">Order Value</Label>
          <Input id="orderValue" {...register("orderValue")} />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="flex flex-wrap items-center gap-10 py-5">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="physicalWeight"
            className="flex items-center justify-between"
          >
            <span>Physical Weight (in KG)</span>
            <RatePopover />
          </Label>
          <Input id="physicalWeight" {...register("physicalWeight")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="length">Length (in CM)</Label>
          <Input id="length" {...register("length")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="breadth">Breadth (in CM)</Label>
          <Input id="breadth" {...register("breadth")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="height">Height (in CM)</Label>
          <Input id="height" {...register("height")} />
        </div>
      </div>

      <h3 className="font-semibold">Select Pickup Location</h3>

      <WarehouseCard
        selectedWarehouseId={selectedWarehouseId}
        setSelectedWarehouseId={setSelectedWarehouseId}
      />
      <div className="my-2 flex items-center space-x-2 self-end">
        <Label htmlFor="insurance">
          Would You Like Insurance?{" "}
          <Link href="#" className="text-blue-600 hover:text-blue-800">
            Learn More.
          </Link>
        </Label>
        <Switch
          id="insurance"
          checked={insured}
          onCheckedChange={(checked) => setInsured(checked)}
        />
      </div>
      <Button
        className="mt-2 self-end"
        type="submit"
        size="lg"
        disabled={isPending}
      >
        Place Order
      </Button>
    </form>
  );
};

export default CreateOrderForm;
