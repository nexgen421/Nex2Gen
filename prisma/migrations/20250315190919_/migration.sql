-- CreateTable
CREATE TABLE "Tracking" (
    "id" SERIAL NOT NULL,
    "awbNumber" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "phone" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "countryCode" TEXT,
    "pickupdate" TEXT,
    "currentStatus" TEXT,
    "from" TEXT,
    "to" TEXT,
    "statusTime" TIMESTAMP(3),
    "orderData" TEXT,
    "carrier" TEXT,
    "carrierId" INTEGER,
    "receivedBy" TEXT,
    "currentStatusDesc" TEXT,
    "trackingUrl" TEXT,
    "callbackUrl" TEXT,
    "webhookSentDate" TIMESTAMP(3),
    "extraFields" JSONB,
    "scans" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tracking_orderId_idx" ON "Tracking"("orderId");

-- CreateIndex
CREATE INDEX "Tracking_awbNumber_idx" ON "Tracking"("awbNumber");
