'use client';

import BannerList from '../components/BannerList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function BannersPage() {
  return (
    <>
      <div className="admin-content">
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Banner Management</h1>
                <p className="page-subtitle">Create, edit, and manage your banner images and announcements</p>
              </div>
            </div>
          </div>
        </div>

        <div className="page-content">
          <BannerList />
        </div>
      </div>
    </>
  );
}
