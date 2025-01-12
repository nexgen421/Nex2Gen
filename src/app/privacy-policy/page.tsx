"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "~/components/landing-page/Navbar";
import Footer from "~/components/layout/Footer";

const sections = [
  {
    title: "Introduction",
    content:
      "Welcome to Nex Gen Courier Service. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our services.",
  },
  {
    title: "Information We Collect",
    content:
      "We collect personal information (name, address, phone number, email), transaction information (delivery addresses, payment details), and usage data (IP addresses, browser types, pages visited).",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use your information to provide and manage our courier services, process payments, communicate with you, improve our services, and ensure legal compliance.",
  },
  {
    title: "Data Sharing and Disclosure",
    content:
      "We do not sell or rent your personal information. We may share information with service providers and legal authorities when required.",
  },
  {
    title: "Data Security",
    content:
      "We implement appropriate security measures to protect your personal data, but no method of transmission over the internet is 100% secure.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, update, delete your personal information, object to processing, and request a copy of your data.",
  },
  {
    title: "Cookies and Tracking Technologies",
    content:
      "We use cookies and similar technologies to enhance your experience. You can manage cookie preferences through your browser settings.",
  },
  {
    title: "Changes to This Privacy Policy",
    content:
      "We may update this policy from time to time. Changes will be posted on our website and effective immediately.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions or concerns, please contact us at support@nexgencourierservice.in.",
  },
];

export default function PrivacyPolicy() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 opacity-30"
          style={{
            filter: "blur(150px)",
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.h1
            className="mb-8 text-center text-3xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Privacy Policy
          </motion.h1>
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="mb-4 overflow-hidden rounded-lg bg-white bg-opacity-80 shadow-sm backdrop-blur-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                <h2 className="text-lg font-medium text-gray-900">
                  {section.title}
                </h2>
                {expandedIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              <motion.div
                initial={false}
                animate={{ height: expandedIndex === index ? "auto" : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-4 text-gray-600">{section.content}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
