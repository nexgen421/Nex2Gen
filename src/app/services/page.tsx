import React from "react";
import { Package, Check, Truck, Clock, ShieldCheck } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import Navbar from "~/components/landing-page/Navbar";
import Link from "next/link";
import Footer from "~/components/layout/Footer";

const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto min-h-[90vh] px-4 py-12">
        <section className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-800">
            Our Services
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Fast, Reliable, and Secure Courier Services
          </p>
          <p className="text-lg font-semibold text-blue-600">
            Specializing in safe and timely deliveries
          </p>
        </section>
        <section className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-white/30 p-6 shadow-lg backdrop-blur-md transition-all hover:shadow-xl">
            <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
              <Package className="mr-2 text-blue-600" />
              Our Offerings
            </h3>
            <ul className="space-y-2">
              {[
                "Only Pre-Paid Orders",
                "Minimum 300 Orders Monthly",
                "Zero Discrepancy Charges",
                "Zero RTO Charges",
                "Zero Extra Charges",
                "Zero Volumetric Charges",
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <Check className="mr-2 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-white/30 p-6 shadow-lg backdrop-blur-md transition-all hover:shadow-xl">
            <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
              <Truck className="mr-2 text-blue-600" />
              Why Choose Us?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Clock className="mr-2 mt-1 flex-shrink-0 text-blue-600" />
                <span>Fast and efficient delivery times</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck className="mr-2 mt-1 flex-shrink-0 text-blue-600" />
                <span>Secure handling of all packages</span>
              </li>
              <li className="flex items-start">
                <Package className="mr-2 mt-1 flex-shrink-0 text-blue-600" />
                <span>Transparent pricing with no hidden fees</span>
              </li>
            </ul>
          </div>
        </section>
        <section className="text-center">
          <h3 className="mb-4 text-2xl font-semibold text-gray-800">
            Ready to experience next-generation courier service?
          </h3>
          <Link href={buttonVariants({ size: "lg" })}>Get Started Now</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
