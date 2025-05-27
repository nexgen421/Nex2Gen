import axios from "axios";

const NEXT_PUBLIC_PINCODE_URL = "https://api.postalpincode.in/pincode";

interface PostOffice {
  Name: string;
  Description: string;
  BranchType: string;
  DeliveryStatus: string;
  Taluk: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  State: string;
  Country: string;
}

interface PostOfficeResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[] | null;
}

export const getCityState = async (pincode: number | null) => {
  try {
    if (pincode === null) {
      throw new Error("Invalid Pincode Number!");
    }
    const response = await axios.get<PostOfficeResponse[]>(
      NEXT_PUBLIC_PINCODE_URL + `/${pincode}`,
    );
    if (
      response.data.length === 0 ||
      response.data[0]?.PostOffice === null ||
      response.data[0] === undefined
    ) {
      throw new Error("Not Found");
    } else {
      const data = {
        city: response.data[0].PostOffice[0]?.District,
        state: response.data[0].PostOffice[0]?.State,
      };
      return data;
    }
  } catch (error) {
    throw error;
  }
};
