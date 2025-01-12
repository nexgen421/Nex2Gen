"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "~/app/loading";
import { type SupportSubReason } from "@prisma/client";

interface TQuery {
  issue: string;
  awbNumber?: number;
}

const RaiseAQueryDialog = () => {
  const { data, isLoading } = api.support.getAllReasons.useQuery();
  const {
    register,
    // formState: { errors },
    handleSubmit,
  } = useForm<TQuery>();
  const { mutateAsync } = api.support.createTicket.useMutation({
    onError(error) {
      toast.error(error.message);
    },
  });
  const { mutateAsync: fetchSubReasons } =
    api.support.fetchSubReasons.useMutation();
  const router = useRouter();
  const [subReasons, setSubReasons] = useState<SupportSubReason[]>([]);
  const [selectedSubReason, setSelectedSubReason] = useState<number | null>(
    null,
  );

  if (isLoading) return <Loading />;

  const handleQuerySubmit = async (data: TQuery) => {
    console.log(data);

    if (!selectedSubReason) {
      toast.error("Please Select a Sub Reason");
      return;
    }

    try {
      await mutateAsync({
        issue: data.issue,
        userAwbNumber: data.awbNumber,
        reasonId: selectedSubReason,
      });
      toast.success("Query Raised Successfully");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "gap-1",
        )}
      >
        <Plus className="h-5 w-5" />
        Raise A Query
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Raise a Query</DialogTitle>
          <DialogDescription>
            You can raise a query according to your needs
          </DialogDescription>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit(handleQuerySubmit)}>
            <div className="flex w-full flex-col gap-4 p-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="issueType">Issue Type</Label>
                <Select
                  onValueChange={async (value) => {
                    const subReasons = await fetchSubReasons({
                      reasonId: +value,
                    });
                    setSelectedSubReason(null);
                    setSubReasons(subReasons);
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Enter Your Issue Type" />
                  </SelectTrigger>

                  <SelectContent>
                    {data?.map((reason) => {
                      return (
                        <SelectItem value={`${reason.id}`} key={reason.id}>
                          {reason.title}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="issueType">Select A Sub Reason</Label>
                <Select
                  value={selectedSubReason?.toString()}
                  onValueChange={async (value) => {
                    setSelectedSubReason(+value);
                  }}
                  disabled={subReasons.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Enter Your Issue Type" />
                  </SelectTrigger>

                  <SelectContent>
                    {subReasons?.map((reason) => {
                      return (
                        <SelectItem value={`${reason.id}`} key={reason.id}>
                          {reason.reason}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="awbNumber">Enter Your AWB</Label>
                <Input id="awbNumber" {...register("awbNumber")} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Issue Description</Label>
                <Textarea id="description" {...register("issue")} rows={15}>
                  Enter Your Issue Here
                </Textarea>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-4">
              <DialogClose>
                <Button size="sm" variant={"outline"} className="">
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm" type="submit" className="">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RaiseAQueryDialog;
