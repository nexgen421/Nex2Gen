"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import UserOrderDashboardTable from "./_UserOrderDashboardTable";
import { Button } from "~/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";

const OrderDashboard = () => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Orders Under Processing
            </CardTitle>
            <CardDescription className="mt-1 text-gray-500">
              Here are the orders that are in the process of delivery
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UserOrderDashboardTable />
      </CardContent>
    </Card>
  );
};

export default OrderDashboard;
