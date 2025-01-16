"use client";

import React from "react";
import { api } from "~/trpc/react";
import Loading from "~/app/loading";
import {
  Calendar,
  Package,
  Truck,
  MapPin,
  User,
  CreditCard,
  Box,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

// Define types based on the database schema
type OrderStatus = "BOOKED" | "READY_TO_SHIP" | "CANCELLED";
type OrderPaymentMode = "PREPAID";
type ShipmentStatus =
  | "INFORECEIVED"
  | "TRANSIT"
  | "PICKUP"
  | "UNDELIVERED"
  | "DELIVERED"
  | "EXCEPTION"
  | "EXPIRED"
  | "NOTFOUND"
  | "PENDING";

const StatusBadge = ({
  status,
  shipmentStatus,
}: {
  status: OrderStatus;
  shipmentStatus: ShipmentStatus | undefined;
}) => {
  const statusStyles = {
    BOOKED: "bg-yellow-100 text-yellow-800",
    READY_TO_SHIP: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {status !== "READY_TO_SHIP" && status.replace(/_/g, " ")}
      {status === "READY_TO_SHIP" && shipmentStatus?.replace(/_/g, " ")}
    </Badge>
  );
};

const SingleOrderPage = ({ params }: { params: { orderId: string } }) => {
  const { data, isLoading } = api.adminOrder.getSingleOrderDetails.useQuery({
    orderId: +params.orderId,
  });

  if (isLoading) return <Loading />;
  if (!data) return <div>Order not found</div>;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="animate-fadeIn min-h-screen space-y-6 bg-gray-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Order #{data.orderId}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on {formatDate(data.orderDate)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge
            status={data.status}
            shipmentStatus={data.shipment?.status}
          />
          {data.isInsured && (
            <div className="flex items-center gap-1 text-green-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Insured</span>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary Card */}
      <Card className="transition-shadow duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{data.orderCategory}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Product</p>
            <p className="font-medium">{data.productName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Payment Mode</p>
            <p className="font-medium">{data.paymentMode}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Order Value</p>
            <p className="font-medium">₹{data.orderValue.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Pickup Location Card */}
      <Card className="transition-shadow duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Pickup Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.pickupLocation && (
            <>
              <div className="space-y-2">
                <p className="font-medium">{data.pickupLocation.name}</p>
                <p className="text-gray-600">{data.pickupLocation.address}</p>
                {data.pickupLocation.famousLandmark && (
                  <p className="text-gray-600">
                    Near {data.pickupLocation.famousLandmark}
                  </p>
                )}
                <p className="text-gray-600">
                  {data.pickupLocation.city}, {data.pickupLocation.state} -{" "}
                  {data.pickupLocation.pincode}
                </p>
              </div>
              <div className="border-t pt-2">
                <p className="text-sm text-gray-500">Contact Details</p>
                <p className="font-medium">{data.pickupLocation.contactName}</p>
                <p className="text-gray-600">
                  {data.pickupLocation.mobileNumber}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Customer Details and Delivery Address */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.orderCustomerDetails && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {data.orderCustomerDetails.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-medium">
                    {data.orderCustomerDetails.customerMobile}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.orderAdressDetails && (
              <>
                <p className="font-medium">
                  {data.orderAdressDetails.houseNumber},{" "}
                  {data.orderAdressDetails.streetName}
                </p>
                <p className="text-gray-600">
                  Near {data.orderAdressDetails.famousLandmark}
                </p>
                <p className="text-gray-600">
                  {data.orderAdressDetails.city},{" "}
                  {data.orderAdressDetails.state} -{" "}
                  {data.orderAdressDetails.pincode}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Package Details */}
      {data.packageDetails && (
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5" />
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Length</p>
              <p className="font-medium">{data.packageDetails.length} cm</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Breadth</p>
              <p className="font-medium">{data.packageDetails.breadth} cm</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Height</p>
              <p className="font-medium">{data.packageDetails.height} cm</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Weight</p>
              <p className="font-medium">
                {data.packageDetails.physicalWeight} kg
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shipment Details */}
      {data.shipment && (
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">AWB Number</p>
                <p className="font-medium">{data.shipment.awbNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Courier Provider</p>
                <p className="font-medium capitalize">
                  {data.shipment.courierProvider}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Latest Status</p>
                <p className="font-medium">{data.shipment.status}</p>
              </div>
            </div>
            {data.shipment.latestEvent && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">Latest Update</p>
                <p className="font-medium">{data.shipment.latestEvent}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SingleOrderPage;
