import React from "react";
import { IconDashboard } from "@tabler/icons-react";
import {
  Globe2Icon,
  Home,
  IndianRupeeIcon,
  SettingsIcon,
  TruckIcon,
  Weight,
  ShoppingCart,
  ListOrderedIcon,
  Printer,
  Calculator,
} from "lucide-react";
import {
  RiCustomerServiceLine,
  RiFilePaper2Line,
  RiMoneyRupeeCircleLine,
  RiBillFill,
} from "react-icons/ri";
import { TrainTrackIcon } from "lucide-react";
import { User2Icon } from "lucide-react";
import { UserCogIcon } from "lucide-react";
import {
  MdOutlineLocalShipping,
  MdPayments,
  MdSupportAgent,
  MdOutlinePayments,
  MdBikeScooter,
} from "react-icons/md";

export const adminSidebarMenu: {
  name: string;
  link: string;
  icon: React.ReactNode;
}[] = [
  {
    name: "Dashboard",
    link: "/admin/dashboard",
    icon: <IconDashboard className="h-6 w-6" />,
  },
  {
    name: "Orders",
    link: "/admin/order/dashboard",
    icon: <TruckIcon className="h-6 w-6" />,
  },
  {
    name: "Order Requests",
    link: "/admin/order/requests",
    icon: <Globe2Icon className="h-6 w-6" />,
  },
  {
    name: "All Orders",
    link: "/admin/order/allorder",
    icon: <ListOrderedIcon className="h-5 w-5" />,
  },
  {
    name: "Tracking Dashboard",
    link: "/admin/track/dashboard",
    icon: <TrainTrackIcon className="h-6 w-6" />,
  },
  {
    name: "Revenue Dashboard",
    link: "/admin/revenue",
    icon: <RiMoneyRupeeCircleLine className="h-6 w-6" />,
  },
  {
    name: "Label Maker",
    link: "/admin/label",
    icon: <RiFilePaper2Line className="h-6 w-6" />,
  },
  {
    name: "Users",
    link: "/admin/users",
    icon: <User2Icon className="h-6 w-6" />,
  },
  {
    name: "Employees",
    link: "/admin/employees",
    icon: <UserCogIcon className="h-6 w-6" />,
  },
  {
    name: "Support",
    link: "/admin/support",
    icon: <RiCustomerServiceLine className="h-6 w-6" />,
  },
  {
    name: "Payments",
    link: "/admin/payments",
    icon: <MdPayments className="h-6 w-6" />,
  },
  {
    name: "Payment History",
    link: "/admin/payment-history",
    icon: <MdOutlinePayments className="h-6 w-6" />,
  },
  {
    name: "Promotions",
    link: "/admin/promotions",
    icon: <ShoppingCart className="h-6 w-6" />,
  },
  {
    name: "Rates",
    link: "/admin/rates",
    icon: <Weight className="h-6 w-6" />,
  },
  {
    name: "Settings",
    link: "/admin/settings",
    icon: <SettingsIcon className="h-6 w-6" />,
  },
];

export const productCategories = [
  "Accesories",
  "Fashion & Clothing",
  "Books & Stationary",
  "Electronics",
  "FMCG",
  "Footwear",
  "Toys",
  "Sports Equiments",
  "Wellness",
  "Medicines",
  "Other",
];

// TODO: Create here
export const userSidebarMenu = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: <MdOutlineLocalShipping className="h-5 w-5" />,
  },
  {
    label: "Support",
    href: "/support",
    icon: <MdSupportAgent className="h-5 w-5" />,
  },
  {
    label: "Funds",
    href: "/funds",
    icon: <IndianRupeeIcon className="h-5 w-5" />,
  },
  {
    label: "Funds Requests",
    href: "/funds/requests",
    icon: <RiMoneyRupeeCircleLine className="h-5 w-5" />,
  },
  {
    label: "Bills",
    href: "/bill",
    icon: <RiBillFill className="h-5 w-5" />,
  },
  {
    label: "Rider Contact",
    href: "/rider-contact",
    icon: <MdBikeScooter className="h-5 w-5" />,
  },
  {
    label: "All Orders",
    href: "/orders/all",
    icon: <ListOrderedIcon className="h-5 w-5" />,
  },
  {
    label: "Print Label",
    href: "/print-label",
    icon: <Printer className="h-5 w-5" />,
  },
  {
    label: "Rate Calculator",
    href: "/rate-calculator",
    icon: <Calculator className="h-5 w-5" />,
  },
];

export const amountSuggestions = [
  {
    id: 1,
    amount: 500,
  },
  {
    id: 2,
    amount: 1000,
  },
  {
    id: 3,
    amount: 2000,
  },
];

