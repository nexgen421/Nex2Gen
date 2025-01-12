"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Loading from "~/app/loading";
import InvoicePDFDocument from "~/components/InvoicePDFDocument";
import { api } from "~/trpc/react";

const DownloadInvoicePage = ({ params }: { params: { orderId: string } }) => {
  const router = useRouter();
  const { data, isLoading } = api.order.getUserOrder.useQuery({
    id: params.orderId,
  });
  const pdfRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
    documentTitle: `${data?.id}.pdf`,
    onAfterPrint: () => {
      alert("PDF generated successfully");
      router.push("/orders");
    },
    pageStyle: "A4",
    onPrintError(errorLocation, error) {
      console.log(error);
    },
  });

  useEffect(() => {
    if (data && pdfRef.current) {
      handlePrint();
    }
  }, [data, handlePrint, pdfRef]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full flex-col">
      <InvoicePDFDocument ref={pdfRef} orderData={data} isLoading={isLoading} />
    </div>
  );
};

export default DownloadInvoicePage;
