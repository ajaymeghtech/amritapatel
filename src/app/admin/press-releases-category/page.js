'use client';

import PressReleasesCategoryList from '../components/PressReleasesCategoryList';
import React from 'react';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function NewsCategoryPage() {
  return (
    <>
      <div className="admin-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Press Releases Category</h1>
                <p className="page-subtitle">Create, edit, and manage your press releases categories and publications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
            <PressReleasesCategoryList />    
        </div>
      </div>
    </>
  );
}
