'use client';

import AcademicCalendarsList from '@/app/admin/components/AcademicCalendarsList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function AcademicCalendarsPage() {
  return (
    <>
      <div className="admin-content">
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Academic Calendars</h1>
                <p className="page-subtitle">Upload and manage yearly academic schedules</p>
              </div>
            </div>
          </div>
        </div>

        <div className="page-content">
          <AcademicCalendarsList />
        </div>
      </div>
    </>
  );
}
