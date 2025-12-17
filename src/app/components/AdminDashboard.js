'use client';

import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
      {/* Main Header */}
      {/* <div className="main-header">
        <div className="header-left">
          <button className="back-button">
            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="header-title">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Admin Panel</p>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">A</div>
            <div className="user-details">
              <div className="user-name">Admin User1</div>
              <div className="user-email">admin@cms.com</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Overview Section */}
      <div className="overview-section">
        <h2 className="overview-title">Overview</h2>
        <p className="overview-description">Welcome back! Here's what's happening with your site today.</p>
        
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-card-purple">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">3</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">4</div>
              <div className="stat-label">Total News</div>
            </div>
          </div>

          <div className="stat-card stat-card-green">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">2</div>
              <div className="stat-label">Total Events</div>
            </div>
          </div>

          <div className="stat-card stat-card-yellow">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity">
        {/* Recent Events */}
        <div className="activity-card">
          <div className="activity-header">
            <div className="activity-title-section">
              <h3 className="activity-title">Recent Events</h3>
              <p className="activity-subtitle">Latest 5 events</p>
            </div>
            <a href="#" className="view-all-link">View All</a>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon activity-icon-green">
                <svg className="activity-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-main">7567657</div>
                <div className="activity-secondary">6/5/7657</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon activity-icon-green">
                <svg className="activity-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-main">7567657</div>
                <div className="activity-secondary">6/5/7657</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent News */}
        <div className="activity-card">
          <div className="activity-header">
            <div className="activity-title-section">
              <h3 className="activity-title">Recent News</h3>
              <p className="activity-subtitle">Latest 5 articles</p>
            </div>
            <a href="#" className="view-all-link">View All</a>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon activity-icon-blue">
                <svg className="activity-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-main">564567</div>
                <div className="activity-secondary">by 6456456</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon activity-icon-blue">
                <svg className="activity-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-main">Test News Article</div>
                <div className="activity-secondary">by Test Author</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon activity-icon-blue">
                <svg className="activity-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-main">Mongo DB Tutorial</div>
                <div className="activity-secondary">by shraddha</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .dashboard-container {
          background: #f8fafc;
          min-height: 100vh;
          padding: 24px;
        }

        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          color: #6b7280;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background: #f3f4f6;
        }

        .back-icon {
          width: 20px;
          height: 20px;
        }

        .header-title {
          display: flex;
          flex-direction: column;
        }

        .page-title {
          font-size: 22px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .page-subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .user-email {
          font-size: 14px;
          color: #6b7280;
        }

        .overview-section {
          margin-bottom: 32px;
        }

        .overview-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .overview-description {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 24px 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-card-purple {
          background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
        }

        .stat-card-blue {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
        }

        .stat-card-green {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
        }

        .stat-card-yellow {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.8);
        }

        .stat-card-purple .stat-icon {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }

        .stat-card-blue .stat-icon {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .stat-card-green .stat-icon {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .stat-card-yellow .stat-icon {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .stat-svg {
          width: 24px;
          height: 24px;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .recent-activity {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .activity-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .activity-title-section {
          display: flex;
          flex-direction: column;
        }

        .activity-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .activity-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .view-all-link {
          color: #3b82f6;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .view-all-link:hover {
          color: #1d4ed8;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .activity-item:hover {
          background: #f9fafb;
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activity-icon-green {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .activity-icon-blue {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .activity-svg {
          width: 16px;
          height: 16px;
        }

        .activity-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .activity-main {
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 2px;
        }

        .activity-secondary {
          font-size: 12px;
          color: #6b7280;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .recent-activity {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
          }

          .main-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .header-left {
            width: 100%;
          }

          .header-right {
            width: 100%;
            justify-content: flex-end;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .page-title {
            font-size: 22px;
          }

          .stat-card {
            padding: 20px;
          }

          .activity-card {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 12px;
          }

          .stat-card {
            padding: 16px;
            flex-direction: column;
            text-align: center;
          }

          .activity-card {
            padding: 16px;
          }

          .activity-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .view-all-link {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}