export const reasonsWithSubReasons = [
  {
    reason: "Delivery Issues",
    description: "Problems related to the delivery of packages",
    subReasons: [
      {
        reason: "Late Delivery",
        description: "Package was delivered later than expected",
      },
      {
        reason: "Damaged Package",
        description: "Package arrived damaged and needs to be reported",
      },
      {
        reason: "Lost Package",
        description: "Package cannot be found or is missing",
      },
      {
        reason: "Wrong Address",
        description: "Package was delivered to the wrong address",
      },
      {
        reason: "No Delivery Attempt Made",
        description: "No delivery attempt was made despite being scheduled",
      },
      {
        reason: "Partial Delivery",
        description: "Only part of the shipment was delivered",
      },
    ],
  },
  {
    reason: "Tracking Issues",
    description: "Concerns regarding the tracking of packages",
    subReasons: [
      {
        reason: "Tracking Not Updating",
        description: "Tracking information is not being updated",
      },
      {
        reason: "Incorrect Tracking Information",
        description: "Tracking information is incorrect or misleading",
      },
      {
        reason: "Unable to Track Package",
        description: "User is unable to track their package online",
      },
      {
        reason: "Tracking Number Not Recognized",
        description:
          "The provided tracking number does not exist or is invalid",
      },
      {
        reason: "Status Not Changing",
        description: "Package status remains unchanged for a long period",
      },
    ],
  },
  {
    reason: "Account Issues",
    description: "Problems related to account management and access",
    subReasons: [
      {
        reason: "Forgot Password",
        description: "User forgot their account password and needs to reset it",
      },
      {
        reason: "Account Locked",
        description:
          "User account is locked due to multiple failed login attempts",
      },
      {
        reason: "Profile Update Issues",
        description: "User is unable to update their profile information",
      },
      {
        reason: "Email Verification",
        description: "User is not receiving the email verification link",
      },
      {
        reason: "Account Deactivation Request",
        description: "User wants to deactivate or delete their account",
      },
    ],
  },
  {
    reason: "Payment and Wallet Issues",
    description: "Issues related to payments and wallet balances",
    subReasons: [
      {
        reason: "Failed Payment",
        description: "Payment could not be processed successfully",
      },
      {
        reason: "Refund Request",
        description:
          "User requests a refund for a payment or wallet transaction",
      },
      {
        reason: "Wallet Balance Incorrect",
        description:
          "User’s wallet balance does not reflect recent transactions",
      },
      {
        reason: "Unable to Add Funds to Wallet",
        description:
          "User is unable to add funds to their wallet due to an error",
      },
      {
        reason: "Payment Method Not Accepted",
        description: "User’s payment method is not accepted by the service",
      },
      {
        reason: "Duplicate Charge",
        description: "User was charged twice for a single transaction",
      },
    ],
  },
  {
    reason: "General Inquiries",
    description: "General questions and information requests",
    subReasons: [
      {
        reason: "Service Information",
        description:
          "Questions about the courier services provided, including service area and delivery options",
      },
      {
        reason: "Pricing Information",
        description: "Questions about pricing, delivery costs, and fees",
      },
      {
        reason: "Promotions and Discounts",
        description:
          "Inquiries about ongoing promotions, discounts, and coupons",
      },
      {
        reason: "Partnership Inquiries",
        description:
          "Questions related to business partnerships and collaborations",
      },
      {
        reason: "COVID-19 Guidelines",
        description:
          "Information about safety measures and delivery changes due to COVID-19",
      },
    ],
  },
  {
    reason: "Technical Issues",
    description: "Problems related to the website or app functionality",
    subReasons: [
      {
        reason: "App Crashing",
        description: "The mobile app crashes frequently or does not load",
      },
      {
        reason: "Website Not Loading",
        description: "Website is slow or not loading properly",
      },
      {
        reason: "Notification Issues",
        description: "User is not receiving important notifications or alerts",
      },
      {
        reason: "Error Messages",
        description: "User encounters error messages while using the service",
      },
      {
        reason: "Login Issues",
        description:
          "User is unable to log into their account due to a technical issue",
      },
    ],
  },
  {
    reason: "Feedback and Complaints",
    description:
      "Users providing feedback or lodging complaints about the service",
    subReasons: [
      {
        reason: "Service Quality",
        description:
          "Feedback on the quality of service provided by the courier",
      },
      {
        reason: "Customer Support Experience",
        description: "Feedback about the experience with customer support",
      },
      {
        reason: "Suggestions for Improvement",
        description: "User suggestions on how to improve the service",
      },
      {
        reason: "Report a Courier",
        description:
          "User wants to report a courier for misconduct or poor service",
      },
    ],
  },
];

export const SUBSTATUS = {
  inforeceived001: "The package is waiting for carrier to pick up",
  transit001: "Package is on the way to destination",
  transit002: "Package arrived at a hub or sorting center",
  transit003: "Package arrived at delivery facility",
  transit004: "Package arrived at destination country",
  transit005: "Customs clearance completed",
  transit006: "Item Dispatched",
  transit007: "Depart from Airport",
  pickup001: "The package is out for delivery",
  pickup002: "The package is ready for collection",
  pickup003: "The addressee is contacted before the final delivery",
  delivered001: "Package delivered successfully",
  delivered002: "Package picked up by the addressee",
  delivered003: "Package received and signed by addressee",
  delivered004:
    "Package was left at the front door or left with your neighbour",
  undelivered001: "Address-related issues",
  undelivered002: "Receiver not home",
  undelivered003: "Failed to contact the addressee",
  undelivered004: "Undelivered due to other reasons",
  exception004: "The package is unclaimed",
  exception005: "Other exceptions",
  exception006: "Package was detained by customs",
  exception007: "Package was lost or damaged during delivery",
  exception008:
    "Logistics order was cancelled before carrier pick up the package",
  exception009: "Package was refused by addressee",
  exception010: "Package has been returned to sender",
  exception011: "Package is being returning to sender",
  notfound002: "(Legacy) No tracking information found",
  pending001:
    "No information yet. Tracking details will be available once provided by the carrier.(The same with notfound002)",
  pending002:
    "No information yet and TrackingMore itself has determined that The format of this tracking number may not match the carrier. Please check your tracking number or carrier's name.",
  pending003:
    "The assigned carrier itself explicitly states that the tracking number doesn't belong to it. Please check your tracking number or carrier's name.",
  pending004:
    "The order has been processed/packaged, but not scanned at a shipping facility yet.",
  pending005:
    "There has been no information for certain days.(dhl, fedex, royal-mail, australia-post: 7 days. Others: 35 days)",
  expired001:
    "The last track of the package has not been updated for 30 days. When this happens, please contact the carrier for more details.",
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const years = [
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "2031",
  "2032",
  "2033",
  "2034",
  "2035",
];
