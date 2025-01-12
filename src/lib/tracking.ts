import axios from "axios";
import { env } from "~/env";
import { type Tracking } from "~/types/TrackingResponse";

export async function getShipmentStatus(awbNumber: string) {
  const response = await axios.get<{ status: string }>(
    `${env.TRACKING_BACKEND_URL}/track/status/${awbNumber}`,
  );
  return response.data;
}

export async function getTrackingInfo(
  awbNumber: string,
  courierProvider?: string,
) {
  const response = await axios.post<{
    awbNumber: string;
    data: Tracking;
    createdAt: Date;
    courierProvider: string;
  }>(`${env.TRACKING_BACKEND_URL}/track/raw/${awbNumber}`, {
    courierProvider: courierProvider,
  });

  return response.data;
}
