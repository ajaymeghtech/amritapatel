'use client';

import NewsList from '../components/NewsList';
import React from 'react';

export default function NewsPage() {
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
                <h1 className="page-title">News Management</h1>
                <p className="page-subtitle">Create, edit, and manage your news articles and publications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
        <NewsList />
        </div>
      </div>

      <style jsx>{`
        .admin-content {
          background: #f8fafc;
          min-height: 100vh;
          padding: 1rem;
          width: 100%;
          box-sizing: border-box;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 1.5rem;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
          width: 100%;
          left: 0;
          right: 0;
          box-sizing: border-box;
          border-radius: 12px;
        }

        .page-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .page-header-content {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .page-title-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .page-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .page-title-info h1 {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .page-subtitle {
          margin: 0.25rem 0 0;
          opacity: 0.9;
          font-size: 0.875rem;
          font-weight: 400;
        }

        .page-content {
          padding: 0;
          width: 100%;
          max-width: none;
          margin: 0;
          position: relative;
          left: 0;
          right: 0;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .admin-content {
            padding: 1rem;
          }

          .page-header {
            padding: 1rem 1.25rem;
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 768px) {
          .admin-content {
            padding: 0.75rem;
          }

          .page-header {
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
          }

          .page-header-content {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
          }

          .page-title-section {
            width: 100%;
          }

          .page-icon {
            width: 36px;
            height: 36px;
          }

          .page-title-info h1 {
            font-size: 16px;
          }

          .page-subtitle {
            font-size: 0.8125rem;
          }

          .page-content {
            padding: 0;
          }
        }

        @media (max-width: 480px) {
          .admin-content {
            padding: 0.5rem;
          }

          .page-header {
            padding: 0.75rem;
            margin-bottom: 0.75rem;
            border-radius: 8px;
          }

          .page-header-content {
            gap: 1rem;
          }

          .page-title-section {
            gap: 0.75rem;
          }

          .page-icon {
            width: 32px;
            height: 32px;
          }

          .page-title-info h1 {
            font-size: 15px;
          }

          .page-subtitle {
            font-size: 0.75rem;
          }

          .page-content {
            padding: 0;
          }
        }
      `}</style>
    </>
  );
}
