/*
  Warnings:

  - You are about to drop the column `aadharBackUrl` on the `KycDetails` table. All the data in the column will be lost.
  - You are about to drop the column `aadharFrontUrl` on the `KycDetails` table. All the data in the column will be lost.
  - You are about to drop the column `panUrl` on the `KycDetails` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `breadth` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerMobile` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `famousLandmark` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `physicalWeight` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `returnAddressSame` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Order` table. All the data in the column will be lost.
  - The `orderId` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `BankDetails` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `PickupLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiftyKgPrice` to the `RateList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fortyFiveKgPrice` to the `RateList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fortyKgPrice` to the `RateList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sevenKgPrice` to the `RateList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seventeenKgPrice` to the `RateList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thirtyFiveKgPrice` to the `RateList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twelveKgPrice` to the `RateList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twentyEightKgPrice` to the `RateList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twentyTwoKgPrice` to the `RateList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourierType" AS ENUM ('DELHIVERY', 'ECOMEXPRESS', 'XPRESSBEES', 'SHADOWFAX');

-- CreateEnum
CREATE TYPE "CourierRole" AS ENUM ('PICKUP_BOY_1', 'PICKUP_BOY_2', 'PICKUP_BOY_3', 'PICKUP_BOY_4', 'HUB_INCHARGE', 'ZONAL_SALES_MANAGER');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('INFORECEIVED', 'TRANSIT', 'PICKUP', 'UNDELIVERED', 'DELIVERED', 'EXCEPTION', 'EXPIRED', 'NOTFOUND', 'PENDING');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "BankDetails" DROP CONSTRAINT "BankDetails_kycDetailId_fkey";

-- DropIndex
DROP INDEX "Order_orderId_key";

-- DropIndex
DROP INDEX "Order_pincode_city_state_idx";

-- AlterTable
ALTER TABLE "KycDetails" DROP COLUMN "aadharBackUrl",
DROP COLUMN "aadharFrontUrl",
DROP COLUMN "panUrl";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address",
DROP COLUMN "breadth",
DROP COLUMN "city",
DROP COLUMN "customerEmail",
DROP COLUMN "customerMobile",
DROP COLUMN "customerName",
DROP COLUMN "famousLandmark",
DROP COLUMN "height",
DROP COLUMN "length",
DROP COLUMN "physicalWeight",
DROP COLUMN "pincode",
DROP COLUMN "returnAddressSame",
DROP COLUMN "state",
DROP COLUMN "orderId",
ADD COLUMN     "orderId" SERIAL NOT NULL,
ALTER COLUMN "orderValue" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "PickupLocation" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RateList" ADD COLUMN     "fiftyKgPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fortyFiveKgPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fortyKgPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sevenKgPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "seventeenKgPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "thirtyFiveKgPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "twelveKgPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "twentyEightKgPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "twentyTwoKgPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "latestEvent" TEXT,
ADD COLUMN     "status" "ShipmentStatus" NOT NULL,
ADD COLUMN     "subStatus" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SupportTicket" ALTER COLUMN "userAwbNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "reason" TEXT NOT NULL,
ADD COLUMN     "walletReferenceId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mobile" TEXT;

-- AlterTable
ALTER TABLE "WalletRequest" ADD COLUMN     "status" TEXT;

-- DropTable
DROP TABLE "BankDetails";

-- CreateTable
CREATE TABLE "DefaultRate" (
    "id" TEXT NOT NULL,
    "halfKgPrice" DOUBLE PRECISION NOT NULL,
    "oneKgPrice" DOUBLE PRECISION NOT NULL,
    "twoKgPrice" DOUBLE PRECISION NOT NULL,
    "threeKgPrice" DOUBLE PRECISION NOT NULL,
    "fiveKgPrice" DOUBLE PRECISION NOT NULL,
    "sevenKgPrice" DOUBLE PRECISION NOT NULL,
    "tenKgPrice" DOUBLE PRECISION NOT NULL,
    "twelveKgPrice" DOUBLE PRECISION NOT NULL,
    "fifteenKgPrice" DOUBLE PRECISION NOT NULL,
    "seventeenKgPrice" DOUBLE PRECISION NOT NULL,
    "twentyKgPrice" DOUBLE PRECISION NOT NULL,
    "twentyTwoKgPrice" DOUBLE PRECISION NOT NULL,
    "twentyFiveKgPrice" DOUBLE PRECISION NOT NULL,
    "twentyEightKgPrice" DOUBLE PRECISION NOT NULL,
    "thirtyKgPrice" DOUBLE PRECISION NOT NULL,
    "thirtyFiveKgPrice" DOUBLE PRECISION NOT NULL,
    "fortyKgPrice" DOUBLE PRECISION NOT NULL,
    "fortyFiveKgPrice" DOUBLE PRECISION NOT NULL,
    "fiftyKgPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DefaultRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourierContacts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CourierContacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourierContactDetails" (
    "id" TEXT NOT NULL,
    "courierType" "CourierType" NOT NULL,
    "role" "CourierRole" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "courierContactsId" TEXT NOT NULL,

    CONSTRAINT "CourierContactDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVerificationDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT,

    CONSTRAINT "UserVerificationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AadharInfo" (
    "id" TEXT NOT NULL,
    "aadharNumber" TEXT NOT NULL,
    "holderName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kycDetailsId" TEXT NOT NULL,

    CONSTRAINT "AadharInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanInfo" (
    "id" TEXT NOT NULL,
    "panNumber" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "holderName" TEXT NOT NULL,
    "kycDetailsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PanInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefundRequest" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RefundRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderAddressDetails" (
    "id" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "streetName" TEXT NOT NULL,
    "famousLandmark" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderAddressDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderCustomerDetails" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerMobile" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderCustomerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageDetails" (
    "id" TEXT NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "breadth" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "physicalWeight" DOUBLE PRECISION NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "PackageDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPromoCode" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "promoCodeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourierContacts_userId_key" ON "CourierContacts"("userId");

-- CreateIndex
CREATE INDEX "CourierContacts_userId_idx" ON "CourierContacts"("userId");

-- CreateIndex
CREATE INDEX "CourierContactDetails_courierType_idx" ON "CourierContactDetails"("courierType");

-- CreateIndex
CREATE INDEX "CourierContactDetails_role_idx" ON "CourierContactDetails"("role");

-- CreateIndex
CREATE UNIQUE INDEX "UserVerificationDetails_userId_key" ON "UserVerificationDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AadharInfo_aadharNumber_key" ON "AadharInfo"("aadharNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AadharInfo_kycDetailsId_key" ON "AadharInfo"("kycDetailsId");

-- CreateIndex
CREATE INDEX "AadharInfo_kycDetailsId_idx" ON "AadharInfo"("kycDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "PanInfo_panNumber_key" ON "PanInfo"("panNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PanInfo_kycDetailsId_key" ON "PanInfo"("kycDetailsId");

-- CreateIndex
CREATE INDEX "PanInfo_kycDetailsId_idx" ON "PanInfo"("kycDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderAddressDetails_orderId_key" ON "OrderAddressDetails"("orderId");

-- CreateIndex
CREATE INDEX "OrderAddressDetails_id_idx" ON "OrderAddressDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "OrderCustomerDetails_orderId_key" ON "OrderCustomerDetails"("orderId");

-- CreateIndex
CREATE INDEX "OrderCustomerDetails_id_idx" ON "OrderCustomerDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PackageDetails_orderId_key" ON "PackageDetails"("orderId");

-- CreateIndex
CREATE INDEX "PackageDetails_id_idx" ON "PackageDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

-- CreateIndex
CREATE INDEX "PromoCode_isActive_idx" ON "PromoCode"("isActive");

-- CreateIndex
CREATE INDEX "Order_orderId_idx" ON "Order"("orderId");

-- AddForeignKey
ALTER TABLE "CourierContacts" ADD CONSTRAINT "CourierContacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourierContactDetails" ADD CONSTRAINT "CourierContactDetails_courierContactsId_fkey" FOREIGN KEY ("courierContactsId") REFERENCES "CourierContacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVerificationDetails" ADD CONSTRAINT "UserVerificationDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AadharInfo" ADD CONSTRAINT "AadharInfo_kycDetailsId_fkey" FOREIGN KEY ("kycDetailsId") REFERENCES "KycDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanInfo" ADD CONSTRAINT "PanInfo_kycDetailsId_fkey" FOREIGN KEY ("kycDetailsId") REFERENCES "KycDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundRequest" ADD CONSTRAINT "RefundRequest_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAddressDetails" ADD CONSTRAINT "OrderAddressDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCustomerDetails" ADD CONSTRAINT "OrderCustomerDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageDetails" ADD CONSTRAINT "PackageDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPromoCode" ADD CONSTRAINT "UserPromoCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPromoCode" ADD CONSTRAINT "UserPromoCode_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
