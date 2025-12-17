'use client';

import "@/app/styles/scss/admin/pageLayout.scss";
import ResearchList from '../components/ResearchList';

export default function ResearchPage() {
  return (
    <>
      <div className="admin-content">
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18M7 7v10M17 7v10" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Research Management</h1>
                <p className="page-subtitle">Create, edit, and track your digital projects</p>
              </div>
            </div>
          </div>
        </div>

        <div className="page-content">
          <ResearchList />
        </div>
      </div>

  
    </>
  );
}

