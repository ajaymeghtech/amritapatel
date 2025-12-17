"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import styles from "@/app/styles/scss/components/academic_calendar.module.scss";
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import academicBanner from '@/app/assets/images/academic-calendar-innerbanner.jpg';
import pdficon from '@/app/assets/images/pdficon.png';
import { useState, useEffect } from 'react';
import { fetchAcademicCalendars } from '@/app/services/academicCalendarService';

export default function AcademicCalendar() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCalendars() {
      try {
        const data = await fetchAcademicCalendars();
        setCalendarData(data);
      } catch (error) {
        console.error('Error loading calendars:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCalendars();
  }, []);

  const formatAcademicYear = (year) => {
    return `${year}-${String(year + 1).slice(-2)}`;
  };


  return (
    <>
      <Header />
      <Innerbanner title="Academic Calendar"
        image={academicBanner} />
      <div className={`${styles.academicCalendar} sectionPadding`}>
        <div className="container">
          <ul className={styles.calendarList}>
            {loading ? (
              <li style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Loading academic calendars...</p>
              </li>
            ) : calendarData.length === 0 ? (
              <li style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No academic calendars available.</p>
              </li>
            ) : (
              calendarData.map((item, index) => (
                <li key={index}>
                  <div className={styles.boxCalendar}>
                    <div className={styles.calendarHeading}>
                      <h3>{item.title}</h3>
                      <Image
                        src={pdficon}
                        alt="pdf icon"
                        width={53}
                        height={60}
                        className="img-fluid pdfIcon"
                      />
                    </div>

                    <div className={styles.calendarLink}>
                      {item.years && item.years.map((year, i) => (
                        <a
                          href={`${API_BASE_URL}${item?.pdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={i}
                        >
                          {formatAcademicYear(year)}
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}

