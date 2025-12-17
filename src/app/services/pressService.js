const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPressReleases = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/press`);
    const data = await response.json();

    if (data.status && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching press releases:", error);
    return [];
  }
};


export const fetchPressByYear = async (press_year_id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/press/?press_year_id=${press_year_id}`,
      { method: "GET" }
    );

    const data = await response.json();
    console.log("Press by Year Response:", data);

    if (data.status && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching press by year:", error);
    return [];
  }
};



export const getPressReleaseById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/press/${id}`);
    const data = await response.json();
    
    if (data.status && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching press release:', error);
    return null;
  }
};

export const getActivePressReleases = async () => {
  try {
    const pressReleases = await fetchPressReleases();
    return pressReleases.filter(press => press.status === 'active');
  } catch (error) {
    console.error('Error fetching active press releases:', error);
    return [];
  }
};

export const getUniquePressYears = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/press-years/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log("press years:", data);

    if (data.status && Array.isArray(data.data)) {
      return [
        { _id: "all", year: "All" },        // First option
        ...data.data                        // API years with IDs
      ];
    }

    return [{ _id: "all", year: "All" }];
  } catch (error) {
    console.error("Error fetching press years:", error);
    return [{ _id: "all", year: "All" }];
  }
};


export const filterPressByYear = async (year) => {
  try {
    const pressReleases = await getActivePressReleases();
    if (year === 'All') {
      return pressReleases;
    }
    return pressReleases.filter(press => press.year.toString() === year);
  } catch (error) {
    console.error('Error filtering press releases:', error);
    return [];
  }
};
