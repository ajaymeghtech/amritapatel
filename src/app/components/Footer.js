'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from "@/app/styles/scss/components/footer.module.scss";
import locationIcon from '@/app/assets/icons/location-white.svg';
import emailIcon from '@/app/assets/icons/email_white.svg';
import callIcon from '@/app/assets/icons/call-white.svg';
import socialmedia1Icon from '@/app/assets/icons/facebook-white.svg';
import socialmedia2Icon from '@/app/assets/icons/twitter-white.svg';
import socialmedia3Icon from '@/app/assets/icons/youtube-white.svg';
import socialmedia4Icon from '@/app/assets/icons/instagram-white.svg';
import footerLogo from '@/app/assets/images/amrita_patel_footer_logo.png';
import megh_logo from '@/app/assets/images/megh_technologies_logo.png';
import { fetchSettings } from '@/app/services/settingsService';
import { usePathname } from "next/navigation";
import skhLogo from "@/app/assets/images/charutar_logo.png";
import Link from "next/link";

export default function Footer() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState();
    const [showScrollTop, setShowScrollTop] = useState(false);

    const pathname = usePathname();

    const isActive = (href) => {
        if (!href) return false;
        return pathname === href || pathname.startsWith(href + "/");
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {

        // Otherwise, fetch settings independently
        const loadSettings = async () => {
            try {
                const data = await fetchSettings();
                setSettings(data);
            } catch (error) {
                console.error('Error fetching footer settings:', error);
            } finally {
                setLoading(false);
            }
        };

        // loadSettings();
    }, []);

    if (loading) {
        return <footer className={styles.footer}><p>Loading footer...</p></footer>;
    }

    console.log('Footer settings:', settings);
    return (
        <>
            <footer className={styles.footer}>
                <div className="container">
                    <div className={`${styles.footerTop} ${styles.footerPadding}`}>
                        <div className="row">
                            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                                <div className={styles.logoSection}>
                                    <Link href="/">
                                        <Image
                                            src={footerLogo}
                                            alt={settings?.siteName || 'Amrita Patel Centre for Public Health'}
                                            width={280}
                                            height={80}
                                        />
                                    </Link>
                                    <div className={styles.skhlogoSection}>
                                    <Link href="https://www.charutarhealth.org/" target='_blank'>
                                        <Image src={skhLogo} alt="Charutar Vidyamandal" className={styles.hospitalLogoImage} />
                                    </Link>
                                    </div>
                                </div>


                            </div>

                            <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12">
                                <div className={styles.quickLinks}>
                                    <h2 className={styles.footerheading}>Quick Links</h2>
                                    <ul>
                                        <li><a href="/about-us/" className={isActive("/about-us") ? styles.activeQuickLink : ""}>About Us</a></li>
                                        <li><a href="/academics/programs-short-courses/" className={isActive("/academics") ? styles.activeQuickLink : ""}>Academics</a></li>
                                        <li><a href="/sparsh-field-activities/sparsh/" className={isActive("/sparsh-field-activities") ? styles.activeQuickLink : ""}>SPARSH & Field Activities</a></li>
                                        <li><a href="/research-projects-grants/projects-grants/" className={isActive("/research-projects-grants") ? styles.activeQuickLink : ""}>Research Projects & Grants</a></li>
                                        <li><a href="/committees/advisory-board/" className={isActive("/committees") ? styles.activeQuickLink : ""}>Committees</a></li>
                                        <li><a href="/news-events/" className={isActive("/news-events") ? styles.activeQuickLink : ""}>News & Events</a></li>
                                        <li><a href="/faq/" className={isActive("/faq") ? styles.activeQuickLink : ""}>FAQ</a></li>
                                        <li><a href="/alumni-association/" className={isActive("/alumni-association") ? styles.activeQuickLink : ""}>Alumni Association</a></li>
                                        <li><a href="/testimonials/" className={isActive("/testimonials") ? styles.activeQuickLink : ""}>Testimonials</a></li>
                                        <li><a href="/gallery/" className={isActive("/gallery") ? styles.activeQuickLink : ""}>Gallery</a></li>
                                        <li><a href="/contact-us/" className={isActive("/contact-us") ? styles.activeQuickLink : ""}>Contact</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                                <h2 className={styles.footerheading}>Get In Touch</h2>
                                <ul className={styles.contactSection}>
                                    <li>
                                        <div className={styles.contactItem}>
                                            <Image className={styles.footericon} src={locationIcon} alt="location_icon" />
                                            <p>{settings?.address || 'Bhaikaka University Gokalnagar, Karamsad – 388325 Gujarat, India'}</p>
                                        </div>
                                        <div className={styles.contactItem}>
                                            <Image className={styles.footericon} src={callIcon} alt="call_icon" />
                                            <a href={`tel:9512388324`}>
                                             9512388324
                                            </a>
                                        </div>
                                    </li>

                                    <li>
                                        <div className={styles.contactItem}>
                                            <Image className={styles.footericon} src={emailIcon} alt="email_icon" />
                                            {/* <a href={`mailto:${settings?.contactEmail}`} className={styles.emailblock}>{settings?.contactEmail}</a>
                                            <a href={`mailto:${settings?.emailAdmission}`} className={styles.emailblock}>{settings?.emailAdmission}</a> */}
                                            <a href={`mailto:director.apcph@charutarhealth.org`} className={styles.emailblock}>director.apcph@charutarhealth.org</a>
                                        </div>

                                        <div className={styles.socialIcons}>
                                            {/* {settings?.facebook && ( */}
                                            <a href="#" target="_blank" rel="noopener noreferrer">
                                                <Image className={styles.footericon} src={socialmedia1Icon} alt="facebook_icon" />
                                            </a>
                                            {/* )} */}

                                            {/* {settings?.linkedin && ( */}
                                            <a href="#" target="_blank" rel="noopener noreferrer">
                                                <Image className={styles.footericon} src={socialmedia2Icon} alt="linkedin_icon" />
                                            </a>
                                            {/* )} */}
                                            {/* {settings?.youtube && ( */}
                                            <a href="#" target="_blank" rel="noopener noreferrer">
                                                <Image className={styles.footericon} src={socialmedia3Icon} alt="youtube_icon" />
                                            </a>
                                            {/* )} */}
                                            {/* {settings?.instagramUrl && ( */}
                                            <a href="#" target="_blank" rel="noopener noreferrer">
                                                <Image className={styles.footericon} src={socialmedia4Icon} alt="instagram_icon" />
                                            </a>
                                            {/* )} */}
                                        </div>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </footer >
            <div className={styles.footerBottom}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-12 text-start">
                            <p>{settings?.footerText}</p>
                        </div>
                        <div className="col-md-6 col-12 text-end">
                            <p className={styles.designby}>Website Designed by:  <a href='https://meghtechnologies.com/' target='_blank'><Image src={megh_logo} alt='megh_logo' /></a></p>
                        </div>
                    </div>
                </div>
            </div>

            {showScrollTop && (
                <button
                    className={styles.scrollTopBtn}
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            )}

        </>
    );
}
