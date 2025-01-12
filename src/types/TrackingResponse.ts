export interface TrackingResponse {
  data: Data;
}

export interface Data {
  trackings: Tracking[];
}

export interface Tracking {
  shipment: Shipment;
  events: TrackingEvent[];
  statistics: Statistics;
}

export interface Shipment {
  shipmentId: string;
  statusCode: string;
  statusCategory: string;
  statusMilestone: string;
  originCountryCode: string;
  destinationCountryCode: string;
  delivery: Delivery;
  trackingNumbers: TrackingNumber[];
  recipient: Recipient;
}

export interface Delivery {
  estimatedDeliveryDate: string | null;
  service: string | null;
  signedBy: string | null;
}

export interface TrackingNumber {
  tn: string;
}

export interface Recipient {
  name: string | null;
  address: string | null;
  postCode: string;
  city: string | null;
  subdivision: string | null;
}

export interface TrackingEvent {
  eventId: string;
  trackingNumber: string;
  eventTrackingNumber: string;
  status: string;
  occurrenceDatetime: string;
  order: string | null;
  location: string;
  sourceCode: string;
  courierCode: string;
  statusCode: string | null;
  statusCategory: string | null;
  statusMilestone: string;
}

export interface Statistics {
  timestamps: Timestamps;
}

export interface Timestamps {
  infoReceivedDatetime: string;
  inTransitDatetime: string;
  outForDeliveryDatetime: string;
  failedAttemptDatetime: string | null;
  availableForPickupDatetime: string | null;
  exceptionDatetime: string | null;
  deliveredDatetime: string;
}
