'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePermissions } from "../hooks/usePermissions";
import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from '@/app/components/ProtectedRoute';
import AdminHeader from '@/app/components/AdminHeader';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : {});
    }
  }, []);
  const { hasPermission } = usePermissions();

  const currentPath = pathname || "";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved) setIsCollapsed(saved === "1");
  }, []);

  // Auto-expand submenus when their child items are active
  useEffect(() => {
    const navItems = [
      {
        label: "User Management",
        submenu: [
          { path: "/admin/users" },
          { path: "/admin/roles" },
          { path: "/admin/permissions" }
        ]
      }
    ];

    navItems.forEach(item => {
      if (item.submenu) {
        const hasActiveChild = item.submenu.some(subItem => currentPath === subItem.path);
        if (hasActiveChild) {
          setExpandedMenus(prev => ({
            ...prev,
            [item.label]: true
          }));
        }
      }
    });
  }, [currentPath]);

  // Expand User Management by default for better UX
  useEffect(() => {
    setExpandedMenus(prev => {
      const newState = {
        ...prev,
        "User Management": true
      };
      console.log("Expanded menus:", newState);
      return newState;
    });
  }, []);

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("admin_sidebar_collapsed", next ? "1" : "0");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const navItems = useMemo(
    () => [
      {
        label: "Dashboard",
        path: "/admin",
        permission: null,
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
          </svg>
        )
      },
      {
        label: "Academic Calendars",
        path: "/admin/academic-calendars",
        permission: "academic-calendars.create",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 10h18M3 14h18M3 18h18M7 6v12M17 6v12" />
          </svg>
        )
      },
      {
        label: "Announcement",
        path: "/admin/announcement",
        permission: "announcement.create",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        ),
        submenu: [
          {
            label: "Category",
            path: "/admin/announcement_category",
            permission: "announcement_category.manage",
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-6 0a4 4 0 01-3-3.87M9 20a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            )
          },
          {
            label: "Sub Category",
            path: "/admin/announcement",
            permission: "announcement.create",
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l4 4-4 4-4-4 4-4zm0 8v12m0-12a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )
          },
        ]
      },
      {
        label: "Academic Programs",
        path: "/admin/academic-programs",
        permission: "academic-programs.create",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 10h18M3 14h18M3 18h18M7 6v12M17 6v12" />
          </svg>
        )
      },
      {
        label: "Banners",
        path: "/admin/banners",
        permission: "banners.create",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      },

      {
        label: "Contacts",
        path: "/admin/contacts",
        permission: "contacts.manage",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6m-2 7h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        label: "FAQ",
        path: "/admin/faq",
        permission: "faq.manage",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        label: "CMS Pages",
        path: "/admin/cms",
        permission: "cms.create",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      },
      // {
      //   label: "Certificates",
      //   path: "/admin/certificates",
      //   permission: "certificates.create",
      //   icon: (
      //     <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 1110 0 5 5 0 01-10 0z" />
      //     </svg>
      //   )
      // },
      // {
      //   label: "Career",
      //   path: "/admin/career",
      //   permission: "career.create",
      //   icon: (
      //     <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 1110 0 5 5 0 01-10 0z" />
      //     </svg>
      //   )
      // },
      {
        label: "Events",
        path: "/admin/events",
        permission: "events.create",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        label: "Activities",
        path: null,
        permission: "activities.manage",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
        submenu: [
          {
            label: "All Activities",
            path: "/admin/activities",
            permission: "activities.manage",
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )
          },
          {
            label: "Sub-Activities",
            path: "/admin/sub-activities",
            permission: "activities.manage",
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )
          },
          {
            label: "Third Categories",
            path: "/admin/third-categories",
            permission: "activities.manage",
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )
          },
        ]
      },
      {
        label: "Home Gallery",
        path: "/admin/home-gallery",
        permission: "gallery.manage",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M3 10h18M7 15h10M5 20h14" />
          </svg>
        )
      },
      {
        label: "Institute",
        path: "/admin/institute",
        permission: "institute.manage",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M3 10h18M7 15h10M5 20h14" />
          </svg>
        )
      },
      {
        label: "News",
        path: null,
        permission: "news.create",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        ),
        submenu: [
          {
            label: "News Categories",
            path: "/admin/news-category",
            permission: "news-category.manage",
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-6 0a4 4 0 01-3-3.87M9 20a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            )
          },
          {
            label: "All News",
            path: "/admin/news",
            permission: "news.create",
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            )
          },
        ]
      },
      {
        label: "Courses",
        path: "/admin/courses",
        permission: "courses.manage",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6m-2 7h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      },
      // {
      //   label: "Press Releases",
      //   path: "/admin/press-releases",
      //   permission: "press-releases.manage",
      //   icon: (
      //     <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6m-2 7h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
      //     </svg>
      //   ),
      //   submenu: [
      //     {
      //       label: "Category",
      //       path: "/admin/press-releases-category",
      //       permission: "press-releases-category.manage",
      //       icon: (
      //         <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-6 0a4 4 0 01-3-3.87M9 20a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
      //         </svg>
      //       )
      //     },
      //     {
      //       label: "Sub Category",
      //       path: "/admin/press-releases",
      //       permission: "press-releases.manage",
      //       icon: (
      //         <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l4 4-4 4-4-4 4-4zm0 8v12m0-12a4 4 0 100 8 4 4 0 000-8z" />
      //         </svg>
      //       )
      //     },
      //   ]
      // },
      // {
      //   label: "Projects",
      //   path: "/admin/projects",
      //   permission: "projects.create",
      //   icon: (
      //     <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 10h18M3 14h18M3 18h18M7 6v12M17 6v12" />
      //     </svg>
      //   )
      // },
      {
        label: "Research",
        path: null,
        permission: "research.create",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 10h18M3 14h18M3 18h18M7 6v12M17 6v12" />
          </svg>
        ),
        submenu: [
          {
            label: "Research Categories",
            path: "/admin/research-category",
            permission: "research-category.manage",
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-6 0a4 4 0 01-3-3.87M9 20a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            )
          },
          {
            label: "All Research",
            path: "/admin/research",
            permission: "research.manage",
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 10h18M3 14h18M3 18h18M7 6v12M17 6v12" />
              </svg>
            )
          },
        ]
      },

      {
        label: "Committees",
        path: "/admin/student-life",
        permission: "gallery.manage",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M3 10h18M7 15h10M5 20h14" />
          </svg>
        )
      },
      {
        label: "Testimonials",
        path: "/admin/testimonials",
        permission: "testimonials.manage",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      },
      {
        label: "Settings",
        path: "/admin/settings",
        permission: "settings.update",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      },
      // {
      //   label: "User Management",
      //   path: null,
      //   permission: "users.manage",
      //   icon: (
      //     <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      //     </svg>
      //   ),
      //   submenu: [
      //     {
      //       label: "Users",
      //       path: "/admin/users",
      //       permission: "users.manage",
      //       icon: (
      //         <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-6 0a4 4 0 01-3-3.87M9 20a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
      //         </svg>
      //       )
      //     },
      //     {
      //       label: "Roles",
      //       path: "/admin/roles",
      //       permission: "roles.manage",
      //       icon: (
      //         <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l4 4-4 4-4-4 4-4zm0 8v12m0-12a4 4 0 100 8 4 4 0 000-8z" />
      //         </svg>
      //       )
      //     },
      //     {
      //       label: "Permissions",
      //       path: "/admin/permissions",
      //       permission: "roles.manage",
      //       icon: (
      //         <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V7a4 4 0 00-8 0v4m8 0h4m-4 0v4m-8 0h8m0 0a4 4 0 008 0v-4a4 4 0 00-8 0z" />
      //         </svg>
      //       )
      //     }
      //   ]
      // },
    ],
    []
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const renderNavItem = (item, level = 0) => {
    // Temporarily show all items for debugging - remove this line later
    const hasPermissionToShow = true; // !item.permission || hasPermission(item.permission);
    if (!hasPermissionToShow) return null;

    const isActive = currentPath === item.path;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.label];
    const hasActiveSubmenu = hasSubmenu && item.submenu.some(sub => currentPath === sub.path);

    // Debug User Management
    if (item.label === "User Management") {
      console.log("User Management debug:", {
        hasSubmenu,
        isExpanded,
        expandedMenus,
        submenu: item.submenu
      });
    }

    if (hasSubmenu) {
      return (
        <li key={item.label} className="mb-1">
          <button
            type="button"
            onClick={() => toggleSubmenu(item.label)}
            className={`btn w-100 d-flex align-items-center justify-content-between text-start p-2 border-0 text-decoration-none ${isCollapsed ? "justify-content-center px-1" : ""
              } ${isActive || hasActiveSubmenu
                ? "text-white active-nav-item"
                : "text-light"
              } ${hasActiveSubmenu ? "active-parent-item" : ""}`}
            style={(isActive || hasActiveSubmenu) ? {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px -2px rgba(102, 126, 234, 0.4), 0 2px 4px -1px rgba(118, 75, 162, 0.3)'
            } : {}}
            title={isCollapsed ? item.label : undefined}
          >
            <div className="d-flex align-items-center">
              <span className={`me-2 ${isActive || hasActiveSubmenu ? "text-white" : "text-light"}`} style={hasActiveSubmenu ? { color: 'white' } : {}}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="text-truncate">{item.label}</span>
              )}
            </div>
            {!isCollapsed && (
              <svg
                width="14" height="14"
                className={`transition-transform ${isExpanded ? "rotate-180" : ""
                  }`}
                style={{ color: isActive || hasActiveSubmenu ? 'white' : 'rgba(255, 255, 255, 0.7)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {/* Submenu */}
          {!isCollapsed && isExpanded && (
            <ul className="list-unstyled ms-3 mt-1">
              {item.submenu.map((subItem) => {
                // Temporarily show all submenu items for debugging
                const subHasPermission = true; // !subItem.permission || hasPermission(subItem.permission);
                if (!subHasPermission) return null;

                const subIsActive = currentPath === subItem.path;
                return (
                  <li key={subItem.path} className="mb-1">
                    <button
                      type="button"
                      onClick={() => router.push(subItem.path)}
                      className={`btn w-100 d-flex align-items-center text-start p-2 border-0 text-decoration-none ${subIsActive
                        ? "text-white active-nav-item"
                        : "text-light"
                        }`}
                      style={subIsActive ? {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px -2px rgba(102, 126, 234, 0.4), 0 2px 4px -1px rgba(118, 75, 162, 0.3)'
                      } : {}}
                    >
                      <span className={`me-2 ${subIsActive ? "text-white" : "text-light"}`}>
                        {subItem.icon}
                      </span>
                      <span className="text-truncate">{subItem.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    }

    // Regular menu item
    return (
      <li key={item.path} className="mb-1">
        <button
          type="button"
          onClick={() => router.push(item.path)}
          className={`btn w-100 d-flex align-items-center text-start p-2 border-0 text-decoration-none ${isCollapsed ? "justify-content-center px-1" : ""
            } ${isActive
              ? "text-white active-nav-item"
              : "text-light"
            }`}
          style={isActive ? {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px -2px rgba(102, 126, 234, 0.4), 0 2px 4px -1px rgba(118, 75, 162, 0.3)'
          } : {}}
          aria-current={isActive ? "page" : undefined}
          title={isCollapsed ? item.label : undefined}
        >
          <span className={`me-2 ${isActive ? "text-white" : "text-light"}`}>
            {item.icon}
          </span>
          {!isCollapsed && (
            <span className="text-truncate">{item.label}</span>
          )}
        </button>
      </li>
    );
  };

  return (
    <ProtectedRoute>
      <div className="admin-layout">

        {/* Mobile Menu Button */}
        <button
          className="btn btn-dark position-fixed d-md-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          style={{ top: '20px', left: '20px', zIndex: 1001 }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" onClick={closeMobileMenu} style={{ zIndex: 999 }}></div>
        )}

        {/* Sidebar */}
        <div
          className={`bg-dark text-white d-flex flex-column position-fixed h-100 start-0 top-0 shadow-lg ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} ${isMobileMenuOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed'}`}
          style={{
            width: isCollapsed ? '80px' : '280px',
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateX(0)'
          }}
        >
          {/* Logo Section */}
          <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="bg-white rounded p-1 me-2">
                <svg className="text-primary" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="logo-text">
                <div className="fw-bold text-white">Amruta Patel Centre</div>
              </div>
            </div>
            <div className="fw-bold text-white">Admin</div>
          </div>

          {/* User Welcome */}
          {/* <div className="p-3 border-bottom border-secondary">
            <div className="text-muted small">Welcome back,</div>
            <div className="fw-semibold text-white">Admin User1</div>
          </div> */}

          {/* Navigation */}
          <nav className="flex-grow-1 p-2 overflow-auto">
            <ul className="list-unstyled mb-0">
              {navItems.map((item) => renderNavItem(item))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-top border-secondary">
            <button onClick={handleLogout} className="btn w-100 d-flex align-items-center justify-content-center logout-button">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>



        {/* Admin Header */}
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: isCollapsed ? '80px' : '280px',
            right: '0',
            height: '70px',
            zIndex: 999,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <AdminHeader
            title="Admin Panel"
            showBackButton={false}
            isSidebarCollapsed={isCollapsed}
            onToggleSidebar={toggleSidebar}
          />
        </div>

        {/* Main Content */}
        <div
          className="main-content"
          style={{
            marginLeft: isCollapsed ? '80px' : '280px',
            width: isCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 280px)',
            minHeight: '100vh',
            paddingTop: '70px',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: '#f8fafc'
          }}
        >
          {children}
        </div>

        {/* Custom CSS */}
        <style jsx>{`
          .admin-layout {
            position: relative;
            min-height: 100vh;
            background: #f8fafc;
            width: 100vw;
          }

          .sidebar-collapsed {
            width: 80px !important;
          }

          .sidebar-expanded {
            width: 280px !important;
          }

          .sidebar-collapsed .logo-text {
            display: none;
          }

          .sidebar-collapsed .fw-bold.text-white {
            display: none;
          }

          .sidebar-collapsed .text-muted,
          .sidebar-collapsed .fw-semibold {
            display: none;
          }

          .sidebar-collapsed .text-truncate {
            display: none;
          }

          .sidebar-collapsed .btn span:not(.me-2) {
            display: none;
          }

          /* Remove underlines from all navigation buttons */
          .btn.text-decoration-none,
          .btn.text-decoration-none:hover,
          .btn.text-decoration-none:focus,
          .btn.text-decoration-none:active {
            text-decoration: none !important;
          }

          /* Override Bootstrap button styles for active items */
          button.active-nav-item,
          .btn.active-nav-item {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: none !important;
            color: white !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px -2px rgba(102, 126, 234, 0.4), 0 2px 4px -1px rgba(118, 75, 162, 0.3) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative;
            overflow: hidden;
          }

          button.active-nav-item:focus,
          .btn.active-nav-item:focus {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: none !important;
            box-shadow: 0 4px 12px -2px rgba(102, 126, 234, 0.4), 0 2px 4px -1px rgba(118, 75, 162, 0.3) !important;
          }

          button.active-nav-item:hover,
          .btn.active-nav-item:hover {
            background: linear-gradient(135deg, #5568d3 0%, #5a3f8f 100%) !important;
            box-shadow: 0 6px 16px -2px rgba(102, 126, 234, 0.5), 0 3px 8px -1px rgba(118, 75, 162, 0.4) !important;
            transform: translateX(3px);
          }

          button.active-nav-item *,
          .btn.active-nav-item * {
            color: white !important;
          }

          .active-nav-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
          }

          .active-nav-item:hover::before {
            left: 100%;
          }

          /* Smooth transitions for all nav buttons */
          button.text-light,
          .btn.text-light {
            transition: all 0.2s ease;
            border-radius: 8px;
          }

          button.text-light:hover,
          .btn.text-light:hover {
            background: rgba(255, 255, 255, 0.05) !important;
            border-radius: 8px;
            transform: translateX(2px);
          }

          /* Parent menu item when submenu is active */
          button.active-parent-item,
          .btn.active-parent-item {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: none !important;
            color: white !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px -2px rgba(102, 126, 234, 0.4), 0 2px 4px -1px rgba(118, 75, 162, 0.3) !important;
          }

          button.active-parent-item *,
          .btn.active-parent-item * {
            color: white !important;
          }

          button.active-parent-item:hover,
          .btn.active-parent-item:hover {
            background: linear-gradient(135deg, #5568d3 0%, #5a3f8f 100%) !important;
            box-shadow: 0 6px 16px -2px rgba(102, 126, 234, 0.5), 0 3px 8px -1px rgba(118, 75, 162, 0.4) !important;
          }

          button.active-parent-item:focus,
          .btn.active-parent-item:focus {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: none !important;
            box-shadow: 0 4px 12px -2px rgba(102, 126, 234, 0.4), 0 2px 4px -1px rgba(118, 75, 162, 0.3) !important;
          }

          /* Logout button gradient styling */
          .logout-button {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3), 0 2px 4px -1px rgba(220, 38, 38, 0.3);
            transition: all 0.3s ease;
          }

          .logout-button:hover {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
            box-shadow: 0 6px 8px -1px rgba(239, 68, 68, 0.4), 0 3px 6px -1px rgba(220, 38, 38, 0.4);
            transform: translateY(-1px);
          }

          .logout-button:active {
            transform: translateY(0);
          }

          /* Responsive Design */
          @media (max-width: 1024px) {
            .sidebar {
              width: 80px !important;
            }
          }

          @media (max-width: 768px) {
            .sidebar {
              width: 280px !important;
            }

            .sidebar.sidebar-mobile-closed {
              transform: translateX(-100%) !important;
            }

            .sidebar.sidebar-mobile-open {
              transform: translateX(0) !important;
            }
          }

          @media (max-width: 640px) {
            .sidebar {
              width: 280px !important;
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
