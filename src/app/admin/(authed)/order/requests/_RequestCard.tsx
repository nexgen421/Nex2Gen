import { Eye } from "lucide-react";
import React from "react";
import { buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import OrderDetailsTable from "~/components/order/OrderDetailsTable";

const RequestCard = ({ orderKey }: { orderKey: string }) => {
  const { data } = api.order.getOrder.useQuery({ id: orderKey });

  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
      >
        <Eye className="h-4 w-4" />
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Showing Dialog Details for {orderKey}
          </DialogDescription>
        </DialogHeader>
        <OrderDetailsTable data={data ?? null} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestCard;
