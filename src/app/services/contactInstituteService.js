export const fetchInstitutes = async () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await fetch(`${API_BASE_URL}/api/institute`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const result = await response.json();
    if (result.status  == true && Array.isArray(result.data)) {
      return result.data; 
    } else {
      console.error("Invalid institute response:", result);
      return [];
    }

  } catch (error) {
    console.error("Error fetching institutes:", error);
    return [];
  }
};


export const fetchCourses = async () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // try {
  //   const response = await fetch(`${API_BASE_URL}/api/course`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     }
  //   });

  //   const result = await response.json();
  //   if (result.status  == true && Array.isArray(result.data)) {
  //     return result.data; // Return actual institute list
  //   } else {
  //     console.error("Invalid institute response:", result);
  //     return [];
  //   }

  // } catch (error) {
  //   console.error("Error fetching institutes:", error);
  //   return [];
  // }
};








