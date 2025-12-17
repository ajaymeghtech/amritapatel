const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log("API_BASE_URL",API_BASE_URL)
export const fetchBanners = async (options = {}) => {
  try {
    const { status = 'active', position = 'homepage' } = options;
    
    const response = await fetch(`${API_BASE_URL}/api/banners/`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch banners: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const banners = data.data || data || [];
    
    const filteredBanners = banners
      .filter(banner => {
        const statusMatch = !status || banner.status === status;
        const positionMatch = !position || banner.position === position;
        return statusMatch && positionMatch;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return filteredBanners;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

export const getBannerImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  return `${API_BASE_URL}${imagePath}`;
};


export const fetchBannerById = async (bannerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/banners/${bannerId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch banner: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching banner:', error);
    throw error;
  }
};

