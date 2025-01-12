import React from "react";
import { Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "~/components/ui/table";
import Navbar from "~/components/landing-page/Navbar";
import Footer from "~/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const PricingPage = () => {
  const pricingData = [
    { weight: "0.5kg", price: "₹40" },
    { weight: "1kg", price: "₹55" },
    { weight: "2kg", price: "₹75" },
    { weight: "3kg", price: "₹120" },
    { weight: "5kg", price: "₹180" },
    { weight: "7kg", price: "₹240" },
    { weight: "10kg", price: "₹320" },
    { weight: "12kg", price: "₹380" },
    { weight: "15kg", price: "₹435" },
    { weight: "17kg", price: "₹490" },
    { weight: "20kg", price: "₹550" },
    { weight: "22kg", price: "₹610" },
    { weight: "25kg", price: "₹665" },
    { weight: "27kg", price: "₹715" },
    { weight: "30kg", price: "₹750" },
    { weight: "35kg", price: "₹800" },
    { weight: "40kg", price: "₹875" },
    { weight: "45kg", price: "₹915" },
    { weight: "50kg", price: "₹950" },
  ];

  return (
    <>
      <Navbar />
      <section className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Transparent Pricing
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Fast, reliable, and affordable shipping rates for all your needs.
            </p>
          </div>
          <Card className="container mb-16">
            <CardHeader>
              <CardTitle>Pricing Table</CardTitle>
              <CardDescription>
                Here&apos;s the list of all the Weights we support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table className="w-full border">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Weight</TableHead>
                    <TableHead className="w-1/2">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.weight}
                      </TableCell>
                      <TableCell>{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Lightning-Fast Delivery",
                description:
                  "Get your packages delivered in record time with our efficient network.",
              },
              {
                title: "Real-Time Tracking",
                description:
                  "Stay informed with our advanced package tracking system.",
              },
              {
                title: "24/7 Customer Support",
                description:
                  "Our dedicated team is always here to assist you with any queries.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 rounded-full bg-primary/10 p-2">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PricingPage;
