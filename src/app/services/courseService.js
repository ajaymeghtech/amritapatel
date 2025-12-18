const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCourses = async () => {
  // try {
  //   const response = await fetch(`${API_BASE_URL}/api/course`);
  //   const data = await response.json();
  //   if (data.status && data.data) {
  //     return data.data;
  //   }
  //   return [];
  // } catch (error) {
  //   console.error('Error fetching courses:', error);
  //   return [];
  // }
};

export const getCourseById = async (id) => {
  try {
    const allData = await fetchCourses();
    return allData.find(item => item._id === id) || null;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
};

export const getCourseByName = async (name) => {
  try {
    const allData = await fetchCourses();
    return allData.find(item => item.name === name) || null;
  } catch (error) {
    console.error('Error fetching course by name:', error);
    return null;
  }
};
