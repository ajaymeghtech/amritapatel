const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchAcademicCalendars = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/academic-calendars`);
    const data = await response.json();
    if (data.status && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching academic calendars:', error);
    return [];
  }
};

export const getAcademicCalendarById = async (id) => {
  try {
    const allData = await fetchAcademicCalendars();
    return allData.find(item => item._id === id) || null;
  } catch (error) {
    console.error('Error fetching academic calendar:', error);
    return null;
  }
};
