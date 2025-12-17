'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (!storedToken) {
        router.push("/login");
      }
    }
    setLoading(false);
  }, [router]);

  if (loading) return null; // Render nothing while checking authentication
  if (!token) return null; // Render nothing if not authenticated, useEffect will handle redirect
  return children;
}
