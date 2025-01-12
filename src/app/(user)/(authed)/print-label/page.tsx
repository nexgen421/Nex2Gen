"use client";

import React, { useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { api as TRPCType } from "~/trpc/server";
import { useRouter } from "next/navigation";

const UserLabelPage = () => {
  const [awbNumber, setAwbNumber] = useState("");
  const router = useRouter();

  const generateLabelHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    router.push(`/print-label/${awbNumber}`);
  };

  return (
    <section className="container flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="orderId">LR Number</Label>
        <div className="flex w-full items-center gap-5 md:w-1/2">
          <Input
            id="orderId"
            type="text"
            onChange={(e) => setAwbNumber(e.target.value)}
            value={awbNumber}
          />
          <Button onClick={generateLabelHandler} variant={"default"}>
            Generate Label
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UserLabelPage;
