const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPrograms = async () => {
  const response = await fetch(`${API_BASE_URL}/api/programs`);
  if (!response.ok) {
    throw new Error(`Failed to fetch programs: ${response.statusText}`);
  }
  const data = await response.json();
  return data?.data || [];
};

export const getProgramImageUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};


