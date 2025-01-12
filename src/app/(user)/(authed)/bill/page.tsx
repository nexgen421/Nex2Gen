"use client";

import React, { useRef, useState } from "react";
import BillPDFDocument from "~/components/BillPDFDocument";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/react";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { toast } from "sonner";
import { Heading } from "~/components/ui/heading";

const TestingPage: React.FC = () => {
  const [billDate, setBillDate] = useState<Date | undefined>(new Date());
  const billRef = useRef<HTMLDivElement>(null);
  const { isLoading, data } = api.bill.getUserBill.useQuery(
    { date: billDate },
    {
      enabled: !!billDate,
      refetchOnWindowFocus: false,
    },
  );

  const handlePrint = useReactToPrint({
    content: () => billRef.current,
    documentTitle: `${data?.userDetails?.name}-${moment(new Date()).format("DD/MM/YYYY")}.pdf`,
    onAfterPrint: () => {
      toast.success("PDF Generated Successfully");
    },
    pageStyle: "A4",
    onPrintError(errorLocation, error) {
      console.log(error);
    },
  });

  return (
    <div className="flex justify-between gap-4 p-4">
      <div className="flex flex-col gap-2">
        <Heading level={2}>Generate Bills</Heading>
        <Label htmlFor="billDate">Billing Date</Label>
        <DatePicker
          date={billDate ?? new Date()}
          setDate={setBillDate}
          id="billDate"
        />

        <Button
          onClick={(e) => {
            e.preventDefault();
            handlePrint();
          }}
          disabled={isLoading || data?.transactions.length === 0}
        >
          Print Invoice
        </Button>
      </div>
      <ScrollArea className="h-[80vh] rounded-md border p-4">
        <BillPDFDocument
          isLoading={isLoading}
          orderData={data}
          ref={billRef}
          billDate={billDate}
        />
      </ScrollArea>
    </div>
  );
};

export default TestingPage;
