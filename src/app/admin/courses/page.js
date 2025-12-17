'use client';

import CoursesList from '@/app/admin/components/CoursesList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function CoursesPage() {
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6m-2 7h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Programs Offered</h1>
                <p className="page-subtitle">Manage program offerings for admissions and site content</p>
              </div>
            </div>
          </div>
        </div>

        <div className="page-content">
          <CoursesList />
        </div>
      </div>
    </>
  );
}
