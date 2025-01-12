"use client";

import React, { useState, useRef, useEffect } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import PdfDocument from "~/components/LabelPdfDocument";
import { useReactToPrint } from "react-to-print";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TRPCClientError } from "@trpc/client";
import type { api as TRPCType } from "~/trpc/server";

type OrderDetails = Awaited<ReturnType<typeof TRPCType.order.getUserOrder>>;

const AdminLabelPage = () => {
  const params = useSearchParams();
  const [awbNumber, setAwbNumber] = useState(params.get("orderId") ?? "");
  const { mutateAsync } = api.label.getLabelByOrderId.useMutation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const getOrderDetails = async () => {
      if (awbNumber !== "") {
        const currentOrderDetails = await mutateAsync({ awbNumber });
        setOrderDetails(currentOrderDetails);
      } else {
        toast.error("Please enter a valid order id");
      }
    };

    getOrderDetails()
      .then(() => {
        return true;
      })
      .catch((e) => {
        if (e instanceof TRPCClientError) {
          toast.error(e.message);
        }
      });

    return () => {
      setOrderDetails(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awbNumber]);

  const generateLabelHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const currentOrderDetails = await mutateAsync({ awbNumber });
    setOrderDetails(currentOrderDetails);
  };

  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
    documentTitle: `${orderDetails?.orderId ?? orderDetails?.id}.pdf`,
    onAfterPrint: () => alert("PDF generated successfully"),
    pageStyle: "A4",
    onPrintError(errorLocation, error) {
      console.log(error);
    },
  });

  return (
    <section className="container flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="orderId">Order Id</Label>
        <div className="flex w-full items-center gap-5 md:w-1/2">
          <Input
            id="orderId"
            type="text"
            onChange={(e) => setAwbNumber(e.target.value)}
            value={awbNumber}
          />
          <Button onClick={generateLabelHandler} variant={"default"}>
            Generate Label
          </Button>
          {orderDetails && <Button onClick={handlePrint}>Download PDF</Button>}
        </div>
      </div>

      {orderDetails && <PdfDocument ref={pdfRef} orderData={orderDetails} />}
    </section>
  );
};

export default AdminLabelPage;
