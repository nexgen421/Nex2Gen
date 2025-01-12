import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
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

async function main() {
  const reasons = await prisma.supportReason.findMany();

  if (reasons.length !== 0) {
    return;
  }

  for (const reason of reasonsWithSubReasons) {
    await prisma.supportReason.create({
      data: {
        title: reason.reason,
        description: reason.description,
        supportSubReasons: {
          createMany: {
            data: reason.subReasons.map((subReason) => {
              return {
                reason: subReason.reason,
                description: subReason.description,
              };
            }),
          },
        },
      },
    });
  }

  await prisma.user.create({
    data: {
      email: "testing@gmail.com",
      password: await bcrypt.hash("Getlost@007", 10),
      name: "testing",
      isApproved: true,
      isKycSubmitted: true,
      emailVerified: new Date(),
      wallet: {
        create: {},
      },
      pickupLocation: {
        create: {
          address: "testing address",
          city: "testing city",
          state: "testing state",
          pincode: 123456,
          famousLandmark: "testing landmark",
          contactName: "testing contact",
          mobileNumber: "1234567890",
          name: "testing location",
        },
      },
      rateList: {
        create: {
          halfKgPrice: 100,
          oneKgPrice: 200,
          threeKgPrice: 300,
          twoKgPrice: 300,
          fiveKgPrice: 400,
          tenKgPrice: 500,
          fifteenKgPrice: 600,
          twentyKgPrice: 700,
          thirtyKgPrice: 800,
          twentyFiveKgPrice: 1000,
          fiftyKgPrice: 1500,
          fortyFiveKgPrice: 2000,
          fortyKgPrice: 2500,
          seventeenKgPrice: 700,
          thirtyFiveKgPrice: 1200,
          sevenKgPrice: 400,
          twelveKgPrice: 500,
          twentyEightKgPrice: 1000,
          twentyTwoKgPrice: 800,
        },
      },
    },
  });

  await prisma.admin.create({
    data: {
      email: "admintesting@gmail.com",
      name: "Admin",
      mobile: "1234567890",
      password: await bcrypt.hash("Getlost@007", 10),
      approved: true,
      isOwner: true,
    },
  });
}

main()
  .then(async () => {
    console.log(`Database Seeded Successfully`);
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
