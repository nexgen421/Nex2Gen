"use client";

import { TRPCClientError } from "@trpc/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableHead,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

interface TUpdateRate {
  halfKgPrice: number;
  oneKgPrice: number;
  twoKgPrice: number;
  threeKgPrice: number;
  fiveKgPrice: number;
  sevenKgPrice: number;
  tenKgPrice: number;
  twelveKgPrice: number;
  fifteenKgPrice: number;
  seventeenKgPrice: number;
  twentyKgPrice: number;
  twentyTwoKgPrice: number;
  twentyFiveKgPrice: number;
  twentyEightKgPrice: number;
  thirtyKgPrice: number;
  thirtyFiveKgPrice: number;
  fortyKgPrice: number;
  fortyFiveKgPrice: number;
  fiftyKgPrice: number;
}

const UpdateRatePage = ({ params }: { params: { userId: string } }) => {
  const { data: initialRates, isLoading } = api.rate.getUserRateById.useQuery({
    userId: params.userId,
  });
  const { mutateAsync: updateRate, isPending: isPendingUpdate } =
    api.rate.updateRateForUser.useMutation();

  const { mutateAsync: createRate, isPending: isPendingCreate } =
    api.rate.createRatesForUsers.useMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TUpdateRate>();

  useEffect(() => {
    if (initialRates?.rateList) {
      reset(initialRates.rateList);
    }
  }, [initialRates, reset]);

  const updateRateHandler = async (data: TUpdateRate) => {
    if (!initialRates?.rateList?.id) {
      try {
        await createRate({ userId: params.userId, ...data });
        toast.success("Rates created successfully");
      } catch (error) {
        if (error instanceof TRPCClientError) {
          toast.error(error.message);
        } else {
          console.log(error);
        }
      } finally {
        router.push("/admin/rates");
      }
      return;
    }
    try {
      await updateRate({
        rateId: initialRates?.rateList?.id,
        ...data,
      });
      toast.success("Rate updated successfully");
    } catch (error) {
      toast.error("Failed to update rate");
      console.error(error);
    }
  };

  return (
    <form
      className="mx-auto max-w-xl"
      onSubmit={handleSubmit(updateRateHandler)}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Weight</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {[
            { id: "halfKgPrice", label: "Half Kg Price" },
            { id: "oneKgPrice", label: "One Kg Price" },
            { id: "twoKgPrice", label: "Two Kg Price" },
            { id: "threeKgPrice", label: "Three Kg Price" },
            { id: "fiveKgPrice", label: "Five Kg Price" },
            { id: "sevenKgPrice", label: "Seven Kg Price" },
            { id: "tenKgPrice", label: "Ten Kg Price" },
            { id: "twelveKgPrice", label: "Twelve Kg Price" },
            { id: "fifteenKgPrice", label: "Fifteen Kg Price" },
            { id: "seventeenKgPrice", label: "Seventeen Kg Price" },
            { id: "twentyKgPrice", label: "Twenty Kg Price" },
            { id: "twentyTwoKgPrice", label: "Twenty-Two Kg Price" },
            { id: "twentyFiveKgPrice", label: "Twenty-Five Kg Price" },
            { id: "twentyEightKgPrice", label: "Twenty-Eight Kg Price" },
            { id: "thirtyKgPrice", label: "Thirty Kg Price" },
            { id: "thirtyFiveKgPrice", label: "Thirty-Five Kg Price" },
            { id: "fortyKgPrice", label: "Forty Kg Price" },
            { id: "fortyFiveKgPrice", label: "Forty-Five Kg Price" },
            { id: "fiftyKgPrice", label: "Fifty Kg Price" },
          ].map(({ label, id }) => (
            <TableRow key={id}>
              <TableCell>{label}</TableCell>
              <TableCell>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Input
                      type="number"
                      {...register(id as keyof TUpdateRate, {
                        required: `${label} price is required`,
                        valueAsNumber: true,
                        validate: (value) =>
                          !isNaN(value) || "Please enter a valid number",
                      })}
                      aria-invalid={
                        errors[id as keyof TUpdateRate] ? "true" : "false"
                      }
                    />
                    {errors[id as keyof TUpdateRate] && (
                      <p className="text-red-500">
                        {errors[id as keyof TUpdateRate]?.message}
                      </p>
                    )}
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        type="submit"
        className="mt-4 w-full"
        size="lg"
        disabled={isSubmitting || isLoading || isPendingUpdate}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
      {Object.keys(errors).length > 0 && (
        <p className="mt-4 text-red-500">
          Please fix the above errors before submitting.
        </p>
      )}
    </form>
  );
};

export default UpdateRatePage;
