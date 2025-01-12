"use client";

import React, { useState } from "react";
import { Heading } from "~/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import { api } from "~/trpc/react";

interface SinglePromoCodeAnalyticsProps {
  params: {
    promoId: string;
  };
}

const SinglePromoCodeAnalytics: React.FC<SinglePromoCodeAnalyticsProps> = ({
  params,
}) => {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");

  if (params.promoId === undefined) {
    return <Heading level={2}>No Promo Code ID Provided</Heading>;
  }

  const { data, isLoading } = api.promotions.fetchPromocodeAnalytics.useQuery({
    promoCodeId: +params.promoId,
    timeframe,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return <Heading level={2}>No data available</Heading>;
  }

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Heading level={1}>Analytics for Promo Code: {data.promoCode}</Heading>
        <Select
          value={timeframe}
          onValueChange={(value: "weekly" | "monthly") => setTimeframe(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Usage Count</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalUsageCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Amount Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ₹{data.totalAmountSaved.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Discount Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ₹{data.discountAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${data.isActive ? "text-green-500" : "text-red-500"}`}
            >
              {data.isActive ? "Active" : "Inactive"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList>
          <TabsTrigger value="usage">Usage Over Time</TabsTrigger>
          <TabsTrigger value="savings">Savings Over Time</TabsTrigger>
        </TabsList>
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="usageCount"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="savings">
          <Card>
            <CardHeader>
              <CardTitle>Savings Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amountSaved" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="max-h-60 list-disc overflow-y-auto pl-5">
            {data.users.map((user) => (
              <li key={user.userId}>{user.email}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
};

export default SinglePromoCodeAnalytics;
