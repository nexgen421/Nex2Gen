"use client";

import { IconGraph } from "@tabler/icons-react";
import { Plus } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Loading from "~/app/loading";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const PromotionsPage = () => {
  const { data, isLoading } = api.promotions.fetchAllPromocodes.useQuery();
  const { mutate, isPending } = api.promotions.togglePromocode.useMutation();
  const router = useRouter();
  if (isLoading || isPending) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex justify-between">
        <h1 className="mb-4 text-xl font-semibold">Promotions</h1>
        <AddPromoDialog />
      </div>
      <Table className="shadow-lg">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Enabled</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Analytics</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((promo) => {
            return (
              <TableRow key={promo.id}>
                <TableCell>{promo.id}</TableCell>
                <TableCell className="font-semibold">{promo.code}</TableCell>
                <TableCell>
                  <Switch
                    checked={promo.isActive}
                    onCheckedChange={(checked) => {
                      mutate({ isActive: checked, promoCodeId: promo.id });
                      promo.isActive = checked;
                    }}
                  />
                </TableCell>
                <TableCell>
                  {moment(promo.createdAt).format("DD-MMMM-YYYY hh:mm:ss")}
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant={"outline"}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/admin/promotions/${promo.id}`);
                    }}
                  >
                    <IconGraph className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

interface TAddPromocodeForm {
  promocode: string;
  amount: number;
}

const AddPromoDialog = () => {
  const { register, handleSubmit } = useForm<TAddPromocodeForm>();
  const router = useRouter();
  const { mutate, isPending } = api.promotions.createPromocode.useMutation({
    onSuccess: (data) => {
      toast.success(`Promocode ${data.code} created successfully`);
      router.refresh();
    },
  });

  const handleCreatePromocode = async (data: TAddPromocodeForm) => {
    mutate({ amount: +data.amount, promocode: data.promocode });
  };

  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants({ size: "sm", className: "flex gap-1" }))}
      >
        <Plus className="h-4 w-4" />
        Create Promocode
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Promocode</DialogTitle>
          <DialogDescription>
            Create a Promocode for customers to use
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleCreatePromocode)}
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="promocode">Promocode</Label>
            <Input
              id="promocode"
              {...register("promocode", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="amount">Amount in ₹</Label>
            <Input
              id="amount"
              type="number"
              {...register("amount", { required: true })}
            />
          </div>

          <Button type="submit">
            {isPending ? "Creating..." : "Create Promocode"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionsPage;
