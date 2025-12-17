
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchAllCMS = async () => {
  const response = await fetch(`${API_BASE_URL}/api/cms/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch CMS: ${response.statusText}`);
  }
  const data = await response.json();
  return data?.data || [];
};

export const fetchCMSByKey = async (pageKey) => {
  const all = await fetchAllCMS();
  return all.find((item) => item.page_key === pageKey) || null;
};


