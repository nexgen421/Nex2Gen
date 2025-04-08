"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { api } from "~/trpc/react";
import Loading from "~/app/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { Input } from "../ui/input";
import { SUBSTATUS } from "~/lib/constants";
import { Badge } from "../ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import moment from "moment";
import { ScrollArea } from "../ui/scroll-area";
import AdminTrackingSidebar from "./AdminTrackingSidebar";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { MoreHorizontal, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import SelectCourierProvider from "../courier-provider/SelectCourierProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ShipmentStatus =
  | "ALL" |
  "DELIVERED" |
  "IN TRANSIST" |
  "RTO" |
  "RTO DELIVERED" |
  "CANCELLED" |
  "SHIPMENT BOOKED" |
  "PICKED UP" |
  "OUT OF DELIVERY" |
  "NO INFORMATION YET" |
  "OUT OF DELIVERY AREA" |
  "DELIVERY DELAYED" |
  "UNDELIVERED ATTEMPT";

const tabTriggerHeaderCountKey = (status: ShipmentStatus) => {
  if (status === "IN TRANSIST") return "inTransist";
  else if (status === "DELIVERED") return "delivered";
  else if (status === "RTO") return "rto";
  else if (status === "RTO DELIVERED") return "rtoDelivered";
  else if (status === "CANCELLED") return "calcelled";
  else if (status === "SHIPMENT BOOKED") return "shipmentBooked";
  else if (status === "PICKED UP") return "pickedUp";
  else if (status === "OUT OF DELIVERY") return "outOfDelivery";
  else if (status === "NO INFORMATION YET") return "noInformationYet";
  else if (status === "OUT OF DELIVERY AREA") return "outOfDeliveryArea";
  else if (status === "DELIVERY DELAYED") return "deliveryDelayed";
  else if (status === "UNDELIVERED ATTEMPT") return "undeliveredAttempt";
  else return "allCount";
};

const AdminShipmentListTable = () => {
  const [activeTab, setActiveTab] = useState<ShipmentStatus>("ALL");
  const { data, isLoading } = api.shipment.getNewShipmentCount.useQuery();

  if (isLoading) return <Loading />;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as ShipmentStatus)}
    >
      <TabsList>
        {[
          "ALL",
          "DELIVERED",
          "IN TRANSIST",
          "RTO",
          "RTO DELIVERED",
          "CANCELLED",
          "SHIPMENT BOOKED",
          "PICKED UP",
          "OUT OF DELIVERY",
          "NO INFORMATION YET",
          "OUT OF DELIVERY AREA",
          "DELIVERY DELAYED",
          "UNDELIVERED ATTEMPT",
        ].map((status) => (
          <TabsTrigger key={status} value={status}>
            {status} (
            {data?.[tabTriggerHeaderCountKey(status as ShipmentStatus)]})
          </TabsTrigger>
        ))}
      </TabsList>
      <ShipmentListTable shipmentType={activeTab} />
    </Tabs>
  );
};

