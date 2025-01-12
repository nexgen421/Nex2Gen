"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { type SetDefaultRateInput } from "~/server/api/routers/admin-settings";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import Loading from "~/app/loading";
import { Label } from "~/components/ui/label";

const SettingsPage = () => {
  const { data, isLoading } = api.adminSettings.getDefaultRate.useQuery();
  const { mutateAsync: setDefaultRate } =
    api.adminSettings.setDefaultRate.useMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SetDefaultRateInput>({});

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        return setValue(key as keyof SetDefaultRateInput, Number(value));
      });
    }
  }, [data, setValue]);

  const onSubmit = async (input: SetDefaultRateInput) => {
    try {
      await setDefaultRate({
        halfKgPrice: +input.halfKgPrice,
        oneKgPrice: +input.oneKgPrice,
        twoKgPrice: +input.twoKgPrice,
        threeKgPrice: +input.threeKgPrice,
        fiveKgPrice: +input.fiveKgPrice,
        sevenKgPrice: +input.sevenKgPrice,
        tenKgPrice: +input.tenKgPrice,
        twelveKgPrice: +input.twelveKgPrice,
        fifteenKgPrice: +input.fifteenKgPrice,
        seventeenKgPrice: +input.seventeenKgPrice,
        twentyKgPrice: +input.twentyKgPrice,
        twentyTwoKgPrice: +input.twentyTwoKgPrice,
        twentyFiveKgPrice: +input.twentyFiveKgPrice,
        twentyEightKgPrice: +input.twentyEightKgPrice,
        thirtyKgPrice: +input.thirtyKgPrice,
        thirtyFiveKgPrice: +input.thirtyFiveKgPrice,
        fortyKgPrice: +input.fortyKgPrice,
        fortyFiveKgPrice: +input.fortyFiveKgPrice,
        fiftyKgPrice: +input.fiftyKgPrice,
      });
      toast.success("Default rates updated successfully.");
    } catch (error) {
      toast.error("Failed to update default rates.");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <section className="">
      <Heading level={1}>Settings</Heading>
      <Separator className="w-full" />

      <Heading level={3}>Default Rate Settings</Heading>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          ].map(({ id, label }) => (
            <div key={id}>
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                type="number"
                {...register(id as keyof SetDefaultRateInput, {
                  required: "This field is required.",
                })}
              />
              {errors[id as keyof SetDefaultRateInput] && (
                <p className="text-red-500">
                  {errors[id as keyof SetDefaultRateInput]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <Button type="submit" className="mt-4">
          Save Default Rates
        </Button>
      </form>
    </section>
  );
};

export default SettingsPage;
