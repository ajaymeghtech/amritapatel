'use client';

import SubAcademicList from '../components/SubAcademicList.jsx';
import React from 'react';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function SubAcademicPage() {
  return (
    <>
      <div className="admin-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Sub-Academic</h1>
                <p className="page-subtitle">Create, edit, and manage your sub-academic items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
          <SubAcademicList />
        </div>
      </div>
    </>
  );
}

