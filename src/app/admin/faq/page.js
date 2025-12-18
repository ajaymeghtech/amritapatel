'use client';

import FAQList from '@/app/admin/components/FAQList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function FAQPage() {
  return (
    <>
      <div className="admin-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">FAQ Management</h1>
                <p className="page-subtitle">Create, edit, and manage frequently asked questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
          <FAQList />
        </div>
      </div>
    </>
  );
}

