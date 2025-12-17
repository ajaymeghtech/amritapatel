const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchHomeGallery = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home-gallery/`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch gallery: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Filter only active items and return the data array
    const galleryItems = (data.data || []).filter(item => item.isActive === true);
    
    return galleryItems;
  } catch (error) {
    console.error('Error fetching home gallery:', error);
    throw error;
  }
};

export const getGalleryImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  return `${API_BASE_URL}${imagePath}`;
};

