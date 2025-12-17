'use client';

import CertificateList from '../components/CertificateList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function CertificatesPage() {
  return (
    <>
      <div className="admin-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 1110 0 5 5 0 01-10 0z" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Certificate Management</h1>
                <p className="page-subtitle">Create, edit, and manage your certifications and recognitions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
          <CertificateList />
        </div>
      </div>
    </>
  );
}
