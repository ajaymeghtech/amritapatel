'use client';

import ContactsList from '@/app/admin/components/ContactsList';
import "@/app/styles/scss/admin/pageLayout.scss";

export default function ContactsPage() {
  return (
    <>
      <div className="admin-content">
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <div className="page-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="page-title-info">
                <h1 className="page-title">Contact Requests</h1>
                <p className="page-subtitle">View, triage, and respond to incoming inquiries</p>
              </div>
            </div>
          </div>
        </div>

        <div className="page-content">
          <ContactsList />
        </div>
      </div>
   
    </>
  );
}
