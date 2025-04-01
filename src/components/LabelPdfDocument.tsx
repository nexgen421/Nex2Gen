import React, { forwardRef } from "react";
import ReactBarcode from "react-barcode";
import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";
import type { api as TRPCType } from "~/trpc/server";

type OrderDetails = Awaited<ReturnType<typeof TRPCType.order.getUserOrder>>;

interface Props {
  orderData: OrderDetails;
}

const getPartnerSource = (courierProvider: string | undefined) => {
  if (courierProvider === "499") {
    return "/partners/shadowfax.jpg";
  } else if (courierProvider === "2") {
    return "/partners/delhivery-logo.png";
  } else if (courierProvider === "6") {
    return "/partners/ecomexpress-logo.jpeg";
  } else if (courierProvider === "16") {
    return "/partners/xpressbees-logo.jpeg";
  } else if (courierProvider === "valmo") {
    return "/partners/valmo.png";
  } else {
    return undefined;
  }
};

const PdfDocument = forwardRef(function PdfDocument(
  { orderData }: Props,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
      ref={ref}
      className="mx-auto w-full max-w-[800px] border border-black p-4 text-black print:border-2 print:shadow-none"
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="wv-full row-span-1 flex justify-between">
          <div className="max-w-[60%]">
            <h4 className="mb-3 text-xl font-bold">Ship To</h4>
            <p className="mb-1 text-lg font-semibold uppercase italic">
              {orderData.orderCustomerDetails?.customerName}
            </p>
            <p className="mb-1 italic">{`${orderData.orderAdressDetails?.houseNumber} - ${orderData.orderAdressDetails?.streetName}`}</p>
            <p className="mb-1 italic">{`${orderData.orderAdressDetails?.city}, ${orderData.orderAdressDetails?.state}, India`}</p>
            <p className="mb-1 italic">
              {orderData.orderAdressDetails?.pincode}
            </p>
            <p className="italic">
              Phone No: {orderData.orderCustomerDetails?.customerMobile}
            </p>
          </div>
          <div className="flex h-full flex-col items-center justify-center">
            <h3 className="text-lg">
              <Image
                src={
                  getPartnerSource(orderData.shipment?.courierProvider) ?? ""
                }
                alt={orderData.shipment?.courierProvider ?? ""}
                width={140}
                height={100}
                className="object-contain"
              />
            </h3>
            <div className="mt-2">
              <ReactBarcode
                value={orderData.shipment?.awbNumber ?? ""}
                width={2}
                height={50}
                renderer="img"
                format="CODE128"
              />
            </div>
          </div>
        </div>
        <hr className="border-black" />
        <div className="flex justify-between">
          <div>
            <h4 className="mb-2 text-lg font-bold">
              Shipped From{" "}
              <span className="font-normal">(If Undelivered, Return to)</span>
            </h4>
            <ul className="max-w-[60%] text-base italic">
              <li className="mb-1 font-semibold uppercase">
                {orderData.pickupLocation.name ?? ""}
              </li>
              <li className="mb-1">{orderData.pickupLocation.address}</li>
              <li className="mb-1">{`${orderData.pickupLocation.city}, ${orderData.pickupLocation.state}, India`}</li>
              <li className="mb-1">{orderData.pickupLocation.pincode}</li>
              <li className="mb-1">
                Name: {orderData.pickupLocation.contactName}
              </li>
              <li className="mb-1">
                Mobile No: {orderData.pickupLocation.mobileNumber}
              </li>
            </ul>
          </div>
          <div className="flex h-full min-w-[200px] flex-col items-center justify-center">
            <QRCodeCanvas
              value={orderData.shipment?.awbNumber ?? ""}
              size={120}
              className="shadow-lg print:shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default PdfDocument;
