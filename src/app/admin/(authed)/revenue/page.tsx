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
import { ClipboardCheckIcon, Filter, RefreshCw } from "lucide-react";
import CustomCard from "~/components/ui/custom-card";
import { api } from "~/trpc/react";


const RevenueDashboard = () => {
  
    const { data, isLoading: isLoadingAll } = api.revenue.getYearWiseRevenue.useQuery({
      year : 2024
    })
     
    console.log(data,"DATA CEHECK TYOTAL REVUENE")

  return (
    <>

      <div style={{width :"300px"}}>
        <CustomCard className="col-span-1 flex items-center gap-4 bg-blue-50 p-4 mb-3" >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
            <ClipboardCheckIcon className="h-12 w-12 stroke-blue-600" />
          </div>
          <div className="flex h-full flex-col items-start justify-center gap-2" >
            <h4 className="text-xl font-medium">
              {/* Total Revenue: {data?.amount} */}
            </h4>

          </div>
        </CustomCard>
      </div>

      <Card className="w-full">
        <CardHeader className="space-y-2">

          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Revenue
              </CardTitle>
              <CardDescription className="mt-1 text-gray-500">
                Here are the Revenue
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
    </>

  );
};

export default RevenueDashboard;
