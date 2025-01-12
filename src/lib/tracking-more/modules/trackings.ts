import {
  type DeleteApiResponse,
  type CreateBulkTrackingResponse,
  type CreateSingleTrackingParams,
  type CreateTrackingResponse,
  type GetAllTrackingsResponse,
  type GetFilteredTrackingsResponse,
} from "./types";
import axios, { isAxiosError } from "axios";

class Trackings {
  apiKey: string;
  apiBaseUrl: string;

  constructor(apiKey: string) {
    if (apiKey.length === 0) {
      throw new Error("Api Key is Missing");
    }
    this.apiKey = apiKey;
    this.apiBaseUrl = "https://api.trackingmore.com/v4/trackings";
  }

  async createTracking(
    params: CreateSingleTrackingParams,
  ): Promise<CreateTrackingResponse | undefined> {
    if (!params.courier_code) {
      throw new Error("Courier Code can't be missing");
    }

    if (!params.tracking_number) {
      throw new Error("Tracking Number can't be missing");
    }

    const apiPath = "create";

    console.log({ params });

    try {
      const response = await axios.post<CreateTrackingResponse>(
        this.apiBaseUrl + "/" + apiPath,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            "Tracking-Api-Key": this.apiKey,
          },
        },
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async batchCreateTrackings(
    params: CreateSingleTrackingParams[],
  ): Promise<CreateBulkTrackingResponse> {
    if (params.length > 40) {
      throw new Error("Max. 40 tracking numbers can be created in one call");
    }

    for (const param of params) {
      if (!param.tracking_number) {
        throw new Error("Tracking number cannot be empty");
      }
      if (!param.courier_code) {
        throw new Error("Courier Code cannot be empty");
      }
    }

    const apiPath = "batch";

    try {
      const response = await axios.post<CreateBulkTrackingResponse>(
        this.apiBaseUrl + "/" + apiPath,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            "Tracking-Api-Key": this.apiKey,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to batch create trackings");
    }
  }

  async getAllTrackings({
    cursor,
  }: {
    cursor: number;
  }): Promise<GetAllTrackingsResponse | undefined> {
    const apiPath = "get";
    const url = `${this.apiBaseUrl}/${apiPath}?pages_amount=${cursor + 1}`; // Modify pages_amount as needed

    try {
      const response = await axios.get<GetAllTrackingsResponse>(url, {
        headers: {
          "Content-Type": "application/json",
          "Tracking-Api-Key": this.apiKey,
        },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to retrieve all trackings");
    }
  }

  async getFilteredTrackings(filters: {
    archived_status?: string;
    created_date_max?: string;
    created_date_min?: string;
    delivery_status?: string;
    items_amount?: string;
    lang?: string;
    pages_amount?: string;
    updated_date_max?: string;
    updated_date_min?: string;
  }): Promise<GetFilteredTrackingsResponse | undefined> {
    const apiPath = "get";
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${this.apiBaseUrl}/${apiPath}?${queryParams}`;

    try {
      const response = await axios.get<GetFilteredTrackingsResponse>(url, {
        headers: {
          "Content-Type": "application/json",
          "Tracking-Api-Key": this.apiKey,
        },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to retrieve filtered trackings");
    }
  }

  async updateATrackingById(params: { id: string; data: unknown }) {
    try {
      const resp = await axios.put(
        `${this.apiBaseUrl}/update/${params.id}`,
        params.data,
        {
          headers: {
            "Content-Type": "application/json",
            "Tracking-Api-Key": this.apiKey,
          },
        },
      );

      if (resp.status === 200) {
        return true;
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update tracking");
    }
  }

  async getTrackingByAWB(trackingNumber: string) {
    try {
      const resp = await axios.get<GetAllTrackingsResponse>(
        `${this.apiBaseUrl}/get?tracking_numbers=${trackingNumber}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Tracking-Api-Key": this.apiKey,
          },
        },
      );

      if (resp.data.meta.code === 200) {
        return resp.data;
      } else {
        throw new Error(resp.data.meta.message);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error?.response?.data);
      }
      throw error;
    }
  }

  async deleteTracking(trackingId: string) {
    try {
      const resp = await axios.delete<DeleteApiResponse>(
        `${this.apiBaseUrl}/delete/${trackingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Tracking-Api-Key": this.apiKey,
          },
        },
      );

      if (resp.data.meta.code === 200) {
        return true;
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error?.response?.data);
      } else {
        console.error(error);
      }
      throw new Error("Failed to delete tracking");
    }
  }
}

export default Trackings;
