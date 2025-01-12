"use client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber === "") {
      setError("Please enter a valid tracking number");
      return;
    }
    router.push(`/track/${trackingNumber}`);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="flex w-full overflow-hidden rounded-3xl shadow-2xl">
        <div className="flex w-1/2 flex-col items-center justify-center bg-blue-600 p-12 text-white">
          <Package size={120} className="mb-8" />
          <h2 className="mb-4 text-3xl font-bold">Track Your Package</h2>
          <p className="text-center text-lg">
            Enter your airway bill number and stay updated on your package&aposs
            journey.
          </p>
        </div>
        <Card className="w-1/2 border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-blue-700">
              Package Tracking
            </CardTitle>
            <CardDescription className="text-lg">
              Enter your airway bill number to track your package
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
              <Input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter airway bill number"
                required
                className="p-6 text-lg"
              />
              {error && <p className="text-red-500">{error}</p>}
              <Button
                type="submit"
                className="bg-blue-600 py-6 text-lg text-white hover:bg-blue-700"
              >
                Track My Package
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
