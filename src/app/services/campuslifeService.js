export const fetchCampuslife = async (campuslife_id) => {
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/api/student-life/${campuslife_id}`);
    const result = await response.json();


    console.log("API response Response:", result);

    if (result?.status === true && result?.data) {
      return result.data;
    } else {
      console.error("Invalid Campus Life response:", result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching Campus Life:", error);
    return [];
  }
};

