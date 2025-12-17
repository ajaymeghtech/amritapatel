'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminHeader({ title = "Admin Panel", showBackButton = true, isSidebarCollapsed = false, onToggleSidebar }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBackClick = () => {
    router.back();
  };

  const getBreadcrumbItems = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    // Always start with Dashboard
    breadcrumbs.push({ label: 'Dashboard', href: '/admin', isActive: false });
    
    // Add current page
    if (pathname !== '/admin') {
      breadcrumbs.push({ label: title, href: pathname, isActive: true });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbItems();

  return (
    <div className="fixed-header">
      <div className="header-left">
        {/* Toggle Button */}
        <button 
          className="toggle-sidebar-button"
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label="Toggle sidebar"
        >
          <svg className="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span style={{ color: '#cbd5e1', fontSize: '16px', lineHeight: '1' }}>/</span>}
              <span 
                onClick={!item.isActive ? () => router.push(item.href) : undefined}
                style={{ 
                  cursor: !item.isActive ? 'pointer' : 'default',
                  color: item.isActive ? '#374151' : '#64748b',
                  fontWeight: '600',
                  fontSize: '16px',
                  lineHeight: '1'
                }}
              >
                {item.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="header-right">
        <div className="user-profile">
          <div className="user-avatar">
            <span className="avatar-text">A</span>
          </div>
          <div className="user-info">
            <div className="user-name">Admin User1</div>
            <div className="user-email">admin@cms.com</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fixed-header {
          position: relative;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 1000;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }


        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .toggle-sidebar-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: #f8fafc;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .toggle-sidebar-button:hover {
          background: #e2e8f0;
          color: #374151;
        }

        .toggle-icon {
          width: 20px;
          height: 20px;
        }

        .back-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: #f8fafc;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background: #e2e8f0;
          color: #374151;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
        }

        .breadcrumb-separator {
          color: #cbd5e1;
          font-size: 16px;
          line-height: 1;
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 12px;
          background: #f8fafc;
          transition: background 0.2s ease;
          cursor: pointer;
        }

        .user-profile:hover {
          background: #e2e8f0;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }

        .avatar-text {
          font-size: 16px;
          font-weight: 600;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-info .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          line-height: 1.2;
        }

        .user-email {
          font-size: 12px;
          color: #64748b;
          line-height: 1.2;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          /* Header positioning handled by parent layout */
        }

        @media (max-width: 768px) {
          .fixed-header {
            padding: 0 16px;
            height: 60px;
          }

          .toggle-sidebar-button {
            width: 36px;
            height: 36px;
          }

          .toggle-icon {
            width: 18px;
            height: 18px;
          }

          .breadcrumb {
            font-size: 12px;
          }

          .user-profile {
            padding: 6px 12px;
          }

          .user-info .user-name {
            font-size: 13px;
          }

          .user-email {
            font-size: 11px;
          }
        }

        @media (max-width: 640px) {
          .fixed-header {
            padding: 0 12px;
            height: 56px;
          }

          .header-left {
            gap: 12px;
          }

          .toggle-sidebar-button {
            width: 32px;
            height: 32px;
          }

          .toggle-icon {
            width: 16px;
            height: 16px;
          }

          .breadcrumb {
            font-size: 11px;
          }

          .user-profile {
            padding: 4px 8px;
          }

          .user-info .user-name {
            font-size: 12px;
          }

          .user-email {
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .fixed-header {
            padding: 0 8px;
            height: 52px;
          }

          .header-left {
            gap: 8px;
          }

          .toggle-sidebar-button {
            width: 28px;
            height: 28px;
          }

          .toggle-icon {
            width: 14px;
            height: 14px;
          }

          .breadcrumb {
            font-size: 10px;
          }

          .user-profile {
            padding: 3px 6px;
          }

          .user-info .user-name {
            font-size: 11px;
          }

          .user-email {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  );
}
