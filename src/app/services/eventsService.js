// src/services/eventsService.js
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/events/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
