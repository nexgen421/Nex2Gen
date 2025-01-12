import React, { forwardRef } from "react";
import type { api } from "~/trpc/server";
import Loading from "~/app/loading";
import moment from "moment";
import { QRCodeCanvas } from "qrcode.react";
import numeral from "numeral";

type OrderType = Awaited<ReturnType<typeof api.order.getUserOrder>>;

const InvoicePDFDocument = forwardRef(function PdfDocument(
  {
    orderData,
    isLoading,
  }: { orderData: OrderType | undefined; isLoading: boolean },
  ref: React.Ref<HTMLDivElement>,
) {
  if (isLoading) return <Loading />;

  return (
    <div
      className="mx-auto w-full max-w-5xl bg-white p-8 text-gray-800 print:max-w-none print:p-0"
      ref={ref}
    >
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {orderData?.user?.kycDetails?.companyInfo?.companyName}
          </h1>
          <p className="text-sm">{orderData?.user.email}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold">BOOKING RECEIPT</h2>
          <p className="text-sm">Order #: {orderData?.orderId}</p>
          <p className="text-sm">
            Date: {moment(new Date()).format("DD/MM/YYYY")}
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Bill To:</h3>
          <p>{orderData?.orderCustomerDetails?.customerName}</p>
          <p>
            {orderData?.orderAdressDetails?.houseNumber} -{" "}
            {orderData?.orderAdressDetails?.streetName}
          </p>
          <p>
            {orderData?.orderAdressDetails?.city},{" "}
            {orderData?.orderAdressDetails?.state}{" "}
            {orderData?.orderAdressDetails?.pincode}
          </p>
          <p>India</p>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">Send By:</h3>
          <p>{orderData?.user.name}</p>
          <p>
            {orderData?.pickupLocation.address}
            {`${orderData?.pickupLocation.famousLandmark ? ` near ${orderData.pickupLocation.famousLandmark}` : ""}`}
          </p>
          <p>
            {orderData?.pickupLocation.city}, {orderData?.pickupLocation.state}{" "}
            {orderData?.pickupLocation.pincode}
          </p>
          <p>India</p>
          <p>{orderData?.pickupLocation.contactName}</p>
          <p>{orderData?.pickupLocation.mobileNumber}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Payment Details:</h3>
          <p>Payment Method: {orderData?.paymentMode}</p>
          <p>Order Date: {moment(orderData?.orderDate).format("DD/MM/YYYY")}</p>
          <p className="mt-2 text-2xl font-medium">
            LR Number: {orderData?.userAwbDetails?.awbNumber}
          </p>
        </div>
        <div className="text-right">
          <QRCodeCanvas
            value={`https://${process.env.VERCEL_URL ?? "http://localhost:3000"}/track/${orderData?.userAwbDetails?.awbNumber}`}
            size={100}
            className="inline-block"
          />
        </div>
      </div>

      <div className="border-t border-gray-300 pt-4 text-sm">
        <p>Thank you for your business!</p>
        <p>For any queries, please contact us at {orderData?.user.email}</p>
      </div>
    </div>
  );
});

export default InvoicePDFDocument;
