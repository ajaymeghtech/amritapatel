'use client';

import CMSList from '@/app/admin/components/CMSList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function CmsPage() {
  return (
    <>
      <div className="admin-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">CMS Management</h1>
                <p className="page-subtitle">Create, edit, and manage your CMS pages and content</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
          <CMSList />
        </div>
      </div>

    </>
  );
}
