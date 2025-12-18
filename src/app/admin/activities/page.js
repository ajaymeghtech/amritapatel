'use client';

import ActivitiesList from '@/app/admin/components/ActivitiesList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function ActivitiesPage() {
  return (
    <>
      <div className="admin-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Activities Management</h1>
                <p className="page-subtitle">Create, edit, and manage activities with sub-activities and video testimonials</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
          <ActivitiesList />
        </div>
      </div>
    </>
  );
}

