export interface CreateSingleTrackingParams {
  note?: string;
  title?: string;
  language?: string;
  courier_code: string;
  order_number?: string;
  customer_name?: string;
  tracking_number: string;
}

export interface CreateBulkTrackingResponse {
  data: {
    error: {
      id: string;
      errorCode: string;
      courier_code: string;
      errorMessage: string;
      tracking_number: string;
    }[];
    success: {
      id: string;
      courier_code: string;
      tracking_number: string;
    }[];
  };
  meta: {
    code: number;
    message: string;
  };
}

export interface CreateTrackingResponse {
  meta: {
    code: number;
    message: string;
  };
  data: TrackingItem;
}

export interface GetAllTrackingsResponse {
  meta: {
    code: number; // e.g., 200
    message: string; // e.g., "Request response is successful"
  };
  data: TrackingItem[];
}

export interface GetFilteredTrackingsResponse {
  meta: {
    code: number; // e.g., 200
    message: string; // e.g., "Request response is successful"
  };
  data: TrackingItem[];
}

export interface TrackingItem {
  id: string;
  tracking_number: string;
  courier_code: string;
  order_number?: string | null;
  order_date?: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  delivery_status:
    | "inforeceived"
    | "transit"
    | "pickup"
    | "undelivered"
    | "delivered"
    | "exception"
    | "expired"
    | "notfound"
    | "pending"; // e.g., "pending", "transit", "inforeceived"
  archived: string; // e.g., "tracking"
  updating: boolean;
  source: string; // e.g., "API"
  destination_country?: string | null;
  destination_state?: string | null;
  destination_city?: string | null;
  origin_country?: string | null;
  origin_state?: string | null;
  origin_city?: string | null;
  tracking_postal_code?: string | null;
  tracking_ship_date?: string | null;
  tracking_destination_country?: string | null;
  tracking_origin_country?: string | null;
  tracking_key?: string | null;
  tracking_courier_account?: string | null;
  customer_name: string;
  customer_email?: string | null;
  customer_sms?: string | null;
  recipient_postcode?: string | null;
  order_id?: string | null;
  title: string;
  logistics_channel?: string | null;
  note?: string | null;
  label?: string | null;
  signed_by?: string | null;
  service_code?: string | null;
  weight?: number | null;
  weight_kg?: number | null;
  product_type?: string | null;
  pieces?: number | null;
  dimension?: string | null; // e.g., "0*0*0"
  previously?: string | null;
  destination_track_number?: string | null;
  exchange_number?: string | null;
  scheduled_delivery_date?: string | null;
  scheduled_address?: string | null;
  substatus: string; // e.g., "pending002"
  status_info?: string | null;
  latest_event?: string | null;
  latest_checkpoint_time?: string | null; // ISO date string
  transit_time: number; // in days
  origin_info: OriginInfo;
  destination_info: DestinationInfo;
}

export interface OriginInfo {
  courier_code: string;
  courier_phone?: string | null;
  weblink?: string | null;
  reference_number?: string | null;
  milestone_date: MilestoneDate;
  pickup_date?: string | null;
  departed_airport_date?: string | null;
  arrived_abroad_date?: string | null;
  customs_received_date?: string | null;
  trackinfo: TrackInfo[];
}

export interface DestinationInfo {
  courier_code?: string | null;
  courier_phone?: string | null;
  weblink?: string | null;
  reference_number?: string | null;
  milestone_date: MilestoneDate;
  pickup_date?: string | null;
  departed_airport_date?: string | null;
  arrived_abroad_date?: string | null;
  customs_received_date?: string | null;
  trackinfo: TrackInfo[];
}

export interface MilestoneDate {
  inforeceived_date?: string | null; // ISO date string
  pickup_date?: string | null; // ISO date string
  outfordelivery_date?: string | null; // ISO date string
  delivery_date?: string | null; // ISO date string
  returning_date?: string | null; // ISO date string
  returned_date?: string | null; // ISO date string
}

export interface TrackInfo {
  checkpoint_date: string; // ISO date string
  checkpoint_delivery_status: string;
  checkpoint_delivery_substatus: string;
  tracking_detail: string;
  location?: string | null;
  country_iso2?: string | null;
  state?: string | null;
  city?: string | null;
  zip?: string | null;
  raw_status?: string | null;
}

export interface DeleteApiResponse {
  meta: Meta;
  data: Data;
}

interface Meta {
  code: number;
  message: string;
}

interface Data {
  id: string;
  tracking_number: string;
  courier_code: string;
}
