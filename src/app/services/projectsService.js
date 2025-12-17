const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`);
    const data = await response.json();
    
    if (data.status && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
    const data = await response.json();
    
    if (data.status && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

export const getOngoingProjects = async () => {
  try {
    const projects = await fetchProjects();
    return projects.filter(project => project.status === 'ongoing');
  } catch (error) {
    console.error('Error fetching ongoing projects:', error);
    return [];
  }
};

export const getProjectsByStatus = async (status) => {
  try {
    const projects = await fetchProjects();
    return projects.filter(project => project.status === status);
  } catch (error) {
    console.error('Error fetching projects by status:', error);
    return [];
  }
};
