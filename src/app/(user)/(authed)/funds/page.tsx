/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import Loading from "~/app/loading";
import { useRouter } from "next/navigation";
import { Heading } from "~/components/ui/heading";

enum Months {
  all = "All",
  January = "January",
  February = "February",
  March = "March",
  April = "April",
  May = "May",
  June = "June",
  July = "July",
  August = "August",
  September = "September",
  October = "October",
  November = "November",
  December = "December",
}

const FundsPage = () => {
  const params = useSearchParams();
  const [month, setMonth] = useState<Months>(Months.all);
  const [year, setYear] = useState(moment().format("YYYY"));
  const router = useRouter();

  const { data, isLoading } = api.fund.getFundHistory.useQuery({
    cursor: +(params.get("page") ?? 0),
    month: month,
    year: +year,
  });

  if (isLoading) return <Loading />;

  const filteredData = data?.filter((transaction) => {
    const transactionDate = moment(transaction.createdAt);
    return (
      (month === Months.all || transactionDate.format("MMMM") === month) &&
      transactionDate.format("YYYY") === year
    );
  });

  const years = [
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
    "2031",
  ];
  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-4">
      <Heading level={2}>Your Transactions</Heading>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Select
            value={month}
            onValueChange={(value) => setMonth(value as Months)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => {
            router.push("/funds/add");
          }}
        >
          Add Funds
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Transaction Order AWB</TableHead>
                <TableHead>Transaction Date</TableHead>
                <TableHead>Transaction Type</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData?.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className={
                    transaction.type === "DEBIT"
                      ? "bg-red-100 hover:bg-red-50"
                      : "bg-green-100 hover:bg-green-50"
                  }
                >
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>
                    {transaction.type === "DEBIT" ? "-" : "+"} ₹
                    {transaction.amount}
                  </TableCell>
                  <TableCell>
                    {transaction.orderPaymentDetails.order.userAwbDetails
                      .awbNumber ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    {moment(transaction.createdAt).format("Do MMMM YYYY")}
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundsPage;
