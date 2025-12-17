'use client';

import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

export default function PermissionGate({ children, permission, fallback = null }) {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasPermission(permission)) {
    return fallback;
  }

  return children;
}