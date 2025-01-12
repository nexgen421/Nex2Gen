"use client";

import React from "react";
import { Loader2, MoreHorizontal } from "lucide-react";
import { Check } from "lucide-react";
import { TrashIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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
import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import moment from "moment";
import { useRouter } from "next/navigation";
import PagePagination from "~/components/layout/PagePagination";
import { usePathname } from "next/navigation";

const Employees = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const {
    mutateAsync
  } = api.admin.approve.useMutation();
  const { data, isLoading } = api.admin.fetchAll.useQuery({
    cursor: +(params.get("page") ?? 0),
  });
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-2 bg-white">
        <Loader2 className="h-10 w-10 animate-spin stroke-accent-foreground duration-500" />
        <h1 className="text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  const handleApproveAdmin = async (id: string) => {
    await mutateAsync({ id: id })
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
        <CardDescription>Manage your employees</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">
                Mobile Number
              </TableHead>
              <TableHead className="hidden md:table-cell">Applied at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((admin) => {
              return (
                <TableRow key={admin.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Avatar>
                      <AvatarImage src={admin.image ?? undefined} />
                      <AvatarFallback>
                        {admin.name
                          .split(" ")
                          .map((letter) => letter.at(0))
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>
                    <Badge variant={admin.approved ? "default" : "outline"}>
                      {admin.approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.mobile}</TableCell>
                  <TableCell>
                    {moment(admin.createdAt).format("Do MMMM YYYY, h:mm:ss a")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button className="hover:bg-slate-200" variant={"ghost"} size={"icon"}>
                          <MoreHorizontal className="w-5 h-5"/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                          <DropdownMenuItem className="gap-2"><Check className="w-5 h-5 stroke-green-500" onClick={() => handleApproveAdmin(admin.id)}/> Approve</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><TrashIcon className="w-5 h-5 stroke-red-500"/> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="w-full flex items-center justify-center">
          <PagePagination pageUrl={pathname} itemsPerPage={10} totalItems={data?.length ?? 0} />
        </div>
      </CardFooter>
    </Card>
  );
};
export default Employees;
