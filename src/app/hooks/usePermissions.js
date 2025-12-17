import { useState, useEffect } from 'react';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get permissions from localStorage or API
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setPermissions(user.permissions || []);
    }
    setLoading(false);
  }, []);

  const hasPermission = (permission) => {
    return permissions.includes(permission) || permissions.includes('*');
  };

  return { permissions, hasPermission, loading };
};
