'use client';

import FieldTestimonialsList from "../components/FieldTestimonialsList";
import React from "react";
import "@/app/styles/scss/admin/pageLayout.scss";

export default function FieldTestimonialsPage() {
  return (
    <div className="admin-content">
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <div className="page-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="page-title-info">
              <h1 className="page-title">Field Testimonials</h1>
              <p className="page-subtitle">Manage testimonials with multiple videos</p>
            </div>
          </div>
        </div>
      </div>
      <div className="page-content">
        <FieldTestimonialsList />
      </div>
    </div>
  );
}

