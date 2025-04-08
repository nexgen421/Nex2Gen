"use client";

import React, { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import OrderDetailsTable from "~/components/order/OrderDetailsTable";
import { Button, buttonVariants } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import SelectCourierProvider from "~/components/courier-provider/SelectCourierProvider";

interface TOrderApprovalForm {
  awbNumber: string;
  courierProvider: string;
}

const Page = ({ params }: { params: { orderId: string } }) => {
  const router = useRouter();
  const orderId = params.orderId;
  const [courierProvider, setCourierProvider] = useState<string>("");
  const { data, isLoading } = api.order.getOrder.useQuery({ id: orderId });
  const { handleSubmit, register, watch, setValue } =
    useForm<TOrderApprovalForm>();
  const { mutateAsync } = api.adminOrder.approveOrder.useMutation({
    onError(error) {
      toast.error(error.message);
    },
  });
  const { mutateAsync: rejectOrder, isPending } =
    api.order.rejectOrder.useMutation();

  const awbNumber = watch("awbNumber");

  useEffect(() => {
    if (awbNumber) {
      const detectedCourier = detectCourierProvider(awbNumber);
      if (detectedCourier) {
        setCourierProvider(detectedCourier);
        setValue("courierProvider", detectedCourier);
      }
    }
  }, [awbNumber, setValue]);

  const detectCourierProvider = (awb: string) => {
    // These are example patterns. You should replace them with actual patterns used by each courier.
    const patterns = {
      "2": /^1490[0-9]{11}$/,
      "6": /^[0-9]{10}$/,
      "499": /^SF[0-9]{10}$/,
      "16": /^1340[0-9]{11}$/,
    };

    for (const [courier, pattern] of Object.entries(patterns)) {
      if (pattern.test(awb)) {
        return courier;
      }
    }
    return "";
  };
  // debugger
  // console.log(data);
  const handleOrderApprove = async (obj: TOrderApprovalForm) => {
    if (courierProvider === "") {
      toast.error("Please select a courier provider");
      return;
    }
    await mutateAsync({
      awbNumber: obj.awbNumber,
      courierProvider: courierProvider as string,
      dbOrderId: orderId,
    });

    toast.success("Order Approved Successfully");
    router.push(`/admin/order/requests/order-request/${data?.pickupLocation?.userId}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center bg-white text-center">
        Loading....
      </div>
    );
  }

  const rejectOrderHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await rejectOrder({ orderId: orderId });
    // router.push("/admin/order/requests");
    router.push(`/admin/order/requests/order-request/${data?.pickupLocation?.userId}`);
    toast.success("Order Rejected Successfully");
  };

  return (
    <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2">
      <div className="w-full">
        <h3 className="mb-5 text-xl font-medium">Order Details</h3>
        <OrderDetailsTable data={data ?? null} />
      </div>
      <div className="flex w-full flex-col">
        <h3 className="mb-5 text-xl font-medium">Order Actions</h3>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={handleSubmit(handleOrderApprove)}
        >
          <div className="mx-auto flex w-4/5 flex-col gap-2">
            <Label htmlFor="price">Order Price (in ₹)</Label>
            <Input
              value={data?.orderPricing?.price}
              id="price"
              type="text"
              readOnly
            />
          </div>
          <div className="mx-auto flex w-4/5 flex-col gap-2">
            <Label htmlFor="awbNumber">AWB Number</Label>
            <Input {...register("awbNumber")} id="awbNumber" type="text" />
          </div>
          <div className="mx-auto flex w-4/5 flex-col gap-2">
            <Label htmlFor="courierProvider">Courier Provider</Label>
            <SelectCourierProvider
              courierProvider={courierProvider}
              setCourierProvider={setCourierProvider}
            />
          </div>
          <div className="mx-auto mt-5 flex w-4/5 justify-end gap-2">
            <AlertDialog>
              <AlertDialogTrigger
                className={buttonVariants({
                  variant: "destructive",
                })}
              >
                Reject Order
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Order</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  Are you sure you want to reject this order?
                </AlertDialogDescription>
                <div className="flex items-center justify-end gap-2">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({
                      variant: "destructive",
                    })}
                    onClick={rejectOrderHandler}
                  >
                    Reject Order
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit">Approve Order</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
