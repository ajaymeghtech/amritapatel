'use client';

import HomeGalleryList from '@/app/admin/components/HomeGalleryList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function HomeGalleryPage() {
  return (
    <>
      <div className="admin-content">
        <div
          className="page-header"
          style={{ '--admin-page-header-gradient': 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
        >
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M3 10h18M7 15h10M5 20h14" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Home Gallery</h1>
                <p className="page-subtitle">Manage the visuals displayed on the landing page</p>
              </div>
            </div>
          </div>
        </div>

        <div className="page-content">
          <HomeGalleryList />
        </div>
      </div>
    </>
  );
}
