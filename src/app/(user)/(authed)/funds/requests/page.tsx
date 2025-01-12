"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import Loading from "~/app/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card } from "~/components/ui/card";
import numeral from "numeral";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { years, months } from "~/lib/constants";

const ITEMS_PER_PAGE = 10;

interface TabOption {
  value: string;
  label: string;
  isApproved: boolean;
}

const tabOptions: TabOption[] = [
  { value: "pending", label: "Pending", isApproved: false },
  { value: "approved", label: "Approved", isApproved: true },
];

const WalletRequestsTable = () => {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [month, setMonth] = useState<string>(new Date().getMonth().toString());
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = api.wallet.getUserWalletRequests.useInfiniteQuery(
    {
      limit: ITEMS_PER_PAGE,
      isApproved:
        tabOptions.find((tab) => tab.value === activeTab)?.isApproved ?? false,
      month: +month,
      year: +year,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // Refresh data when tab changes
      refetchOnWindowFocus: false,
    },
  );

  const loadMore = async () => {
    if (hasNextPage) {
      try {
        await fetchNextPage();
      } catch (error) {
        console.error("Error loading more wallet requests:", error);
      }
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          Error loading wallet requests. Please try again later.
        </div>
      </Card>
    );

  const walletRequests = data?.pages.flatMap((page) => page.items) ?? [];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <Heading level={2}>Wallet Requests</Heading>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            {tabOptions.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center gap-4">
        <Select value={month} onValueChange={(value) => setMonth(value)}>
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Select A Month" className="" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={(value) => setYear(value)}>
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Select An Year" className="" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {walletRequests.length === 0 ? (
        <Card className="p-6">
          <div className="text-center text-gray-500">
            No {activeTab} wallet requests found.
          </div>
        </Card>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UTR/Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walletRequests.map((request) => (
                <TableRow key={request.referenceNumber}>
                  <TableCell className="font-medium">
                    {request.referenceNumber}
                  </TableCell>
                  <TableCell>
                    ₹ {numeral(request.amount).format("0.00")}
                  </TableCell>
                  <TableCell>
                    {new Date(request.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(request.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        request.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {request.isApproved ? "Approved" : "Pending"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={loadMore}
                disabled={isFetchingNextPage}
                variant="outline"
              >
                {isFetchingNextPage ? (
                  <>
                    <span className="mr-2 animate-spin">↻</span>
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WalletRequestsTable;
