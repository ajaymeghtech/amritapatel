"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/styles/scss/components/header.module.scss";
import amrita_patel from "@/app/assets/images/amrita_patel_centre_logo.png";
import bhaikakaLogo from "@/app/assets/images/bhaikaka_logo_header.png";
import { fetchInstitutes } from "@/app/services/contactInstituteService.js";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [studentLifeItems, setStudentLifeItems] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [researchItems, setResearchItems] = useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const pathname = usePathname();
  const isActive = (href) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const fetchStudentLife = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student-life`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      if (res?.data?.length) {
        setStudentLifeItems(res.data);
      }
    } catch (error) {
      console.log("Error fetching student life:", error);
    }
  };

  const fetchResearch = async () => {
    try {
      const base = API_BASE_URL.replace(/\/+$/, "");
      const url = `${base}/api/research`;

      const res = await fetch(url, {
        method: "GET",
      });

      const json = await res.json();

      if (json?.data) {
        setResearchItems(json.data);
        console.log("Research response", json.data);
      }
    } catch (error) {
      console.log("Error fetching Research:", error);
    }
  };

  useEffect(() => {
    loadInstitutes();
    fetchStudentLife();
    fetchResearch();
  }, []);

  const loadInstitutes = async () => {
    const data = await fetchInstitutes();
    console.log("header Fetched loadInstitutes:", data);
    setInstitutes(data);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleSidebarToggle = () => {
    setMobileOpen((prev) => !prev);
    document.body.classList.toggle("overflowhidden");
  };

  const topNavItems = [
    {
      id: "news-events",
      label: "News & Events",
      href: "/news-events",
    },
    { id: "faq", label: "FAQ", href: "/faq" },
    {
      id: "student-life",
      label: "Alumni Association",
      href: "/alumni-association",
    },
    { id: "testimonials", label: "Testimonials", href: "/testimonials" },
    { id: "gallery", label: "Gallery", href: "/gallery" },
    { id: "contact-us", label: "Contact Us", href: "/contact-us" },
  ];

  const mainNavItems = [
    {
      id: "about-us",
      label: "About Us",
      href: "/about-us",
    },
    {
      id: "academics",
      label: "Academics",
      href: "/academics",
      dropdown: [
        { label: "Programs & Short Courses", href: "/academics/programs-short-courses" },
        { label: "Admission Process", href: "/academics/admission-process" },
        { label: "Faculty", href: "/academics/faculty" },
        { label: "Internship / Observership Opportunities", href: "/academics/internship-observership-opportunities" },
        { label: "Students Corner", href: "/academics/students-corner" },
        { label: "Seminars/Workshops", href: "/academics/seminars-workshops" },
        { label: "Best Practices", href: "/academics/best-practices" }
      ],
    },
    {
      id: "SPARSH & Field Activities",
      label: "SPARSH & Field Activities",
      href: "/sparsh-field-activities",
      dropdown: [
        { label: "SPARSH", href: "/sparsh-field-activities/sparsh" },
        { label: "Testimonials", href: "/sparsh-field-activities/testimonials" },
        { label: "Gallery   ", href: "/sparsh-field-activities/gallery" }

      ],
    },
    {
      id: "research-projects-grants",
      label: "Research Projects & Grants",
      href: "/research-projects",
      dropdown: [
        { label: "Publications", href: "/research/publications" },
        { label: "Projects & Grants ", href: "/research/projects-grants" },
      ],
    },
    {
      id: "committees", label: "Committees", href: "/committees",
      dropdown: [
        { label: "Advisory Board", href: "/committees/advisory-board" },
        { label: "Board of Studies", href: "/committees/board-of-studies" },
        { label: "Internal Quality Assurance Cell (IQAC)", href: "/committees/internal-quality-assurance-cell" },
        { label: "Guest Speakers", href: "/committees/guest-speakers" },
      ],
    },
  ];

  const ArrowDown = () => (
    <svg width="15" height="10" viewBox="0 0 15 10" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.648 0.327142C14.4319 0.111388 14.1425 -0.00619443 13.8435 0.000252576C13.5446 0.00669958 13.2605 0.136648 13.0538 0.361521L7.59851 6.29905L1.89228 0.602222C1.67503 0.392738 1.38768 0.280427 1.09213 0.289479C0.79658 0.298532 0.516471 0.428223 0.312135 0.65062C0.1078 0.873018 -0.0044135 1.17033 -0.000337217 1.47851C0.00373812 1.7867 0.123779 2.0811 0.33393 2.29832L6.85517 8.80881C7.07134 9.02456 7.36073 9.14215 7.65968 9.1357C7.95864 9.12925 8.24268 8.9993 8.44935 8.77443L14.6839 1.98886C14.8905 1.76392 15.0028 1.4625 14.996 1.15088C14.9893 0.839263 14.8641 0.542964 14.648 0.327142Z"
        fill="#232323"
      />
    </svg>
  );

  console.log("researchItems", researchItems)
  return (
    <div className={styles.mainHeader}>
      <div className="container">
        <header className={styles.headerRow}>

          {/* Logo */}
          <div className={styles.headerLogo}>
            <Link href="/">
              <Image src={amrita_patel} alt="Amrita Patel Centre for Public Health" priority />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className={`${styles.sidebarCollapse} ${styles.crossLine} ${mobileOpen ? styles.active : ""}`}
            onClick={handleSidebarToggle}
          >
            <span className={`${styles.line} ${styles.crossLine1}`}></span>
            <span className={`${styles.line} ${styles.crossLine2}`}></span>
            <span className={`${styles.line} ${styles.crossLine3}`}></span>
          </button>

          {/* Navigation */}
          <nav className={`${styles.navbarLink} ${mobileOpen ? styles.active : ""}`}>
            <ul className={styles.topNav}>
              {topNavItems.map((item) => (
                <li key={item.id}>
                  <div className="d-flex align-items-center">
                    {item.dropdown ? (
                      <button
                        type="button"
                        className={styles.mainNavLink}
                        onClick={() => toggleDropdown(item.id)}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link href={item.href}
                        //  className={styles.mainNavLink}
                        className={`${styles.mainNavLink} ${isActive(item.href) ? styles.activeNav : ""}`}
                      >
                        {item.label}
                      </Link>
                    )}
                    {(item.dropdown || item.dynamic) && <ArrowDown />}
                  </div>

                  {item.dynamic && (
                    <ul
                      className={`${styles.dropdownMenu} ${openDropdown === item.id ? styles.active : ""
                        }`}
                    >
                      {/* Student Life Dynamic Items */}
                      {item.id === "student-life" &&
                        (studentLifeItems.length > 0 ? (
                          studentLifeItems.map((s) => {
                            const slug = s.title.toLowerCase().replace(/\s+/g, "-");
                            return (
                              <li key={s._id}>
                                <Link
                                  href={`/student-life/${slug}?id=${s._id}`}
                                  className="block px-3 py-2 hover:bg-gray-100"
                                >
                                  {s.title}
                                </Link>
                              </li>
                            );
                          })
                        ) : (
                          <li><span className="px-3 py-2 text-muted">Loading…</span></li>
                        ))}
                    </ul>
                  )}

                  {/* --- STATIC DROPDOWN FOR OTHER MENUS --- */}
                  {item.dropdown && !item.dynamic && (
                    <ul className={`${styles.dropdownMenu} ${openDropdown === item.id ? styles.active : ""}`}>
                      {item.dropdown.map((sub, index) => (
                        <li key={index}>
                          <Link href={sub.href} 
                          // className="block px-3 py-2 hover:bg-gray-100"
                           className={`block px-3 py-2 ${isActive(sub.href) ? styles.activeDropdown : ""}`}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <ul>
              {mainNavItems.map((item) => (
                <li key={item.id}>
                  <div className="d-flex align-items-center">
                    {item.dynamic || item.dropdown ? (
                      <button
                        type="button"
                        // className={styles.mainNavLink}
                         className={`${styles.mainNavLink} ${isActive(item.href) ? styles.activeNav : ""  }`}
                        onClick={() => toggleDropdown(item.id)}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link href={item.href} className={styles.mainNavLink}>
                        {item.label}
                      </Link>
                    )}
                    {(item.dynamic || item.dropdown) && <ArrowDown />}
                  </div>

                  {/* DYNAMIC INSTITUTES DROPDOWN */}
                  {item.dynamic && item.id === "institutes" && (
                    <ul className={`${styles.dropdownMenu} ${openDropdown === item.id ? styles.active : ""}`}>
                      {institutes.length > 0 ? (
                        institutes.map((inst, index) => {
                          const isExternal = inst.url?.startsWith("http");
                          return (
                            <li key={index}>
                              <Link
                                href={inst.url || "#"}
                                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                className="block px-3 py-2 hover:bg-gray-100"
                              >
                                {inst.name}
                              </Link>
                            </li>
                          );
                        })
                      ) : (
                        <li><span className="px-3 py-2 text-muted">Loading…</span></li>
                      )}
                    </ul>
                  )}
                  {item.dynamic && item.id === "research" && (
                    <ul
                      className={`${styles.dropdownMenu} ${openDropdown === item.id ? styles.active : ""
                        }`}
                    >
                      {researchItems.length > 0 ? (
                        researchItems.map((r) => (
                          <li key={r._id}>
                            <Link
                              href={r.slug ? `/research/${r.slug}` : "#"}
                              className="block px-3 py-2 hover:bg-gray-100"
                            >
                              {r.title}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li><span className="px-3 py-2 text-muted">Loading…</span></li>
                      )}
                    </ul>
                  )}

                  {/* STATIC DROPDOWN */}
                  {!item.dynamic && item.dropdown && (
                    <ul className={`${styles.dropdownMenu} ${openDropdown === item.id ? styles.active : ""}`}>
                      {item.dropdown.map((sub, index) => (
                        <li key={index}>
                          <Link href={sub.href} className="block px-3 py-2 hover:bg-gray-100">
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.rightLogos}>
            <Image src={bhaikakaLogo} alt="bhaikaka Logo" className={styles.hospitalLogoImage} />
          </div>
        </header>
      </div>

      <div className="overlay" style={{ display: "none" }}></div>
    </div>
  );
}
