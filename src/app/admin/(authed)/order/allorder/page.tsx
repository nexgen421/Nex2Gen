"use client";

import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import PaginationBtn from "~/components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { TooltipProvider } from "~/components/ui/tooltip";
import moment from "moment";

enum OrderStatus {
  BOOKED = "BOOKED",
  READY_TO_SHIP = "READY_TO_SHIP",
  CANCELLED = "CANCELLED",
}

enum ShipmentStatus {
  INFORECEIVED = "INFORECEIVED",
  TRANSIT = "TRANSIT",
  PICKUP = "PICKUP",
  UNDELIVERED = "UNDELIVERED",
  DELIVERED = "DELIVERED",
  EXCEPTION = "EXCEPTION",
  EXPIRED = "EXPIRED",
  NOTFOUND = "NOTFOUND",
  PENDING = "PENDING",
}

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  awbNumber?: string;
  startDate?: Date;
  endDate?: Date;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const params = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  const initialStartDate = params.get("startDate")
    ? new Date(params.get("startDate")!)
    : null;
  const initialEndDate = params.get("endDate")
    ? new Date(params.get("endDate")!)
    : null;

  const [awbNumber, setAwbNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

  const handleFilter = () => {
    onFilterChange({
      awbNumber: awbNumber ?? undefined,
      startDate: startDate ?? undefined,
      endDate: endDate ?? undefined,
    });
  };

  const clearFilters = () => {
    setAwbNumber("");
    setStartDate(null);
    setEndDate(null);
    onFilterChange({});
    router.replace(path);
  };

  return (
    <div className="mb-4 flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-2">
        <label>LR Number</label>
        <Input
          placeholder="Enter LR number"
          value={awbNumber}
          onChange={(e) => setAwbNumber(e.target.value)}
          className="w-48"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Start Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-48">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate ?? undefined}
              onSelect={(date) => setStartDate(date ?? null)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-2">
        <label>End Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-48">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate ?? undefined}
              onSelect={(date) => setEndDate(date ?? null)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFilter}>Apply Filters</Button>
        <Button variant="outline" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
};

const OrdersTable: React.FC = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [limit, setLimit] = useState<number>(10);
  const currentPageFromUrl = +(params.get("page") ?? "1");
  const [currentPage, setCurrentPage] = useState<number>(currentPageFromUrl);
  const [filters, setFilters] = useState<FilterOptions>({});

  const { data, isLoading, error } = api.adminOrder.getAllOrdersAdmin.useQuery({
    cursor: currentPage,
    limit,
    ...filters,
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <span>Loading orders...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-red-500">
            Error loading orders: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const totalPages = Math.ceil(data.totalOrderCount / limit);

  const getStatusColor = (status: OrderStatus | ShipmentStatus): string => {
    const statusColors: Record<OrderStatus | ShipmentStatus, string> = {
      [OrderStatus.BOOKED]: "bg-yellow-500",
      [OrderStatus.READY_TO_SHIP]: "bg-blue-500",
      [OrderStatus.CANCELLED]: "bg-red-500",
      [ShipmentStatus.DELIVERED]: "bg-green-500",
      [ShipmentStatus.TRANSIT]: "bg-blue-400",
      [ShipmentStatus.PICKUP]: "bg-blue-300",
      [ShipmentStatus.UNDELIVERED]: "bg-orange-500",
      [ShipmentStatus.EXCEPTION]: "bg-red-400",
      [ShipmentStatus.EXPIRED]: "bg-gray-500",
      [ShipmentStatus.NOTFOUND]: "bg-gray-400",
      [ShipmentStatus.PENDING]: "bg-yellow-400",
      [ShipmentStatus.INFORECEIVED]: "bg-purple-400",
    };
    return statusColors[status] || "bg-gray-500";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(page));
    window.history.pushState({}, "", url);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
    const url = new URL(window.location.href);
    url.searchParams.set("page", "1");
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        if (value instanceof Date) {
          url.searchParams.set(key, value.toISOString());
        } else {
          url.searchParams.set(key, String(value));
        }
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.pushState({}, "", url);
  };

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>My Orders ({data.totalOrderCount})</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterBar onFilterChange={handleFilterChange} />
          <div className="rounded-md border">
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Order ID</TableHead>
                  <TableHead className="w-24">User Name</TableHead>
                  <TableHead className="w-24">Company Name</TableHead>
                  <TableHead className="w-32">Order Date</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>LR Number</TableHead>
                  <TableHead className="w-24">AWB Number</TableHead>
                  <TableHead className="w-32">Courier Provider</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.orders.map((order) => {
                  if (order) {
                    return (
                      <TableRow key={order?.id}>
                        <TableCell>
                          <Button
                            variant={"link"}
                            onClick={() => {
                              router.push(`/admin/order/${order?.orderId}`);
                            }}
                          >
                            #{order?.orderId}
                          </Button>
                        </TableCell>
                        <TableCell>{order?.user?.name}</TableCell>
                        <TableCell>
                          {order?.user?.kycDetails?.companyInfo?.companyName}
                        </TableCell>
                        <TableCell className="">
                          <div className="flex flex-col">
                            <span>
                              {moment(order?.orderDate).format("MMM DD, YYYY")}
                            </span>
                            <span>
                              {moment(order?.orderDate).format("hh:mm A")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {order?.orderCustomerDetails?.customerName} (
                          {order?.orderCustomerDetails?.customerMobile})
                        </TableCell>
                        <TableCell>
                          {order?.userAwbDetails?.awbNumber}
                        </TableCell>
                        <TableCell>
                          {order?.shipment?.awbNumber
                            ? order?.shipment.awbNumber
                            : "-"}
                        </TableCell>
                        <TableCell className="font-bold capitalize">
                          {order?.carrier ? order?.carrier : "-"}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`${getStatusColor(order?.status as OrderStatus | ShipmentStatus)} mx-auto w-fit rounded-full px-3 py-[2px] text-xs font-semibold capitalize text-white`}
                          >
                            {order?.currentStatusDesc}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center">
              <PaginationBtn
                handleChange={handlePageChange}
                totalPages={totalPages}
                currentPage={currentPage}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-500">
              Showing {data.orders.length} of {data.totalOrderCount} orders
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Label>Items Per Page</Label>
            <Select
              value={limit.toString()}
              onValueChange={(value) => setLimit(+value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Items Per Page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default OrdersTable;
