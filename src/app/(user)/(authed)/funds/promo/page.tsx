"use client";

import React, { useState } from "react";
import { Heading } from "~/components/ui/heading";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
import { api } from "~/trpc/react";

interface TPromoResult {
  valid: boolean;
  message: string;
}

const PromoCodePage = () => {
  const [promoCode, setPromoCode] = useState("");
  const [result, setResult] = useState<TPromoResult | null>(null);
  const { mutate } = api.promotions.applyPromocode.useMutation({
    onSuccess: () => {
      setResult({
        valid: true,
        message: "Promo code applied successfully",
      });
    },
    onError(error) {
      setResult({
        valid: false,
        message: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({ code: promoCode });
  };

  return (
    <div className="container mx-auto p-4">
      <Heading level={2}>Promo Code</Heading>
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <h2 className="text-lg font-semibold">Enter your promo code</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full">
              Apply Code
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {result && (
            <Alert
              variant={result.valid ? "success" : "destructive"}
              className="w-full"
            >
              {result.valid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>{result.valid ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PromoCodePage;