const ShipmentListTable = ({
  shipmentType,
}: {
  shipmentType: ShipmentStatus;
}) => {
  const [ordersPerPage, setOrdersPerPage] = useState<number>(10);
  const [days, setDays] = useState<number>(7);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } =
    api.shipment.getOrders.useQuery(
      {
        shipmentType,
        limit: ordersPerPage,
        days,
        page,
        searchQuery: debouncedSearchQuery || undefined,
      },
      {},
    );

  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const delta = 1; // Number of pages to show on each side of current page
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page
    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    range.unshift(1);

    // Add last page
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 1500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    // Reset to first page when search query or days change
    setPage(1);
  }, [debouncedSearchQuery, days]);

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading orders</div>;

  const totalPages = Math.ceil((data?.total ?? 0) / ordersPerPage);

  return (
    <>
      <div className="my-2 flex items-center gap-2">
        <Select
          value={days.toString()}
          onValueChange={(value) => setDays(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">This Day</SelectItem>
            <SelectItem value="7">This Week</SelectItem>
            <SelectItem value="30">This Month</SelectItem>
            <SelectItem value="60">Last Two Months</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search AWB"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-[300px]"
        />
      </div>

      <TabsContent value={shipmentType}>
        <TooltipProvider>
          <ScrollArea className="h-[68vh]">
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Details</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>AWB Number</TableHead>
                  <TableHead>LR Number</TableHead>
                  <TableHead>Shipment Status</TableHead>
                  <TableHead>Order Date/Time</TableHead>
                  <TableHead>Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((order) => {
                  if (order) {
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger className="max-w-[200px] truncate">
                              {order.orderCustomerDetails?.customerName}
                            </TooltipTrigger>
                            <TooltipContent>
                              {order.orderCustomerDetails?.customerName}
                            </TooltipContent>
                          </Tooltip>
                          <div>{order.orderCustomerDetails?.customerMobile}</div>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger className="max-w-[200px] truncate">
                              {`${order.orderAdressDetails?.houseNumber}, ${order.orderAdressDetails?.streetName}, ${order.orderAdressDetails?.city}, ${order.orderAdressDetails?.state}`}
                            </TooltipTrigger>
                            <TooltipContent>
                              {`${order.orderAdressDetails?.houseNumber}, ${order.orderAdressDetails?.streetName}, ${order.orderAdressDetails?.city}, ${order.orderAdressDetails?.state}`}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <AdminTrackingSidebar
                            awbNumber={order.shipment?.awbNumber ?? ""}
                          />
                        </TableCell>
                        <TableCell>{order.userAwbDetails?.awbNumber}</TableCell>
                        <TableCell className="flex flex-col items-center gap-2">
                          <Badge className="rounded-full">
                            {order?.currentStatusDesc ?? "No Information Yet"}
                          </Badge>
                          {/* <Tooltip>
                            <TooltipTrigger className="max-w-[200px] truncate">
                              {order.shipment?.subStatus
                                ? SUBSTATUS[
                                    order.shipment
                                      ?.subStatus as keyof typeof SUBSTATUS
                                  ]
                                : "Unknown"}
                            </TooltipTrigger>
                            <TooltipContent>
                              {order.shipment?.subStatus
                                ? SUBSTATUS[
                                    order.shipment
                                      ?.subStatus as keyof typeof SUBSTATUS
                                  ]
                                : "Unknown"}
                            </TooltipContent>
                          </Tooltip> */}
                        </TableCell>
                        <TableCell>
                          {moment(order.orderDate).format("DD/MM/YYYY hh:mm A")}
                        </TableCell>
                        <TableCell>
                          <EditAWBDialog orderId={order.id} />
                        </TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </TooltipProvider>

        <div className="mt-4 flex justify-start">
          <div className="flex items-center gap-5">
            <Label htmlFor="ordersPerPage">Orders Per Page</Label>
            <Select
              value={`${ordersPerPage}`}
              onValueChange={(value) => setOrdersPerPage(+value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue
                  placeholder="Orders Per Page"
                  className="w-[150px]"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Pagination className="flex-1">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="cursor-pointer"
                />
              </PaginationItem>

              {getPageNumbers(page, totalPages).map((pageNum, idx) => (
                <PaginationItem key={idx}>
                  {pageNum === "..." ? (
                    <span className="px-4 py-2">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => setPage(+pageNum)}
                      isActive={page === pageNum}
                      disabled={isFetching}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </TabsContent>
    </>
  );
};

interface EditAWBDialogProps {
  orderId: string | undefined;
}

interface EditAWBDialogFormValues {
  awbNumber: string;
}

const EditAWBDialog: React.FC<EditAWBDialogProps> = ({ orderId }) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<EditAWBDialogFormValues>();
  const router = useRouter();
  const [courierProvider, setCourierProvider] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { mutateAsync } = api.shipment.editAwb.useMutation({
    onSuccess: () => {
      toast.success("AWB updated successfully");
      router.refresh();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to update AWB");
    },
  });

  const handleEditAWB = async (data: EditAWBDialogFormValues) => {
    if (!orderId) {
      toast.error("Invalid Request");
      return;
    }

    if (!data.awbNumber) {
      toast.error("AWB Number is not available");
      return;
    }

    if (!courierProvider) {
      toast.error("Courier Provider is required");
      return;
    }

    await mutateAsync({
      courierProvider: courierProvider as
        | "delhivery"
        | "valmo"
        | "xpressbees"
        | "shadowfax"
        | "ecom-express",
      newAwb: data.awbNumber,
      orderId: orderId,
    });
  };

  return (
    <Dialog onOpenChange={(open) => setIsDialogOpen(open)} open={isDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Pencil className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit AWB</DialogTitle>
          <DialogDescription>
            You can edit the AWB of the shipment here.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleEditAWB)}
          className="mt-4 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="awbNumber">AWB Number</Label>
            <Input
              id="awbNumber"
              {...register("awbNumber", {
                required: { value: true, message: "AWB Number is required" },
              })}
            />
            {errors.awbNumber && (
              <span className="text-sm text-red-500">
                {errors.awbNumber.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="courierProvider">Courier Provider</Label>
            <SelectCourierProvider
              courierProvider={courierProvider}
              setCourierProvider={setCourierProvider}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update AWB"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminShipmentListTable;
