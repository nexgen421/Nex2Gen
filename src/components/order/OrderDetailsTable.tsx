import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { motion } from "framer-motion";
import moment from "moment";
import type { api as TRPCType } from "~/trpc/server";

type FullOrder = Awaited<ReturnType<typeof TRPCType.order.getOrder>>;

const OrderDetailsTable = ({ data }: { data: FullOrder | null }) => {
  if (!data) {
    return null;
  }

  const sections = [
    {
      title: "Customer Information",
      fields: [
        { key: "Name", value: data.orderCustomerDetails?.customerName },
        { key: "Mobile", value: data.orderCustomerDetails?.customerMobile },
      ],
    },
    {
      title: "Delivery Address",
      fields: [
        { key: "House Number", value: data.orderAdressDetails?.houseNumber },
        { key: "Street Name", value: data.orderAdressDetails?.streetName },
        {
          key: "Famous Landmark",
          value: data.orderAdressDetails?.famousLandmark,
        },
        { key: "City", value: data.orderAdressDetails?.city },
        { key: "State", value: data.orderAdressDetails?.state },
        { key: "Pincode", value: data.orderAdressDetails?.pincode },
      ],
    },
    {
      title: "Parcel Details",
      fields: [
        {
          key: "Order Date",
          value: moment(data.orderDate).format("Do MMMM YYYY"),
        },
        {
          key: "Dimensions",
          value: `${data.packageDetails?.length} x ${data.packageDetails?.breadth} x ${data.packageDetails?.height} cm`,
        },
        { key: "Weight", value: `${data.packageDetails?.physicalWeight} kg` },
        { key: "Insurance", value: data.isInsured ? "Yes" : "No" },
      ],
    },
    {
      title: "Pickup Location",
      fields: [
        { key: "Address", value: data.pickupLocation?.address },
        { key: "City", value: data.pickupLocation?.city },
        { key: "State", value: data.pickupLocation?.state },
        { key: "Pincode", value: data.pickupLocation?.pincode },
        { key: "Contact Name", value: data.pickupLocation?.contactName },
        { key: "Contact Number", value: data.pickupLocation?.mobileNumber },
      ],
    },
  ];

  return (
    <ScrollArea className="h-[70vh] w-full">
      <div className="space-y-4 p-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Field</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.fields.map((field) => (
                      <TableRow key={field.key}>
                        <TableCell className="font-medium">
                          {field.key}
                        </TableCell>
                        <TableCell>{field.value ?? "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default OrderDetailsTable;
