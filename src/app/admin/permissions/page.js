'use client';

import PermissionsList from '@/app/admin/components/PermissionsList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function PermissionsPage() {
  return (
    <>
      <div className="admin-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Permission Management</h1>
                <p className="page-subtitle">Manage system permissions and access controls</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
          <PermissionsList />
        </div>
      </div>

    </>
  );
}
