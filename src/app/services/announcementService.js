export const fetchAnnouncements = async (announcement_year_id) => {
    if (!announcement_year_id) {
    console.warn("fetchAnnouncements called WITHOUT yearId. Skipping API call.");
    return [];
  }
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/api/announcements?announcement_year_id=${announcement_year_id}`);
    const result = await response.json();
    console.log("API URL:", `${API_BASE_URL}/api/announcements?announcement_year_id=${announcement_year_id}`);
    console.log("API Raw Response:", response);

    if (result.status && Array.isArray(result.data)) {
      return result.data;
    } else {
      console.error("Invalid announcements response:", result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}; 

export const getAnnouncementsDetail = async (announcement_id) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/api/announcements/${announcement_id}`);
    const result = await response.json();
     if (result.status && result.data) {
      return result.data; // return object (not array)
          console.log(result.data, "datadetail");
    } else {
      console.error("Invalid announcement response:", result);
      return null;
    }
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  } 
};

export const fetchAnnouncementsTitle = async () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/api/announcements`);
    const result = await response.json();
    if (result.status && Array.isArray(result.data)) {
      return result.data;
    } else {
      console.error("Invalid announcements response:", result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }     
};



export const fetchAnnouncementsYear = async () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/api/announcement-years`);
    const result = await response.json();
    if (result.status && Array.isArray(result.data)) {
      return result.data;
    } else {
      console.error("Invalid announcements response:", result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
};
