'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from "@/app/styles/scss/components/footer.module.scss";
import commonStyles from '@/app/styles/scss/common.module.scss';
import universitylogo from '@/app/assets/images/amrita_patel_footer_logo.png';
import locationIcon from '@/app/assets/icons/location.png';
import emailIcon from '@/app/assets/icons/email.png';
import callIcon from '@/app/assets/icons/call.png';
import socialmedia1Icon from '@/app/assets/icons/socialmedia1.png';
import socialmedia2Icon from '@/app/assets/icons/socialmedia2.png';
import socialmedia3Icon from '@/app/assets/icons/socialmedia3.png';
import socialmedia4Icon from '@/app/assets/icons/socialmedia4.png';
import footerLogo from '@/app/assets/images/amrita_patel_footer_logo.png';
import megh_logo from '@/app/assets/images/megh_technologies_logo.png';
import { fetchSettings } from '@/app/services/settingsService';

export default function Footer() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState();

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

        loadSettings();
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
                            <div className="col-xl-2 col-lg-2 col-md-12 col-sm-12 col-12">
                                <div className={styles.logoSection}>
                                    <Image
                                        src={footerLogo}
                                        alt={settings?.siteName || 'Amrita Patel Centre for Public Health'}
                                        width={280}
                                        height={80}
                                    />
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                                <div className={styles.quickLinks}>
                                    <h2 className={styles.footerheading}>Quick Links</h2>
                                    <ul>
                                        <li><a href="/about-us/overview">About Us</a></li>
                                        <li><a href="/academics/programs-short-courses">Academics</a></li>
                                        <li><a href="/sparsh-field-activities/sparsh">SPARSH & Field Activities</a></li>
                                        <li><a href="/research/projects-grants">Research Projects & Grants</a></li>
                                        <li><a href="/committees/advisory-board">Committees</a></li>
                                        <li><a href="/news-events">News & Events</a></li>
                                        <li><a href="/faq">FAQ</a></li>
                                        <li><a href="/alumni-association">Alumni Association</a></li>
                                        <li><a href="/testimonials">Testimonials</a></li>
                                        <li><a href="/gallery">Gallery</a></li>
                                        <li><a href="/contact-us">Contact</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                                <h2 className={styles.footerheading}>Get In Touch</h2>
                                <ul className={styles.contactSection}>
                                    <li>
                                        <div className={styles.contactItem}>
                                            <Image className={styles.footericon} src={locationIcon} alt="location_icon" />
                                            <p>{settings?.address || 'Gokalanagar, Karamsad - 388325, Gujarat, India'}</p>
                                        </div>
                                        <div className={styles.contactItem}>
                                            <Image className={styles.footericon} src={callIcon} alt="call_icon" />
                                            <a href={`tel:+91 2692 228748`}>
                                                +91 2692 228748
                                            </a>
                                        </div>
                                    </li>

                                    <li>
                                        <div className={styles.contactItem}>
                                            <Image className={styles.footericon} src={emailIcon} alt="email_icon" />
                                            <a href={`mailto:${settings?.contactEmail}`} className={styles.emailblock}>{settings?.contactEmail}</a>
                                            <a href={`mailto:${settings?.emailAdmission}`} className={styles.emailblock}>{settings?.emailAdmission}</a>
                                            <a href={`mailto:docverification@charutarhealth.org`} className={styles.emailblock}>docverification@charutarhealth.org</a>
                                        </div>

                                        <div className={styles.socialIcons}>
                                            {settings?.facebook && (
                                                <a href={settings.facebook} target="_blank" rel="noopener noreferrer">
                                                    <Image className={styles.footericon} src={socialmedia1Icon} alt="facebook_icon" />
                                                </a>
                                            )}

                                            {settings?.linkedin && (
                                                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer">
                                                    <Image className={styles.footericon} src={socialmedia2Icon} alt="linkedin_icon" />
                                                </a>
                                            )}
                                            {settings?.youtube && (
                                                <a href={settings.youtube} target="_blank" rel="noopener noreferrer">
                                                    <Image className={styles.footericon} src={socialmedia3Icon} alt="youtube_icon" />
                                                </a>
                                            )}
                                            {settings?.instagramUrl && (
                                                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
                                                    <Image className={styles.footericon} src={socialmedia4Icon} alt="instagram_icon" />
                                                </a>
                                            )}
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
        </>
    );
}
