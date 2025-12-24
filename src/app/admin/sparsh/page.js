'use client';

import SparshList from "../components/SparshList";
import React from "react";
import "@/app/styles/scss/admin/pageLayout.scss";

export default function SparshPage() {
  return (
    <div className="admin-content">
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <div className="page-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="page-title-info">
              <h1 className="page-title">SPARSH</h1>
              <p className="page-subtitle">Manage SPARSH content</p>
            </div>
          </div>
        </div>
      </div>
      <div className="page-content">
        <SparshList />
      </div>
    </div>
  );
}

