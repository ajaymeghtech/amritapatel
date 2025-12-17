'use client';

import UsersList from '@/app/admin/components/UsersList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function UsersPage() {
  return (
    <>
      <div className="admin-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">User Management</h1>
                <p className="page-subtitle">Manage user accounts, roles, and permissions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
          <UsersList />
        </div>
      </div>
    </>
  );
}
