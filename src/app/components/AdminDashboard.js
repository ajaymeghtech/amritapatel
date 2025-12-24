'use client';

import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    contacts: 0,
    faqs: 0,
    banners: 0,
    announcements: 0,
    cmsPages: 0,
    programs: 0,
    courses: 0,
    testimonials: 0,
    projects: 0,
    institutes: 0,
    homeGallery: 0,
    loading: true
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const responses = await Promise.all([
        fetch(`${API_BASE_URL}/api/contact`).catch(() => null),
        fetch(`${API_BASE_URL}/api/faq`).catch(() => null),
        fetch(`${API_BASE_URL}/api/banners`).catch(() => null),
        fetch(`${API_BASE_URL}/api/announcements`).catch(() => null),
        fetch(`${API_BASE_URL}/api/cms`).catch(() => null),
        fetch(`${API_BASE_URL}/api/programs`).catch(() => null),
        fetch(`${API_BASE_URL}/api/course`).catch(() => null),
        fetch(`${API_BASE_URL}/api/testimonials`).catch(() => null),
        fetch(`${API_BASE_URL}/api/projects`).catch(() => null),
        fetch(`${API_BASE_URL}/api/institute`).catch(() => null),
        fetch(`${API_BASE_URL}/api/home-gallery`).catch(() => null)
      ]);

      const getCount = async (res) => {
        if (!res?.ok) return 0;
        try {
          const data = await res.json();
          return Array.isArray(data.data) ? data.data.length : (Array.isArray(data) ? data.length : 0);
        } catch {
          return 0;
        }
      };

      const [
        contacts, faqs, banners, announcements, cmsPages,
        programs, courses, testimonials, projects, institutes, homeGallery
      ] = await Promise.all([
        getCount(responses[0]),
        getCount(responses[1]),
        getCount(responses[2]),
        getCount(responses[3]),
        getCount(responses[4]),
        getCount(responses[5]),
        getCount(responses[6]),
        getCount(responses[7]),
        getCount(responses[8]),
        getCount(responses[9]),
        getCount(responses[10])
      ]);

      setStats({
        contacts,
        faqs,
        banners,
        announcements,
        cmsPages,
        programs,
        courses,
        testimonials,
        projects,
        institutes,
        homeGallery,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="dashboard-container">
      {/* Overview Section */}
      <div className="overview-section">
        <h2 className="overview-title">Overview</h2>
        <p className="overview-description">Welcome back! Here's what's happening with your site today.</p>
        
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.loading ? '...' : stats.contacts}</div>
              <div className="stat-label">Total Contacts</div>
            </div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.loading ? '...' : stats.faqs}</div>
              <div className="stat-label">Total FAQs</div>
            </div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.loading ? '...' : stats.banners}</div>
              <div className="stat-label">Total Banners</div>
            </div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.loading ? '...' : stats.announcements}</div>
              <div className="stat-label">Total Announcements</div>
            </div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.loading ? '...' : stats.cmsPages}</div>
              <div className="stat-label">Total CMS Pages</div>
            </div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.loading ? '...' : stats.programs}</div>
              <div className="stat-label">Total Programs</div>
            </div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.loading ? '...' : stats.courses}</div>
              <div className="stat-label">Total Courses</div>
            </div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m-7 4h7M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.loading ? '...' : stats.testimonials}</div>
              <div className="stat-label">Total Testimonials</div>
            </div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.loading ? '...' : stats.projects}</div>
              <div className="stat-label">Total Projects</div>
            </div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.loading ? '...' : stats.institutes}</div>
              <div className="stat-label">Total Institutes</div>
            </div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.loading ? '...' : stats.homeGallery}</div>
              <div className="stat-label">Home Gallery Items</div>
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

        .stat-card-orange {
          background: linear-gradient(135deg, #fed7aa, #fdba74);
        }

        .stat-card-pink {
          background: linear-gradient(135deg, #fce7f3, #fbcfe8);
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

        .stat-card-orange .stat-icon {
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
        }

        .stat-card-pink .stat-icon {
          background: rgba(236, 72, 153, 0.1);
          color: #ec4899;
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