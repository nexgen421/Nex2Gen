import type { Order, PickupLocation, Shipment } from "@prisma/client";

export type GeneralizedTrackingDetail = {
  date: number;
  location: string;
  status: string;
};

export type GeneralizedShipmentResponse = {
  expectedDeliveryDate: Date;
  receiverName: string;
  merchantName: string;
  sourceCity: string;
  destinationCity: string;
  shipmentTrackingDetails: GeneralizedTrackingDetail[];
};

export interface ExtendedPickupLocation extends PickupLocation {
  name: string;
}

export interface ExtendedOrder extends Order {
  pickupLocation: ExtendedPickupLocation;
  shipment: Shipment | null;
}

export type DocumentType = "aadhar-front" | "pan" | "cheque" | "aadhar-back";
