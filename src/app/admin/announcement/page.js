'use client';

import AnnouncementsList from '@/app/admin/components/AnnouncementList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function AnnouncementsPage() {
  return (
    <>
      <div className="admin-content">
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m0 0V8m0 4H7m5 4h6m0 0v-4m0 0h2l1 5h-2l-2 4v-5h-4M7 12H5a2 2 0 01-2-2V9a2 2 0 012-2h3.5L10 4h4l.5 3H19a2 2 0 012 2v1" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Announcements</h1>
                <p className="page-subtitle">Create, schedule, and publish campus updates</p>
              </div>
            </div>
          </div>
        </div>

        <div className="page-content">
          <AnnouncementsList />
        </div>
      </div>
    </>
  );
}
