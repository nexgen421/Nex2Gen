"use client";

import React, { useState, useEffect } from "react"; // Import useEffect
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

// Assuming the structure of the single pickup location returned by the backend
interface SinglePickupLocation {
  id: string;
  pincode: string;
  name: string; // The company name returned by your backend
  address: string; // Add other properties your pickupLocation object might have
  city: string;
  state: string;
  // ... any other fields from your pickupLocation schema
}

const CreateOrderForm = () => {
  const router = useRouter();

  // Renamed 'warehouses' to 'pickupLocationData' to reflect it's a single object
  const { data: pickupLocationData, isLoading: isLoadingPickupLocation } =
    api.order.getAllPickupLocation.useQuery();

  const { mutateAsync: createOrder, isPending: isCreatingOrder } =
    api.order.createOrder.useMutation();

  const {
    mutateAsync: estimateRateMutation,
    isPending: isEstimatingRate,
    data: estimatedRateData,
    error: estimateRateError,
  } = api.order.estimateRate.useMutation();

  const { register, handleSubmit, reset, watch } = useForm<TOrder>();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null,
  );
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [insured, setInsured] = useState<boolean>(false);
  const [productCategory, setProductCategory] = useState("");

  const [physicalWeight, length, breadth, height] = watch([
    "physicalWeight",
    "length",
    "breadth",
    "height",
  ]);

  // Effect to automatically select the single pickup location when it loads
  useEffect(() => {
    if (pickupLocationData) {
      setSelectedWarehouseId(pickupLocationData.id);
    }
  }, [pickupLocationData]);

  const getPincodeDetails = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const data = await getCityState(+pincode);
      if (data?.city && data?.state) {
        setCity(data.city);
        setState(data.state);
        toast.success("Pincode details fetched successfully!");
      } else {
        setCity("");
        setState("");
        toast.error("Invalid pincode or no details found.");
      }
    } catch (error) {
      setCity("");
      setState("");
      toast.error(
        "Failed to get pincode details. Please enter a valid pincode.",
      );
    }
  };

  const handleEstimateRate = async () => {
    // We don't need to check selectedWarehouseId explicitly here if we assume it's always set
    // from the single fetched pickupLocationData, but we keep the check for safety.
    if (
      !pickupLocationData || // Check if the single pickup location data is available
      !selectedWarehouseId || // This should be set by the useEffect
      !pincode ||
      !city ||
      !state ||
      physicalWeight === undefined ||
      length === undefined ||
      breadth === undefined ||
      height === undefined ||
      isNaN(physicalWeight) ||
      isNaN(length) ||
      isNaN(breadth) ||
      isNaN(height) ||
      physicalWeight <= 0 ||
      length <= 0 ||
      breadth <= 0 ||
      height <= 0
    ) {
      toast.info(
        "Please fill in all shipment details, ensure pickup location and pincode details are fetched to estimate rate.",
      );
      return;
    }

    try {
      // Directly use the pincode from the fetched single pickup location data
      await estimateRateMutation({
        fromPincode: String(pickupLocationData.pincode), // Directly use the pincode
        toPincode: pincode,
        physicalWeight: physicalWeight,
        shipmentLength: length,
        shipmentBreadth: breadth,
        shipmentHeight: height,
        shipmentWeight: physicalWeight,
      });
      toast.success("Rate estimated successfully!");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(`Rate estimation failed: ${error.message}`);
      } else {
        toast.error("Something went wrong during rate estimation.");
      }
    }
  };

  const resetAllFields = () => {
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

    setSelectedWarehouseId(null);
    setPincode("");
    setCity("");
    setState("");
    setInsured(false);
    setProductCategory("");
    router.refresh();
  };

  const handleOrderCreate = async (formData: TOrder) => {
    // Ensure pickupLocationData is available
    if (
      !formData.customerName ||
      !formData.mobile ||
      !formData.houseNumber ||
      !formData.streetName ||
      !formData.famousLandmark ||
      !formData.productName ||
      formData.orderValue === undefined ||
      formData.physicalWeight === undefined ||
      formData.height === undefined ||
      formData.length === undefined ||
      formData.breadth === undefined ||
      !selectedWarehouseId || // Check that the ID has been set (from useEffect)
      !pickupLocationData || // Ensure the pickup location data itself is present
      productCategory === "" ||
      city === "" ||
      state === "" ||
      isNaN(formData.orderValue) ||
      isNaN(formData.physicalWeight) ||
      isNaN(formData.height) ||
      isNaN(formData.length) ||
      isNaN(formData.breadth)
    ) {
      toast.error(
        "Please fill in all required fields and ensure pickup location and pincode details are accurate.",
      );
      return;
    }

    try {
      await createOrder({
        breadth: +formData.breadth,
        height: +formData.height,
        length: +formData.length,
        city: city,
        state: state,
        isInsured: insured,
        customerMobile: formData.mobile,
        houseNumber: formData.houseNumber,
        streetName: formData.streetName,
        productName: formData.productName,
        customerEmail: formData.email ? formData.email : "dummy@gmail.com",
        customerName: formData.customerName,
        famousLandmark: formData.famousLandmark,
        pincode: +pincode,
        orderValue: +formData.orderValue,
        physicalWeight: +formData.physicalWeight,
        pickupLocationId: selectedWarehouseId, // This should be set by useEffect
        productCategory: productCategory,
        orderCategory: productCategory,
      });
      toast.success("Order Created Successfully");
      resetAllFields();
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  if (isLoadingPickupLocation) {
    return <Loading />;
  }

  // If pickupLocationData is null (meaning no pickup location found)
  if (!pickupLocationData) {
    return (
      <Alert variant={"destructive"}>
        <IndianRupeeIcon className="h-6 w-6" />
        <AlertTitle className="text-normal">Configuration Issue</AlertTitle>
        <AlertDescription>
          No default pickup location found for your account. Please contact
          admin to set up a pickup location.
        </AlertDescription>
      </Alert>
    );
  }

  // To maintain the WarehouseCard component's expectation of an array,
  // we can wrap the single pickup location object in an array.
  const warehousesArrayForCard = [pickupLocationData];

  return (
    <form
      onSubmit={handleSubmit(handleOrderCreate)}
      className="flex w-full flex-col items-start gap-2"
    >
      <h3 className="font-semibold">Consignee Details</h3>
      <div className="flex flex-wrap items-center gap-10 py-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="customerName">Customer Full Name</Label>
          <Input
            id="customerName"
            {...register("customerName", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="Mobile No.">Mobile Number</Label>
          <Input
            id="Mobile No."
            maxLength={10}
            type="string"
            {...register("mobile", { required: true })}
          />
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
          <Input
            id="houseNumber"
            {...register("houseNumber", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="streetName">Street Name</Label>
          <Input
            id="streetName"
            {...register("streetName", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="pincode">Pincode</Label>
          <div className="flex items-center gap-2">
            <Input
              id="pincode"
              onChange={(e) => setPincode(e.target.value)}
              value={pincode}
            />
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
          <Input
            id="famousLandmark"
            {...register("famousLandmark", { required: true })}
          />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <h3 className="font-semibold">Order Details</h3>
      <div className="flex flex-wrap items-center gap-10 py-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            {...register("productName", { required: true })}
          />
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
          <Input
            id="orderValue"
            type="number"
            {...register("orderValue", { required: true, valueAsNumber: true })}
          />
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
          <Input
            id="physicalWeight"
            type="number"
            step="0.01"
            {...register("physicalWeight", {
              required: true,
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="length">Length (in CM)</Label>
          <Input
            id="length"
            type="number"
            step="0.01"
            {...register("length", { required: true, valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="breadth">Breadth (in CM)</Label>
          <Input
            id="breadth"
            type="number"
            step="0.01"
            {...register("breadth", { required: true, valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="height">Height (in CM)</Label>
          <Input
            id="height"
            type="number"
            step="0.01"
            {...register("height", { required: true, valueAsNumber: true })}
          />
        </div>
      </div>

      <h3 className="font-semibold">Select Pickup Location</h3>

      {/* Pass the single pickup location wrapped in an array */}
      <WarehouseCard
        warehouses={warehousesArrayForCard}
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
        type="button"
        size="lg"
        onClick={handleEstimateRate}
        disabled={
          isEstimatingRate ||
          !selectedWarehouseId || // This should now be set by useEffect
          !pincode ||
          !city ||
          !state ||
          physicalWeight === undefined ||
          length === undefined ||
          breadth === undefined ||
          height === undefined ||
          isNaN(physicalWeight) ||
          isNaN(length) ||
          isNaN(breadth) ||
          isNaN(height) ||
          physicalWeight <= 0 ||
          length <= 0 ||
          breadth <= 0 ||
          height <= 0
        }
      >
        {isEstimatingRate ? "Estimating..." : "Estimate Rate"}
      </Button>

      {estimatedRateData && (
        <Alert className="mt-4 self-end">
          <AlertTitle>Estimated Shipping Cost</AlertTitle>
          <AlertDescription>
            The estimated cost for this shipment is: **₹
            {estimatedRateData.estimatedCost.toFixed(2)}**
          </AlertDescription>
        </Alert>
      )}

      {estimateRateError && (
        <Alert variant={"destructive"} className="mt-4 self-end">
          <AlertTitle>Rate Estimation Error</AlertTitle>
          <AlertDescription>{estimateRateError.message}</AlertDescription>
        </Alert>
      )}

      <Button
        className="mt-2 self-end"
        type="submit"
        size="lg"
        disabled={isCreatingOrder}
      >
        {isCreatingOrder ? "Placing Order..." : "Place Order"}
      </Button>
    </form>
  );
};

export default CreateOrderForm;
