"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import PagePagination from "~/components/layout/PagePagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "~/components/ui/table";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import RequestCard from "../../_RequestCard";
import { usePathname } from "next/navigation";
import Loading from "~/app/loading";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "~/components/ui/tooltip"; // Import Tooltip
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
import { toast } from "sonner";

interface UserOrderTableProps {
    params: {
      userId: string;
    };
  }

const Page : React.FC<UserOrderTableProps> = ({ params }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const handleOrderApproval = (orderId: string) => {
    router.push(`/admin/order/approve/${orderId}`, { scroll: false });
  };

  const handleCheckboxChange = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const handleBulkAction = (action: string) => {
    if (action === "approve") {
      selectedOrders.forEach((orderId) => handleOrderApproval(orderId));
    }
  };

  const searchParams = useSearchParams();
  const { data, isLoading } = api.order.getOrderRequests.useQuery({
    id: params.userId,
    cursor: +(searchParams.get("page") ?? 0),
  });
  const { mutateAsync } = api.order.rejectOrder.useMutation({
    onSuccess() {
      router.refresh();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return <Loading />;
  }
  const DeleteDialog = ({ orderId }: { orderId: string }) => {
    const handleDeleteOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      toast.promise(mutateAsync({ orderId }), {
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
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteOrder}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Requests Count :  {data?.orders?.length || 0}</CardTitle>
        <CardDescription>View Recent Order Requests</CardDescription>
        {/* Bulk action dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "max-w-xs",
            )}
          >
            Actions
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleBulkAction("approve")}>
              Approve Selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Table className="w-full text-xs">
          <TableHeader>
            <TableRow>
              <TableHead>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrders(data?.orders.map((o: any) => o.id) ?? []);
                    } else {
                      setSelectedOrders([]);
                    }
                  }}
                  checked={
                    (data?.orders?.length ?? 0) > 0 &&
                    selectedOrders.length === data?.orders.length
                  }
                />
              </TableHead>
              <TableHead>Customer Details</TableHead>
              <TableHead>Order Details</TableHead>
              <TableHead>Customer Address</TableHead>
              {/* <TableHead>Customer MObile</TableHead> */}
              <TableHead>Pickup Address</TableHead>
              <TableHead>View Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TooltipProvider>
            <TableBody>
              {data?.orders.map((order: any) => {
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(order.id)}
                        checked={selectedOrders.includes(order.id)}
                      />
                    </TableCell>
                    <TableCell className="flex flex-col items-center gap-1">
                      <span className="font-semibold">
                        {order.user.kycDetails?.companyInfo?.companyName}
                      </span>
                      <span>{order.user.name}</span>
                      <span>{order.pickupLocation.mobileNumber}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">
                          Booked:{" "}
                          {moment(order.orderDate).format("Do MMMM YYYY")}
                        </span>
                        <span>
                          {order.productName} ({order.orderCategory})
                        </span>
                      </div>
                    </TableCell>
                    {/* Truncated Customer Address with Tooltip */}
                    <TableCell className="max-w-[200px]">
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger className="max-w-[200px] truncate">
                          {`${order.orderAdressDetails?.houseNumber} - ${order.orderAdressDetails?.streetName} - ${order.orderAdressDetails?.famousLandmark} - ${order.orderAdressDetails?.city} - ${order.orderAdressDetails?.state} - ${order.orderAdressDetails?.pincode}`}
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm text-wrap">
                          {`${order.orderAdressDetails?.houseNumber} - ${order.orderAdressDetails?.streetName} - ${order.orderAdressDetails?.famousLandmark} - ${order.orderAdressDetails?.city} - ${order.orderAdressDetails?.state} - ${order.orderAdressDetails?.pincode}`}
                        </TooltipContent>
                      </Tooltip>
                      {/* <div>{order.orderCustomerDetails?.customerName}</div> */}
                      {/* <div>{order.orderCustomerDetails?.customerMobile?order.orderCustomerDetails.customerMobile:""}</div> */}
                    </TableCell>
                    {/* Truncated Pickup Address with Tooltip */}
                    <TableCell className="max-w-[200px]">
                      <Tooltip>
                        <TooltipTrigger className="max-w-[200px] truncate">
                          {`${order.pickupLocation.address} - ${order.pickupLocation.city} - ${order.pickupLocation.state} - ${order.pickupLocation.pincode}`}
                        </TooltipTrigger>
                        <TooltipContent>
                          {`${order.pickupLocation.address} - ${order.pickupLocation.city} - ${order.pickupLocation.state} - ${order.pickupLocation.pincode}`}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost">
                        <RequestCard orderKey={order.id} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            className="text-green-600 hover:!bg-green-100 hover:!text-green-600 focus:!bg-green-100 focus:!text-green-600"
                            onClick={() => handleOrderApproval(order.id)}
                          >
                            Approve
                          </DropdownMenuItem>
                          <DeleteDialog orderId={order.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </TooltipProvider>
        </Table>
      </CardContent>
      <CardFooter className="flex w-full justify-center">
        {(data?.orderCount ?? 0) > 0 && (
          <PagePagination
            pageUrl={pathname}
            totalItems={data?.orderCount ?? 0}
            itemsPerPage={10}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default Page;