// services/careerService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCareerList() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/career/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.log("Career API Error:", error);
    return [];
  }
}
