'use client';

import TestimonialsList from '@/app/admin/components/TestimonialsList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function TestimonialsPage() {
  return (
    <>
      <div className="admin-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Testimonials Management</h1>
                <p className="page-subtitle">Create, edit, and manage testimonials and reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
          <TestimonialsList />
        </div>
      </div>
    </>
  );
}

