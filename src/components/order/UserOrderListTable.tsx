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
import { Button, buttonVariants } from "../ui/button";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { SUBSTATUS } from "~/lib/constants";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type ShipmentStatus =
  | "BOOKED"
  | "INFORECEIVED"
  | "TRANSIT"
  | "PENDING"
  | "DELIVERED"
  | "PICKUP"
  | "UNDELIVERED"
  | "CANCELLED";

const UserOrderListTable = () => {
  const params = useSearchParams();
  const [activeTab, setActiveTab] = useState<ShipmentStatus>(
    (params.get("status") as ShipmentStatus) ?? "BOOKED",
  );
  const { data, isLoading } = api.userOrder.getShipmentCount.useQuery();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as ShipmentStatus)}
    >
      <TabsList>
        <TabsTrigger value="BOOKED">Booked ({data?.bookedCount})</TabsTrigger>
        <TabsTrigger value="INFORECEIVED">
          Info Received ({data?.shipmentCount.infoReceivedCount})
        </TabsTrigger>
        <TabsTrigger value="TRANSIT">
          In Transit ({data?.shipmentCount.inTransitCount})
        </TabsTrigger>
        <TabsTrigger value="PENDING">
          Pending ({data?.shipmentCount.pickupPendingCount})
        </TabsTrigger>
        <TabsTrigger value="DELIVERED">
          Delivered ({data?.shipmentCount.deliveredCount})
        </TabsTrigger>
        <TabsTrigger value="PICKUP">
          Pickup Scheduled ({data?.shipmentCount.pickupScheduledCount})
        </TabsTrigger>
        <TabsTrigger value="UNDELIVERED">
          Undelivered ({data?.shipmentCount.undeliveredCount})
        </TabsTrigger>
        <TabsTrigger value="EXCEPTION">
          Exception ({data?.shipmentCount.exceptionCount})
        </TabsTrigger>
        <TabsTrigger value="CANCELLED">
          Cancelled ({data?.cancelledCount})
        </TabsTrigger>
      </TabsList>
      <OrderListTable shipmentType={activeTab} />
    </Tabs>
  );
};

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const OrderListTable = ({ shipmentType }: { shipmentType: ShipmentStatus }) => {
  const router = useRouter();
  const { ref, inView } = useInView();
  const [days, setDays] = useState<number>(7);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const debouncedSearchQuery = useDebounce(
    searchInputValue ? parseInt(searchInputValue) : undefined,
    500,
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = api.userOrder.getOrders.useInfiniteQuery(
    { shipmentType, limit: 10, days, searchQuery: debouncedSearchQuery },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { mutateAsync } = api.userOrder.rejectOrder.useMutation({
    onSuccess() {
      router.refresh();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage().catch((e) => {
        console.error(e);
        toast.error("Error fetching next page");
      });
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading orders</div>;

  const orders = data?.pages.flatMap((page) => page.items) ?? [];

  const DeleteDialog = ({ orderId }: { orderId: string }) => {
    const handleDeleteOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      toast.promise(mutateAsync({ id: orderId }), {
        loading: "Deleting Order...",
        success: "Order Deleted Successfully",
      });
    };
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem
            className="text-red-600 hover:!bg-red-100 hover:!text-red-600 focus:!bg-red-100 focus:!text-red-600"
            onSelect={(e) => e.preventDefault()}
          >
            Delete
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order and refund the amount to the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <>
      <div className="my-2 flex items-center gap-2">
        <Select
          onValueChange={(value) => {
            setDays(parseInt(value));
          }}
          value={days.toString()}
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Select An Option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">This Day</SelectItem>
            <SelectItem value="7">This Week</SelectItem>
            <SelectItem value="30">This Month</SelectItem>
            <SelectItem value="60">Last Two Months</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="LR Search"
          type="number"
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          className="max-w-[300px]"
        />
      </div>

      <TabsContent value={shipmentType}>
        <Table className="border shadow-lg">
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>Customer Details</TableHead>
              <TableHead>Delivery Address</TableHead>
              <TableHead>LR Number</TableHead>
              <TableHead>Order Amount</TableHead>
              <TableHead>Shipment Amount</TableHead>
              <TableHead>Shipment Status</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {orders.map((order) => (
              <TableRow key={order.userAwbDetails?.awbNumber}>
                <TableCell>
                  <div>
                    <span className="font-semibold">Name:</span>{" "}
                    {order.orderCustomerDetails?.customerName}
                  </div>
                  <div>
                    <span className="font-semibold">Mobile:</span>{" "}
                    {order.orderCustomerDetails?.customerMobile}
                  </div>
                </TableCell>
                <TooltipProvider>
                  <TableCell className="">
                    <Tooltip>
                      <TooltipTrigger className="h-full max-w-[150px] truncate">
                        {`${order.orderAdressDetails?.houseNumber}-${order.orderAdressDetails?.streetName}-${order.orderAdressDetails?.famousLandmark}-${order.orderAdressDetails?.city}-${order.orderAdressDetails?.state}`}
                      </TooltipTrigger>
                      <TooltipContent>
                        {`${order.orderAdressDetails?.houseNumber}-${order.orderAdressDetails?.streetName}-${order.orderAdressDetails?.famousLandmark}-${order.orderAdressDetails?.city}-${order.orderAdressDetails?.state}`}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TooltipProvider>
                <TableCell className="text-blue-600 duration-100 ease-out hover:text-blue-800 hover:underline">
                  <Link href={`/track/${order.userAwbDetails?.awbNumber}`}>
                    {order.userAwbDetails?.awbNumber}
                  </Link>
                </TableCell>
                <TableCell>₹ {order.orderValue}</TableCell>
                <TableCell>₹ {order.orderPricing?.price}</TableCell>
                <TableCell>
                  {!(shipmentType === "BOOKED") && (
                    <>
                      <div>
                        {order.shipment?.subStatus
                          ? SUBSTATUS[
                              order.shipment.subStatus as keyof typeof SUBSTATUS
                            ]
                          : ""}
                      </div>
                      <div>{order.shipment?.latestEvent}</div>
                    </>
                  )}
                  {shipmentType === "BOOKED" && <>N/A</>}
                </TableCell>
                <TableCell>{`${order.packageDetails?.length} x ${order.packageDetails?.breadth} x ${order.packageDetails?.height}`}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={buttonVariants({
                        size: "icon",
                        variant: "ghost",
                      })}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link
                          href={`/track/${order.userAwbDetails?.awbNumber}`}
                        >
                          Track Shipment
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/invoice/${order.id}`}>View Invoice</Link>
                      </DropdownMenuItem>
                      {shipmentType !== "BOOKED" && (
                        <DropdownMenuItem>
                          <Link
                            href={`/print-label/${order.userAwbDetails?.awbNumber}`}
                          >
                            View Label
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {shipmentType === "BOOKED" && (
                        <DeleteDialog orderId={order.id} />
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {hasNextPage && (
          <div ref={ref} className="mt-4 flex justify-center">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading more..." : "Load more"}
            </Button>
          </div>
        )}
      </TabsContent>
    </>
  );
};

export default UserOrderListTable;
