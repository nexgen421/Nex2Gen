/*
  Warnings:

  - You are about to drop the column `aadharCard` on the `KycDetails` table. All the data in the column will be lost.
  - You are about to drop the column `gstCertificate` on the `KycDetails` table. All the data in the column will be lost.
  - You are about to drop the column `panDetails` on the `KycDetails` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `approved` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dbOrderId]` on the table `Shipment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trackingId]` on the table `Shipment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderPaymentDetailsId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountHolderName` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountType` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blankChequeUrl` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ifscCode` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aadharBackUrl` to the `KycDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aadharFrontUrl` to the `KycDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `panUrl` to the `KycDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `breadth` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderCategory` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderValue` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `physicalWeight` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupLocationId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `pincode` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `courierProvider` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dbOrderId` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackingId` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `Shipment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('CLOSED', 'RESOLVED', 'OPEN');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('CURRENT', 'SAVINGS');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('BOOKED', 'READY_TO_SHIP');

-- DropForeignKey
ALTER TABLE "BankDetails" DROP CONSTRAINT "BankDetails_kycDetailId_fkey";

-- DropForeignKey
ALTER TABLE "KycDetails" DROP CONSTRAINT "KycDetails_userId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_walletId_fkey";

-- DropIndex
DROP INDEX "Shipment_awbNumber_key";

-- AlterTable
ALTER TABLE "BankDetails" ADD COLUMN     "accountHolderName" TEXT NOT NULL,
ADD COLUMN     "accountType" "BankAccountType" NOT NULL,
ADD COLUMN     "bankName" TEXT NOT NULL,
ADD COLUMN     "blankChequeUrl" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ifscCode" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "KycDetails" DROP COLUMN "aadharCard",
DROP COLUMN "gstCertificate",
DROP COLUMN "panDetails",
ADD COLUMN     "aadharBackUrl" TEXT NOT NULL,
ADD COLUMN     "aadharFrontUrl" TEXT NOT NULL,
ADD COLUMN     "panUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "breadth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "isInsured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "length" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "orderCategory" TEXT NOT NULL,
ADD COLUMN     "orderValue" INTEGER NOT NULL,
ADD COLUMN     "physicalWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pickupLocationId" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "returnAddressSame" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'BOOKED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "pincode",
ADD COLUMN     "pincode" INTEGER NOT NULL,
ALTER COLUMN "orderId" DROP NOT NULL,
ALTER COLUMN "paymentMode" SET DEFAULT 'PREPAID';

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "adminId",
DROP COLUMN "provider",
DROP COLUMN "updatedAt",
ADD COLUMN     "courierProvider" TEXT NOT NULL,
ADD COLUMN     "dbOrderId" TEXT NOT NULL,
ADD COLUMN     "trackingId" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "orderPaymentDetailsId" TEXT,
ADD COLUMN     "type" "TransactionType" NOT NULL DEFAULT 'DEBIT',
ALTER COLUMN "walletId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "approved",
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isKycSubmitted" BOOLEAN NOT NULL DEFAULT false;
-- ADD COLUMN     "mobile" text,

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "currentBalance" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "RateList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "halfKgPrice" DOUBLE PRECISION NOT NULL,
    "oneKgPrice" DOUBLE PRECISION NOT NULL,
    "twoKgPrice" DOUBLE PRECISION NOT NULL,
    "threeKgPrice" DOUBLE PRECISION NOT NULL,
    "fiveKgPrice" DOUBLE PRECISION NOT NULL,
    "tenKgPrice" DOUBLE PRECISION NOT NULL,
    "fifteenKgPrice" DOUBLE PRECISION NOT NULL,
    "twentyKgPrice" DOUBLE PRECISION NOT NULL,
    "twentyFiveKgPrice" DOUBLE PRECISION NOT NULL,
    "thirtyKgPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RateList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" SERIAL NOT NULL,
    "userAwbNumber" INTEGER NOT NULL,
    "supportSubReasonId" INTEGER NOT NULL,
    "ticketStatus" "TicketStatus" NOT NULL,
    "issue" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "intervenerId" TEXT,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportConversation" (
    "id" SERIAL NOT NULL,
    "supportTicketId" INTEGER NOT NULL,

    CONSTRAINT "SupportConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportReason" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SupportReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportSubReason" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "supportReasonId" INTEGER NOT NULL,

    CONSTRAINT "SupportSubReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyInfo" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyContactNumber" TEXT NOT NULL,
    "companyType" TEXT NOT NULL,
    "kycDetailId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderPaymentDetails" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderPaymentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAwbDetails" (
    "id" SERIAL NOT NULL,
    "awbNumber" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "UserAwbDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickupLocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "famousLandmark" TEXT,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PickupLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderPricing" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateShipment" (
    "id" TEXT NOT NULL,
    "awbNumber" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "orderPricing" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateShipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletRequest" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RateList_userId_key" ON "RateList"("userId");

-- CreateIndex
CREATE INDEX "RateList_userId_idx" ON "RateList"("userId");

-- CreateIndex
CREATE INDEX "SupportTicket_userAwbNumber_idx" ON "SupportTicket"("userAwbNumber");

-- CreateIndex
CREATE INDEX "SupportTicket_supportSubReasonId_idx" ON "SupportTicket"("supportSubReasonId");

-- CreateIndex
CREATE INDEX "SupportTicket_userId_idx" ON "SupportTicket"("userId");

-- CreateIndex
CREATE INDEX "SupportTicket_ticketStatus_idx" ON "SupportTicket"("ticketStatus");

-- CreateIndex
CREATE INDEX "SupportTicket_timestamp_idx" ON "SupportTicket"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "SupportConversation_supportTicketId_key" ON "SupportConversation"("supportTicketId");

-- CreateIndex
CREATE INDEX "SupportConversation_supportTicketId_idx" ON "SupportConversation"("supportTicketId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_sentAt_idx" ON "Message"("sentAt");

-- CreateIndex
CREATE INDEX "SupportReason_title_idx" ON "SupportReason"("title");

-- CreateIndex
CREATE INDEX "SupportSubReason_supportReasonId_idx" ON "SupportSubReason"("supportReasonId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyInfo_kycDetailId_key" ON "CompanyInfo"("kycDetailId");

-- CreateIndex
CREATE INDEX "CompanyInfo_kycDetailId_idx" ON "CompanyInfo"("kycDetailId");

-- CreateIndex
CREATE INDEX "CompanyInfo_companyName_idx" ON "CompanyInfo"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "OrderPaymentDetails_orderId_key" ON "OrderPaymentDetails"("orderId");

-- CreateIndex
CREATE INDEX "OrderPaymentDetails_orderId_idx" ON "OrderPaymentDetails"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAwbDetails_awbNumber_key" ON "UserAwbDetails"("awbNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserAwbDetails_orderId_key" ON "UserAwbDetails"("orderId");

-- CreateIndex
CREATE INDEX "UserAwbDetails_awbNumber_idx" ON "UserAwbDetails"("awbNumber");

-- CreateIndex
CREATE INDEX "UserAwbDetails_orderId_idx" ON "UserAwbDetails"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PickupLocation_userId_key" ON "PickupLocation"("userId");

-- CreateIndex
CREATE INDEX "PickupLocation_userId_idx" ON "PickupLocation"("userId");

-- CreateIndex
CREATE INDEX "PickupLocation_pincode_city_state_idx" ON "PickupLocation"("pincode", "city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "OrderPricing_orderId_key" ON "OrderPricing"("orderId");

-- CreateIndex
CREATE INDEX "OrderPricing_orderId_idx" ON "OrderPricing"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateShipment_awbNumber_key" ON "PrivateShipment"("awbNumber");

-- CreateIndex
CREATE INDEX "PrivateShipment_adminId_idx" ON "PrivateShipment"("adminId");

-- CreateIndex
CREATE INDEX "PrivateShipment_awbNumber_idx" ON "PrivateShipment"("awbNumber");

-- CreateIndex
CREATE INDEX "PrivateShipment_provider_idx" ON "PrivateShipment"("provider");

-- CreateIndex
CREATE INDEX "WalletRequest_walletId_idx" ON "WalletRequest"("walletId");

-- CreateIndex
CREATE INDEX "WalletRequest_isApproved_idx" ON "WalletRequest"("isApproved");

-- CreateIndex
CREATE INDEX "WalletRequest_createdAt_idx" ON "WalletRequest"("createdAt");

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_approved_idx" ON "Admin"("approved");

-- CreateIndex
CREATE INDEX "BankDetails_kycDetailId_idx" ON "BankDetails"("kycDetailId");

-- CreateIndex
CREATE INDEX "BankDetails_bankName_ifscCode_idx" ON "BankDetails"("bankName", "ifscCode");

-- CreateIndex
CREATE INDEX "KycDetails_userId_idx" ON "KycDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_orderId_idx" ON "Order"("orderId");

-- CreateIndex
CREATE INDEX "Order_orderDate_idx" ON "Order"("orderDate");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_pickupLocationId_idx" ON "Order"("pickupLocationId");

-- CreateIndex
CREATE INDEX "Order_pincode_city_state_idx" ON "Order"("pincode", "city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_dbOrderId_key" ON "Shipment"("dbOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_trackingId_key" ON "Shipment"("trackingId");

-- CreateIndex
CREATE INDEX "Shipment_dbOrderId_idx" ON "Shipment"("dbOrderId");

-- CreateIndex
CREATE INDEX "Shipment_awbNumber_idx" ON "Shipment"("awbNumber");

-- CreateIndex
CREATE INDEX "Shipment_trackingId_idx" ON "Shipment"("trackingId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_orderPaymentDetailsId_key" ON "Transaction"("orderPaymentDetailsId");

-- CreateIndex
CREATE INDEX "Transaction_walletId_idx" ON "Transaction"("walletId");

-- CreateIndex
CREATE INDEX "Transaction_status_type_idx" ON "Transaction"("status", "type");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isApproved_isKycSubmitted_idx" ON "User"("isApproved", "isKycSubmitted");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- AddForeignKey
ALTER TABLE "RateList" ADD CONSTRAINT "RateList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userAwbNumber_fkey" FOREIGN KEY ("userAwbNumber") REFERENCES "UserAwbDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_supportSubReasonId_fkey" FOREIGN KEY ("supportSubReasonId") REFERENCES "SupportSubReason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_intervenerId_fkey" FOREIGN KEY ("intervenerId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportConversation" ADD CONSTRAINT "SupportConversation_supportTicketId_fkey" FOREIGN KEY ("supportTicketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "SupportConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportSubReason" ADD CONSTRAINT "SupportSubReason_supportReasonId_fkey" FOREIGN KEY ("supportReasonId") REFERENCES "SupportReason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycDetails" ADD CONSTRAINT "KycDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_kycDetailId_fkey" FOREIGN KEY ("kycDetailId") REFERENCES "KycDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyInfo" ADD CONSTRAINT "CompanyInfo_kycDetailId_fkey" FOREIGN KEY ("kycDetailId") REFERENCES "KycDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPaymentDetails" ADD CONSTRAINT "OrderPaymentDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_orderPaymentDetailsId_fkey" FOREIGN KEY ("orderPaymentDetailsId") REFERENCES "OrderPaymentDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pickupLocationId_fkey" FOREIGN KEY ("pickupLocationId") REFERENCES "PickupLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAwbDetails" ADD CONSTRAINT "UserAwbDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickupLocation" ADD CONSTRAINT "PickupLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_dbOrderId_fkey" FOREIGN KEY ("dbOrderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPricing" ADD CONSTRAINT "OrderPricing_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateShipment" ADD CONSTRAINT "PrivateShipment_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletRequest" ADD CONSTRAINT "WalletRequest_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
