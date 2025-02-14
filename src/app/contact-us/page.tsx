"use client";

import React from "react";
import { Phone, Globe, MessageCircle, MapPin } from "lucide-react";
import Navbar from "~/components/landing-page/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "~/lib/utils";
import Footer from "~/components/layout/Footer";

const ContactPage = () => {
  const contactInfo = [
    { icon: Phone, text: "Call us at: +91 11 6965 3981 " },
    { icon: Globe, text: "Visit: nexgencourierservice.in" },
    {
      icon: MessageCircle,
      text: "Message us directly on WhatsApp to book now!",
    },
  ];

  return (
    <>
      <Navbar />
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Get in Touch
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We&apos;re here to help. Reach out to us through any of the
              following methods.
            </p>
          </motion.div>
          <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-3">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col items-center text-center"
              >
                <div className="mb-6 rounded-full bg-white p-4 shadow-lg transition-all duration-300 group-hover:bg-primary/10">
                  <item.icon className="h-8 w-8 text-primary transition-colors duration-300 group-hover:text-primary/80" />
                </div>
                <p className="text-lg font-medium text-gray-800">{item.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-20 overflow-hidden rounded-xl bg-white p-8 shadow-xl"
          >
            <div className="flex items-start">
              <MapPin className="mr-6 h-8 w-8 flex-shrink-0 text-primary" />
              <div>
                <h3 className="mb-3 text-2xl font-semibold text-gray-900">
                  Our Address
                </h3>
                <p className="mt-3 w-full text-left text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Corporate Address: </span>
                  395-A Chauhan Mohhala Madanpur Khadar
                  <br />
                  Sarita Vihar
                  <br />
                  <span className="font-medium">Pincode:</span> 110076
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <Link
              href="https://wa.aisensy.com/9LpM1r"
              className={cn(
                "rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              )}
            >
              Send Us a Message
            </Link>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactPage;
