"use client";
import { useState } from "react";
import {
  CheckCircle,
  Loader2,
  Milestone,
  Package,
  ArrowRight,
  AlertCircle,
  Clock,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/react";
import moment from "moment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";

const TrackingWithId = ({ params }: { params: { awbNumber: number } }) => {
  const [trackingNumber, setTrackingNumber] = useState<string>(
    params.awbNumber.toString(),
  );
  const { data, isLoading, error } = api.tracking.getTrackingByAwb.useQuery({
    trackingNumber: +params.awbNumber,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trackingNumber === "") {
      toast.error("Please enter a valid tracking number");
      return;
    }
    router.push(`/track/${trackingNumber}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="ml-4 text-lg text-blue-700">
            Loading tracking information...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message ||
              "An error occurred while fetching tracking information. Please try again."}
          </AlertDescription>
        </Alert>
      );
    }

    if (!data || data.milestones?.length === 0) {
      return (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Information Available</AlertTitle>
          <AlertDescription>
            We couldn&apos;t find any tracking information for the provided
            airway bill number. Please check the number and try again.
          </AlertDescription>
        </Alert>
      );
    }

    const [status, location, dateTime] = data.latest_milestone.split(",");

    const fadeInUp = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {status && location && dateTime && (
          <Card className="my-6 overflow-hidden">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700">Shipment Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <motion.div
                className="space-y-4"
                initial="initial"
                animate="animate"
                variants={{
                  animate: { transition: { staggerChildren: 0.1 } },
                }}
              >
                <motion.div
                  className="flex items-center space-x-2"
                  {...fadeInUp}
                >
                  <Package className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">LR Number:</span>
                  <span>{data.awb_number}</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2"
                  {...fadeInUp}
                >
                  <Package className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">AWB Number:</span>
                  <span>{data.shipment.awbNumber}</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2"
                  {...fadeInUp}
                >
                  <Package className="h-6 w-6 text-blue-500" />
                  <span className="font-medium">Customer Name:</span>
                  <span>{data.customer_name}</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2"
                  {...fadeInUp}
                >
                  <Package className="h-6 w-6 text-blue-500" />
                  <span className="font-medium">Courier Name:</span>
                  <span>{data.shipment.courierProvider}</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2"
                  {...fadeInUp}
                >
                  <Badge variant="outline" className="text-sm font-normal">
                    {status ?? data.shipment?.status}
                  </Badge>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-2"
                  {...fadeInUp}
                >
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Location:</span>
                  <span>{location}</span>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-2"
                  {...fadeInUp}
                >
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Last Updated:</span>
                  <span>
                    {moment(new Date(dateTime ?? "")).format(
                      "DD MMMM YYYY hh:mm:ss A",
                    )}
                  </span>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        )}

        <ScrollArea className="h-[300px] pr-4">
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-200" />
            {data.milestones?.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative mb-8 pl-12"
              >
                <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                  {index === (data.milestones?.length ?? 0) - 1 ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <Milestone className="text-blue-500" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-700">
                    {milestone.message}{" "}
                    {milestone.location && `at ${milestone.location}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {moment(new Date(milestone.time)).format(
                      "Do MMMM YYYY hh:mm A",
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        <motion.div
          className="mt-6 h-2 overflow-hidden rounded-full bg-blue-100"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            className="h-full rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{
              width: `${((data.milestones?.length ?? 0) / 5) * 100}%`,
            }}
            transition={{ duration: 1, delay: 1 }}
          />
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="mx-auto flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <Card className="w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl">
        <div className="flex flex-col md:flex-row">
          <div className="bg-blue-600 p-8 text-white md:w-1/3">
            <Package size={64} className="mb-6" />
            <CardTitle className="mb-4 text-3xl font-bold">
              Package Tracking
            </CardTitle>
            <CardDescription className="text-lg text-blue-100">
              Track your package&apos;s journey in real-time
            </CardDescription>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <Input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter airway bill number"
                required
                className="border-blue-400 bg-blue-500 text-white placeholder-blue-200"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-white text-blue-600 hover:bg-blue-100"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin duration-500" />
                    <span>Tracking...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Track</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>
          </div>
          <CardContent className="p-8 md:w-2/3">
            <h2 className="mb-6 text-2xl font-bold text-blue-700">
              Tracking Information
            </h2>
            <AnimatePresence>{renderContent()}</AnimatePresence>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default TrackingWithId;
