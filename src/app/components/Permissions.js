'use client';

import React, { useState, useEffect } from 'react';

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPermissions([]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="p-6">Loading permissions...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Permission Management</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Permission
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {permissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No permissions found. Create your first permission!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {permissions.map((permission) => (
              <li key={permission.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{permission.name}</h3>
                    <p className="text-sm text-gray-500">{permission.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}