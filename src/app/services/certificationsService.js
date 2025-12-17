const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const fetchCertifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/certifications/`);
    const data = await response.json();
    
    if (data.status && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
};

export const getCertificationById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/certifications/${id}`);
    const data = await response.json();
    
    if (data.status && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching certification:', error);
    return null;
  }
};

export const getActiveCertifications = async () => {
  try {
    const certifications = await fetchCertifications();
    return certifications.filter(cert => cert.status === 'active');
  } catch (error) {
    console.error('Error fetching active certifications:', error);
    return [];
  }
};
