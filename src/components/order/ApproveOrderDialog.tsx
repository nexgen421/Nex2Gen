import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ClipboardCheck } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ApproveOrderDialog = ({
  orderId,
  orderPrice,
}: {
  orderId: string;
  orderPrice: number;
}) => {
  const router = useRouter();
  const [awbNumber, setAwbNumber] = useState("");
  const [courierProvider, setCourierProvider] = useState("");
  const [open, setOpen] = useState(false);

  const { mutateAsync: approveOrder } = api.adminOrder.approveOrder.useMutation(
    {
      onError(error) {
        toast.error(error.message);
      },
      onSuccess() {
        toast.success("Order Approved Successfully");
        router.push("/admin/order/requests");
      },
    },
  );

  useEffect(() => {
    if (awbNumber) {
      const patterns = {
        delhivery: /^1490[0-9]{11}$/,
        "ecom-express": /^[0-9]{10}$/,
        shadowfax: /^SF[0-9]{10}$/,
        xpressbees: /^1340[0-9]{11}$/,
      };

      for (const [courier, pattern] of Object.entries(patterns)) {
        if (pattern.test(awbNumber)) {
          setCourierProvider(courier);
          break;
        }
      }
    }
  }, [awbNumber]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!courierProvider) {
      toast.error("Please select a courier provider");
      return;
    }

    try {
      await approveOrder({
        awbNumber,
        courierProvider: courierProvider as
          | "delhivery"
          | "ecom-express"
          | "shadowfax"
          | "valmo"
          | "xpressbees",
        dbOrderId: orderId,
      });
      setOpen(false);
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <ClipboardCheck className="h-4 w-4" />
          Approve Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Order #{orderId}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Order Price</Label>
            <Input
              id="price"
              value={`₹${orderPrice}`}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="awb">AWB Number</Label>
            <Input
              id="awb"
              value={awbNumber}
              onChange={(e) => setAwbNumber(e.target.value)}
              placeholder="Enter AWB number"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="courier">Detected Courier</Label>
            <Input
              id="courier"
              value={courierProvider || "Detecting..."}
              readOnly
              className="bg-muted"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!courierProvider}>
              Confirm Approval
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveOrderDialog;
