import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchSettings = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/settings/`);
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};
