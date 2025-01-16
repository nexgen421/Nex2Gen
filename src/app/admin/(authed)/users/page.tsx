"use client";

import React, { useCallback, useState, useEffect } from "react";
import { IndianRupeeIcon, Loader2, MoreHorizontal, Search } from "lucide-react";
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
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/trpc/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import moment from "moment";
import PagePagination from "~/components/layout/PagePagination";
import KycCard from "./_KycCard";
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

// Add custom hook for debounce

// Define the structure for KYC details and company info
interface CompanyInfo {
  companyName?: string;
  companyType?: string;
  companyEmail?: string;
  companyContactNumber?: string;
}

// Define the structure for KYC details
interface KYCDetails {
  companyInfo?: CompanyInfo;
}

// Define the structure for Wallet
interface Wallet {
  currentBalance: number;
}

// Define the structure for User
interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  image?: string | null;
  isApproved: boolean;
  isKycSubmitted: boolean;
  createdAt: string; // Assuming ISO string format; adjust if necessary
  wallet: Wallet;
  kycDetails?: KYCDetails;
}

interface UserData {
  users: User[];
}


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
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs">Email</TableHead>
          <TableHead className="text-xs">Mobile Number</TableHead>
          <TableHead className="text-xs">Kyc Details</TableHead>
          <TableHead className="text-xs">Kyc Status</TableHead>
          <TableHead className="hidden text-xs md:table-cell">
            Applied at
          </TableHead>
          <TableHead className="text-xs">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
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
            <TableCell>
              <Badge
                variant={user.isApproved ? "default" : "outline"}
                className="text-xs"
              >
                {user.isApproved ? "Approved" : "Pending"}
              </Badge>
            </TableCell>
            <TableCell className="text-xs">{user.email}</TableCell>
            <TableCell className="text-xs">{user.mobile}</TableCell>
            <TableCell className="text-xs">
              <KycCard userId={user.id} name={user.name} email={user.email} />
            </TableCell>
            <TableCell>
              <Badge
                variant={user.isKycSubmitted ? "default" : "outline"}
                className="text-xs"
              >
                {user.isKycSubmitted ? "Submitted" : "Pending"}
              </Badge>
            </TableCell>
            <TableCell className="text-xs">
              {moment(user.createdAt).format("Do MMMM YYYY, h:mm:ss a")}
            </TableCell>
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

const Users = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  const currentTab =
    (params.get("tab") as "approved" | "all" | "kyc" | "pending") ?? "all";
  const currentPage = +(params.get("page") ?? 0);

  const { mutateAsync: submitApproveUser } = api.user.approve.useMutation();
  const { mutateAsync: submitDeleteUser } = api.user.deleteUser.useMutation();

  const { data: allUsersData, isLoading: isLoadingAll } =
    api.user.fetchAll.useQuery({
      cursor: currentPage,
      filter: currentTab,
      search: debouncedSearchTerm, // Use debounced value here
    });

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      // Reset page to 0 when searching
      const searchParams = new URLSearchParams(params);
      searchParams.set("page", "0");
      router.push(`${pathname}?${searchParams.toString()}`);
    },
    [params, pathname, router],
  );

  if (isLoadingAll) {
    return (
      <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-2 bg-white">
        <Loader2 className="h-10 w-10 animate-spin stroke-accent-foreground duration-500" />
        <h1 className="text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  const handleApproveUser = async (id: string) => {
    await submitApproveUser({ id });
    router.refresh();
  };

  const handleDeleteUser = async (id: string) => {
    await submitDeleteUser({ id });
    router.refresh();
  };

  const handleTabChange = (value: string) => {
    const searchParams = new URLSearchParams(params);
    searchParams.set("tab", value);
    searchParams.set("page", "0");
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage your Users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or mobile number..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8 text-sm"
            />
          </div>
        </div>

        <Tabs defaultValue={currentTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="approved">Approved Users</TabsTrigger>
            <TabsTrigger value="kyc">KYC Submitted</TabsTrigger>
            <TabsTrigger value="pending">Pending Users</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="m-0">
            <UserTable
              users={allUsersData?.users ?? []}
              onApprove={handleApproveUser}
              onDelete={handleDeleteUser}
            />
          </TabsContent>
          <TabsContent value="approved" className="m-0">
            <UserTable
              users={allUsersData?.users ?? []}
              onApprove={handleApproveUser}
              onDelete={handleDeleteUser}
            />
          </TabsContent>
          <TabsContent value="kyc" className="m-0">
            <UserTable
              users={allUsersData?.users ?? []}
              onApprove={handleApproveUser}
              onDelete={handleDeleteUser}
            />
          </TabsContent>
          <TabsContent value="pending" className="m-0">
            <UserTable
              users={allUsersData?.users ?? []}
              onApprove={handleApproveUser}
              onDelete={handleDeleteUser}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-center">
          <PagePagination
            pageUrl={pathname}
            totalItems={allUsersData?.usersCount ?? 0}
            itemsPerPage={10}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default Users;
