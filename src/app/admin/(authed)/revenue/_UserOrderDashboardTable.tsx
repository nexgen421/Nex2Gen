"use client";

import React, { useCallback, useState, useEffect } from "react";
import { ClipboardCheckIcon, IndianRupeeIcon, Loader2, MoreHorizontal, Search } from "lucide-react";
import { Check, TrashIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/trpc/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import moment from "moment";
import PagePagination from "~/components/layout/PagePagination";
import KycCard from "../users/_KycCard";
import type { api as TRPCType } from "~/trpc/server";
import { Input } from "~/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import CustomCard from "~/components/ui/custom-card";

type FetchAllResponse = Awaited<ReturnType<typeof TRPCType.user.fetchAll>>;

type UserTableProps = {
  users: FetchAllResponse["users"];
  onApprove: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const UserTable = ({ users, onApprove, onDelete }: UserTableProps) => {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] text-xs sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead className="text-xs">Name</TableHead>
          <TableHead className="text-xs">Email</TableHead>
          <TableHead className="text-xs">Current Balance</TableHead>
          <TableHead className="text-xs">Company Type</TableHead>
          <TableHead className="text-xs">Company Name</TableHead>
          <TableHead className="text-xs">Company Email</TableHead>
          <TableHead className="text-xs">Company Contact Number</TableHead>
          <TableHead className="text-xs">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: any) => (
          <TableRow key={user.id}>
            <TableCell className="hidden sm:table-cell">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="text-xs">
                  {user.name
                    .split(" ")
                    .map((letter: string) => letter.at(0))
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell className="text-xs font-medium">{user.name}</TableCell>

            <TableCell className="text-xs">{user.email}</TableCell>
            <TableCell className="text-xs">{user.wallet.currentBalance}</TableCell>
            <TableCell className="text-xs">{user?.kycDetails?.companyInfo?.companyType}</TableCell>
            <TableCell className="text-xs">{user?.kycDetails?.companyInfo?.companyName}</TableCell>
            <TableCell className="text-xs">{user?.kycDetails?.companyInfo?.companyEmail}</TableCell>
            <TableCell className="text-xs">{user?.kycDetails?.companyInfo?.companyContactNumber}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    className="hover:bg-slate-200"
                    variant="ghost"
                    size="icon"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="gap-2 text-xs"
                    onClick={() => onApprove(user.id)}
                  >
                    <Check className="h-3 w-3 stroke-green-500" /> Approve
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="w-full cursor-pointer gap-2 text-xs"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <TrashIcon className="h-3 w-3 text-red-500" /> Delete
                        User
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are You Sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure that you want to delete this user?
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(user.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <DropdownMenuItem
                    className="gap-2 text-xs"
                    onClick={() => router.push(`/admin/rates/${user.id}`)}
                  >
                    <IndianRupeeIcon className="h-3 w-3 stroke-blue-500 stroke-2" />{" "}
                    Rates
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const UserOrderDashboardTable = () => {
  const params = useSearchParams();
  // const { isLoading, data: orderData } =
  //   api.order.getUserWithOrderCounts.useQuery({
  //     cursor: +(params.get("page") ?? 0),
  //   });
  const pathname = usePathname();
  const router = useRouter();



  const currentTab =
    (params.get("tab") as "approved" | "all" | "kyc" | "pending") ?? "all";
  const currentPage = +(params.get("page") ?? 0);

  const { data: allUsersData, isLoading: isLoadingAll } =
    api.user.fetchAll.useQuery({
      cursor: currentPage,
      filter: currentTab,
      search: '', // Use debounced value here
    });

  const { data: userProfileData, isLoading } = api.user.fetchAllUserProfileRevenue.useQuery({
    cursor: currentPage,
    filter: currentTab,
    search: '',
  });

  console.log(userProfileData, "USER DETAIL DAT CHECK")

  return (

    <>



      <Table className="border text-xs">
        {/* <TableHeader>
        <TableRow className="bg-slate-50">
          <TableHead className="font-semibold">User Details</TableHead>
          <TableHead className="font-semibold">User Email</TableHead>
          <TableHead className="text-center font-semibold">
            company Name
          </TableHead>
          <TableHead className="text-center font-semibold">
            Orders Processing
          </TableHead>
          <TableHead className="font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader> */}
        <TableBody>
          {/* {data?.userData?.map((user: any) => (
          <TableRow key={user.id} className="hover:bg-slate-50">
            <TableCell className="font-medium">
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-500">{user.companyName}</div>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-center">
              <Badge className="rounded-full px-4" variant="outline">
                {user.bookedOrdersCount}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge className="rounded-full px-4" variant="default">
                {user.processingOrdersCount}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-slate-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/admin/order/user/${user.id}`);
                }}
              >
                View All Orders
              </Button>
            </TableCell>
          </TableRow>
        ))} */}

          {/* {data?.orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Button
                variant={"link"}
                onClick={() => {
                  router.push(`/orders/${order.orderId}`);
                }}
              >
                #{order.orderId}
              </Button>
            </TableCell>
            <TableCell>
              {order.user?.name}
            </TableCell>
            <TableCell>

              {order.user?.kycDetails?.companyInfo?.companyName}
            </TableCell>
            <TableCell className="">
              <div className="flex flex-col">
                <span>
                  {moment(order.orderDate).format("MMM DD, YYYY")}
                </span>
                <span>{moment(order.orderDate).format("hh:mm A")}</span>
              </div>
            </TableCell>
            <TableCell>
              {order.orderCustomerDetails?.customerName} (
              {order.orderCustomerDetails?.customerMobile})
            </TableCell>
            <TableCell>{order.userAwbDetails?.awbNumber}</TableCell>
            <TableCell>
              {order.shipment?.awbNumber
                ? order.shipment.awbNumber
                : "-"}
            </TableCell>
            <TableCell className="font-bold capitalize">
              {order.shipment?.courierProvider
                ? order.shipment.courierProvider
                : "-"}
            </TableCell>
            <TableCell>
              <div
                className={`${getStatusColor(order.status as OrderStatus | ShipmentStatus)} mx-auto w-fit rounded-full px-3 py-[2px] text-xs font-semibold capitalize text-white`}
              >
                {order.status !== "READY_TO_SHIP" &&
                  order.status.split("_").join(" ").toLowerCase()}
                {order.status === "READY_TO_SHIP" &&
                  order.shipment?.status
                    .split("_")
                    .join(" ")
                    .toLowerCase()}
              </div>
            </TableCell>
          </TableRow>
        ))} */}

          <UserTable
            users={userProfileData?.users ?? []}
          // onApprove={()=>{}}
          // onDelete={()=>{}}
          />
        </TableBody>
        <TableFooter>
          <TableRow>
          <TableCell colSpan={5} className="bg-white">
            <PagePagination
              pageUrl={pathname}
              totalItems={userProfileData?.usersCount ?? 0}
              itemsPerPage={10}
            />
          </TableCell>
        </TableRow>
        </TableFooter>
      </Table>

    </>

  );
};

export default UserOrderDashboardTable;
