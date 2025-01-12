"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod"; // Note: You'll need to install zod
import { zodResolver } from "@hookform/resolvers/zod"; // Note: You'll need to install this
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "~/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
});

type TFundUserDetailsForm = z.infer<typeof formSchema>;

const FundUserDetails = () => {
  const [tCChecked, setTCChecked] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<TFundUserDetailsForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
  });

  const handleFillUserDetails = (data: TFundUserDetailsForm) => {
    console.log(data);
    router.push("/funds/add");
  };

  return (
    <Card className="mx-auto mt-12 max-w-6xl shadow-lg">
      <CardHeader className="space-y-2 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Fill User Details
        </CardTitle>
        <CardDescription className="text-gray-600">
          These details are required in order to proceed with the transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFillUserDetails)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Checkbox
                id="termsAndConditions"
                checked={tCChecked}
                onCheckedChange={(checked) => setTCChecked(checked === true)}
                className="h-5 w-5"
              />
              <Label
                htmlFor="termsAndConditions"
                className="text-sm text-gray-600"
              >
                By clicking proceed button, you agree to our terms and policy
              </Label>
            </div>

            <Button
              type="submit"
              className="mt-4 bg-blue-600 transition-all hover:bg-blue-700"
              disabled={!tCChecked}
            >
              Proceed to Add Funds
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FundUserDetails;
