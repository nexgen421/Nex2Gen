import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetDescription,
  SheetFooter,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Button, buttonVariants } from "../ui/button";
import { Eye, Package, Truck, MapPin, Calendar } from "lucide-react";
import { cn } from "~/lib/utils";
import { Skeleton } from "../ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  TimelineTitle,
  TimelineContent,
} from "../ui/timeline";
import { type TrackingItem } from "~/lib/tracking-more/modules/types";
import { api } from "~/trpc/react";

interface AdminTrackingSidebarProps {
  awbNumber: string;
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const handleTrackingPageRedirect = (trackingLink: string) => {
  window.open(trackingLink, '_blank');
}

const AdminTrackingSidebar: React.FC<AdminTrackingSidebarProps> = ({
  awbNumber,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    isLoading,
    data: shipmentData,
    error,
  } = api.shipment.trackShipwayShipment.useQuery(
    { order_id: awbNumber },
    {
      enabled: isOpen, // Only fetch when the sidebar is open
    },
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className={cn(buttonVariants({ variant: "link" }))}>
        {awbNumber}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">{awbNumber}</SheetTitle>
          <SheetDescription>Detailed Shipment Information</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          {!isOpen || isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorDisplay message={error.message} />
          ) : (
            // JSON.stringify(shipmentData, null, 2)
            shipmentData && <ShipmentDetails data={shipmentData} />
          )}
        </ScrollArea>
        <SheetFooter>
          <Button onClick={() => { handleTrackingPageRedirect(shipmentData.tracking_url) }} size="lg" variant="outline" className="mt-4 w-full">
            <Eye className="mr-2 h-5 w-5" />
            View Tracking Page
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-20 w-full" />
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <Card className="border-destructive">
    <CardHeader>
      <CardTitle className="text-destructive">Error</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{message}</p>
    </CardContent>
  </Card>
);

const ShipmentDetails = ({ data }: { data: any | undefined }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    transition={{ duration: 0.5 }}
    className="space-y-6"
  >
    <Card>
      <CardHeader>
        <CardTitle>Shipment Overview</CardTitle>
        <CardDescription>Current status and key information</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4">
          <Package className="h-6 w-6 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="text-lg font-semibold capitalize">
              {data?.current_status}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Truck className="h-6 w-6 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Courier</p>
            <p className="text-lg font-semibold">{data?.carrier}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <MapPin className="h-6 w-6 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Destination</p>
            <p className="text-lg font-semibold">
              {data?.to ?? "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Expected Delivery</p>
            <p className="text-lg font-semibold">
              {data?.extra_fields?.expected_delivery_date
                ? format(new Date(data?.extra_fields?.expected_delivery_date), "MMM dd, yyyy")
                : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    {
      data?.scan &&
      <Card>
        <CardHeader>
          <CardTitle>Tracking Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline>
            {data?.scan.map((event: any, index: number) => (
              <TimelineItem key={index}>
                {index < data?.scan.length - 1 && (
                  <TimelineConnector />
                )}
                <TimelineHeader>
                  <TimelineIcon />
                  <TimelineTitle>
                    {format(
                      new Date(event.time),
                      "MMM dd, yyyy HH:mm",
                    )}
                  </TimelineTitle>
                </TimelineHeader>
                <TimelineContent>
                  <TimelineBody>{event.status_detail}</TimelineBody>
                  <p className="text-sm text-muted-foreground">
                    {event.location}
                  </p>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </CardContent>
      </Card>
    }
  </motion.div>
);

export default AdminTrackingSidebar;
