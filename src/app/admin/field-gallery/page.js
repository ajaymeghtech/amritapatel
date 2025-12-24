'use client';

import FieldGalleryList from "../components/FieldGalleryList";
import React from "react";
import "@/app/styles/scss/admin/pageLayout.scss";

export default function FieldGalleryPage() {
  return (
    <div className="admin-content">
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <div className="page-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M3 10h18M7 15h10M5 20h14" />
              </svg>
            </div>
            <div className="page-title-info">
              <h1 className="page-title">Field Gallery</h1>
              <p className="page-subtitle">Manage gallery items with multiple images</p>
            </div>
          </div>
        </div>
      </div>
      <div className="page-content">
        <FieldGalleryList />
      </div>
    </div>
  );
}

