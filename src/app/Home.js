'use client';

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import 'react-toastify/dist/ReactToastify.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import homeStyles from '@/app/styles/scss/components/home.module.scss';
import bannerImage from '@/app/assets/images/Banner1.png';
import { fetchBanners, getBannerImageUrl } from '@/app/services/bannerService';
import { fetchAnnouncementsTitle } from "@/app/services/announcementService";
import meritListIcon from '@/app/assets/icons/anouncement.png';
import aboutImage from '@/app/assets/images/about-image.png';
import hostelImage from '@/app/assets/images/hostel.png';
import libraryImage from '@/app/assets/images/library_food_student_activity.png';
import securityImage from '@/app/assets/images/security.png';
import bankImage from '@/app/assets/images/bank_atm_book_store.png';
import provisionImage from '@/app/assets/images/provision_store_temple.png';
import anouncementIcon from '@/app/assets/icons/anouncement.png';
import { fetchCMSByKey } from '@/app/services/cmsService';
import { fetchPrograms, getProgramImageUrl } from '@/app/services/programService';
import { fetchEvents } from "./services/eventsService";
import { fetchHomeGallery, getGalleryImageUrl } from '@/app/services/galleryService';
import ConnectTab from "./components/ConnectTab";
import Footer from "./components/Footer";
import publichealth1 from '@/app/assets/icons/public_health1.png';
import publichealth2 from '@/app/assets/icons/healthcare2.png';
import publichealth3 from '@/app/assets/icons/public_health3.png';
import gallery1 from '@/app/assets/images/gallery/image1.png'
import gallery2 from '@/app/assets/images/gallery/image2.png'
import gallery3 from '@/app/assets/images/gallery/image3.png'
import gallery4 from '@/app/assets/images/gallery/image4.png'
import HomePageBanner from '@/app/assets/images/banner/home_banner.png'

const staticAnnouncements = [
  {
    _id: "1",
    title: "Bhaikaka University Organizes “Muskaan – The Sharing...",
    link: "https://example.com",
  },
  {
    _id: "2",
    title: "Bhaikaka University Celebrates Diwali with Great Enthusiasm",
    link: "https://example.com",
  },
  {
    _id: "3",
    title: "Celebration of Anti-Ragging Week | 12th – 18th August 2025",
    link: "https://example.com",
  },
  {
    _id: "4",
    title: "Bhaikaka University Celebrates 79th Independence Day",
    link: "https://example.com",
  },
];

const staticPrograms = [
  {
    _id: "69438920fe9f303c09a2f659",
    title: "Master of Public Health (MPH)",
    iconImage: publichealth1,
  },
  {
    _id: "69438c133f2a1f71d282b39d",
    title: "Master of Public Health - Executive (MPH)",
    iconImage: publichealth2,
  },
  {
    _id: "69438c403f2a1f71d282b3b7",
    title: "Master of Hospital Administration (MHA)",
    iconImage: publichealth3,
  },
];

const staticGalleryItems = [
  {
    _id: "693a6e802825e205fe5e21c2",
    title: "test4",
    image: gallery1,
  },
  {
    _id: "69146a2e536fcb95aaf1c63b",
    title: "1",
    image: gallery2,
  },
  {
    _id: "69146a20536fcb95aaf1c639",
    title: "unilife3",
    image: gallery3,
  },
  {
    _id: "69146a13536fcb95aaf1c637",
    title: "unilife2",
    image: gallery4,
  },
  {
    _id: "69146639536fcb95aaf1c5fe",
    title: "unilife1",
    image: gallery2,
  },
];

export default function Home() {

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aboutCmsData, setAboutCmsData] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [empoweringData, setEmpoweringData] = useState(null);
  const [lifeAtUniversityData, setLifeAtUniversityData] = useState(null);
  const [universityBestTimeData, setUniversityBestTimeData] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } }
    ],
  };

  // useEffect(() => {
  //   let isMounted = true;
  //   setPageLoading(true);
  //   setPageError(null);

  //   const loadAllData = async () => {
  //     const results = await Promise.allSettled([
  //       fetchBanners({ status: 'active', position: 'homepage' }),
  //       fetchAnnouncementsTitle(),
  //       fetchCMSByKey('about'),
  //       fetchCMSByKey('contactus'),
  //       fetchCMSByKey('empowering_students'),
  //       fetchCMSByKey('life_at_lifecycle'),
  //       fetchCMSByKey('best_time_of_university'),
  //       fetchPrograms(),
  //       (async () => {
  //         const response = await fetch(`${API_BASE_URL}/api/news`);
  //         if (!response.ok) throw new Error('Failed to fetch news');
  //         const data = await response.json();
  //         return data.data || data || [];
  //       })(),
  //       fetchEvents(),
  //       fetchHomeGallery(),
  //     ]);

  //     if (!isMounted) return;

  //     const [
  //       bannersResult,
  //       announcementsResult,
  //       aboutResult,
  //       _contactResult,
  //       empoweringResult,
  //       lifeAtResult,
  //       bestTimeResult,
  //       programsResult,
  //       newsResult,
  //       eventsResult,
  //       galleryResult,
  //     ] = results;

  //     if (bannersResult.status === 'fulfilled') {
  //       setBanners(bannersResult.value);
  //     } else {
  //       console.error('Failed to fetch banners:', bannersResult.reason);
  //       setBanners([]);
  //     }

  //     if (announcementsResult.status === 'fulfilled') {
  //       setAnnouncements(
  //         (announcementsResult.value || []).filter((a) => a.isPublished)
  //       );
  //     } else {
  //       console.error('Failed to fetch announcements:', announcementsResult.reason);
  //       setAnnouncements([]);
  //     }

  //     setAboutCmsData(aboutResult.status === 'fulfilled' ? aboutResult.value : null);
  //     setEmpoweringData(empoweringResult.status === 'fulfilled' ? empoweringResult.value : null);
  //     setLifeAtUniversityData(lifeAtResult.status === 'fulfilled' ? lifeAtResult.value : null);
  //     setUniversityBestTimeData(bestTimeResult.status === 'fulfilled' ? bestTimeResult.value : null);
  //     setPrograms(programsResult.status === 'fulfilled' ? (programsResult.value || []) : []);

  //     if (galleryResult.status === 'fulfilled') {
  //       setGalleryItems(galleryResult.value || []);
  //     } else {
  //       console.error('Failed to fetch gallery:', galleryResult.reason);
  //       setGalleryItems([]);
  //     }

  //     setPageLoading(false);
  //   };

  //   loadAllData().catch((error) => {
  //     console.error('Unexpected error during data load:', error);
  //     if (!isMounted) return;
  //     setPageError(error);
  //     setPageLoading(false);
  //   });

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [API_BASE_URL]);


  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await fetchPrograms();
        setPrograms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching programs:", error);
        setPrograms([]);
      }
    };
    // loadPrograms();
  }, []);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const aboutData = await fetchCMSByKey("about");
        setAboutCmsData(aboutData || null);
      } catch (error) {
        console.error("Error fetching About CMS data:", error);
      }
    };
    // fetchAboutData();
  }, []);


  useEffect(() => {
    const loadAnnouncements = async () => {
      const data = await fetchAnnouncementsTitle();
      setAnnouncements(data.filter((a) => a.isPublished));
      setLoading(false);
    };
    // loadAnnouncements();
  }, []);

  useEffect(() => {
    // fetchBannersData();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setImageLoading(true);
        setCurrentBannerIndex((prevIndex) =>
          (prevIndex + 1) % banners.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  useEffect(() => {
    setImageLoading(true);
  }, [currentBannerIndex]);

  const fetchBannersData = async () => {
    try {
      setBannersLoading(true);
      const bannersData = await fetchBanners({
        status: 'active',
        position: 'homepage'
      });
      setBanners(bannersData);
    } catch (err) {
      console.error('Failed to fetch banners:', err);
      setBanners([]);
    } finally {
      setBannersLoading(false);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (galleryItems.length > 0 && currentIndex >= galleryItems.length) {
      setCurrentIndex(0);
    }
  }, [galleryItems.length, currentIndex]);

  console.log("homepagebanner", HomePageBanner)
  return (
    <div>
      {/* Hero Section with Dynamic Banners */}
      <section className={homeStyles.homeHero}>
        <div className={homeStyles.heroBackground}>
          {/* {bannersLoading || banners.length === 0 ? (
            <img
              src={bannerImage.src}
              alt="Loading banner"
              className={`${homeStyles.heroBannerImage} ${homeStyles.imageLoading}`}
            />
          ) : (
            <img
              src={getBannerImageUrl(banners[currentBannerIndex]?.image)}
              alt={
                banners[currentBannerIndex]?.altText ||
                banners[currentBannerIndex]?.title ||
                "Banner"
              }
              className={`${homeStyles.heroBannerImage} ${imageLoading ? homeStyles.imageLoading : homeStyles.imageLoaded
                }`}
              onLoad={() => setImageLoading(false)}
              onError={(e) => {
                setImageLoading(false);
                e.target.src = bannerImage.src;
              }}
            />
          )} */}


          {/* <img
            src={homebanner}
            alt="Banner"
            className={`${homeStyles.heroBannerImage} ${homeStyles.imageLoaded}`}
          /> */}

          <Image
            src={HomePageBanner}
            alt="Banner"
            className={`${homeStyles.heroBannerImage} ${imageLoading ? homeStyles.imageLoading : homeStyles.imageLoaded
              }`}
            onLoad={() => setImageLoading(false)}
          />

          <div className={homeStyles.heroOverlay}></div>
          <div className={homeStyles.heroContent}>
            <div className={homeStyles.heroTextWrapper}>
              <h1 className={homeStyles.heroTitle}>
                {/* {!bannersLoading ? banners[currentBannerIndex]?.title : "Loading..."} */}
                Centre for Public Health (APCPH)
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement Bar */}
      {/* dynamic section */}
      {/* <section className={homeStyles.announcementBar}>
        <div className="container">
          <div className={homeStyles.announcementContainer}>
            <h4 className="sectionlabel announcementTitle">Announcement</h4>
            <div className={homeStyles.announcementItemsWrapper}>
              {loading ? (
                <span>Loading...</span>
              ) : announcements.length > 0 ? (
                <div className={homeStyles.announcementMarquee}>
                  <div className={homeStyles.announcementItems}>
                    {announcements.map((announcement) => (
                      <div
                        key={announcement._id}
                        className={homeStyles.announcementItem}
                      >
                        <div className={homeStyles.announcementIcon}>
                          <Image
                            src={anouncementIcon}
                            alt={announcement.shortTitle || "Announcement Icon"}
                            width={25}
                            height={20}
                            onError={(e) => {
                              e.target.src = meritListIcon.src;
                            }}
                          />
                        </div>
                        {announcement.link ? (
                          <a
                            href={announcement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={homeStyles.announcementLink}
                          >
                            {announcement.title}
                          </a>
                        ) : (
                          <span>{announcement.title}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={homeStyles.announcementItems} aria-hidden="true">
                    {announcements.map((announcement) => (
                      <div
                        key={`duplicate-${announcement._id}`}
                        className={homeStyles.announcementItem}
                      >
                        <div className={homeStyles.announcementIcon}>
                          <Image
                            src={anouncementIcon}
                            alt={announcement.shortTitle || "Announcement Icon"}
                            width={25}
                            height={20}
                            onError={(e) => {
                              e.target.src = meritListIcon.src;
                            }}
                          />
                        </div>
                        {announcement.link ? (
                          <a
                            href={announcement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={homeStyles.announcementLink}
                          >
                            {announcement.title}
                          </a>
                        ) : (
                          <span>{announcement.title}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <span>No announcements available</span>
              )}
            </div>
          </div>
        </div>
      </section> */}

      {/* static announcement */}
      <section className={homeStyles.announcementBar}>
        <div className="container">
          <div className={homeStyles.announcementContainer}>
            <h4 className="sectionlabel announcementTitle">Announcement</h4>

            <div className={homeStyles.announcementItemsWrapper}>
              <div className={homeStyles.announcementMarquee}>

                {/* First loop */}
                <div className={homeStyles.announcementItems}>
                  {staticAnnouncements.map((announcement) => (
                    <div
                      key={announcement._id}
                      className={homeStyles.announcementItem}
                    >
                      <div className={homeStyles.announcementIcon}>
                        <Image
                          src={anouncementIcon}
                          alt="Announcement Icon"
                          width={25}
                          height={20}
                        />
                      </div>

                      {announcement.link ? (
                        <a
                          href={announcement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={homeStyles.announcementLink}
                        >
                          {announcement.title}
                        </a>
                      ) : (
                        <span>{announcement.title}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Duplicate loop for seamless marquee */}
                <div
                  className={homeStyles.announcementItems}
                  aria-hidden="true"
                >
                  {staticAnnouncements.map((announcement) => (
                    <div
                      key={`duplicate-${announcement._id}`}
                      className={homeStyles.announcementItem}
                    >
                      <div className={homeStyles.announcementIcon}>
                        <Image
                          src={anouncementIcon}
                          alt="Announcement Icon"
                          width={25}
                          height={20}
                        />
                      </div>

                      <a
                        href={announcement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={homeStyles.announcementLink}
                      >
                        {announcement.title}
                      </a>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Bhaikaka University Section */}
      {console.log("aboutCmsData", aboutCmsData)}
      <section className="sectionPadding">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-7 col-md-7 col-sm-12 col-12">
              <div className="sectionheading">AMRITA PATEL CENTRE FOR PUBLIC HEALTH (APCPH)</div>
              <p className="sectiondescription">
                Amrita Patel Centre for Public Health is a venture to pay tributes to our former Chairman, Dr. Amrita Patel. Dr. Patel was the first lady executive of Amul, then the first woman Managing Director, and finally the Chairman of the National Dairy Development Board (NDDB).
              </p>
              <p className="sectiondescription"> Her contribution to the dairy industry is a tale of trials and triumphs. She is also a passionate community health professional deeply concerned about the health of the rural poor. Her entire life has been spent in the service of the less privileged and empowering them, especially the women of India. All the organizations she has served have a main goal: improving the health, income, and welfare of India’s rural poor.</p>
              <div className="buttonAndLogos">
                <a href="/about-us" className="sectionlink getMoreInfoButton">Explore More</a>
              </div>
            </div>
            <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12 col-12">
              <Image src={aboutImage} alt="img" width={600} height={400} className="img-fluid img100" />
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs Offered Section */}
      <section className={homeStyles.academicProgramsSection}>
        <div className="container">
          <div className={homeStyles.sectionHeader}>
            <div className={homeStyles.headerContent}>
              <h2 className="sectionheading whiteText"> Academic Programs Offered</h2>
            </div>
            <div className={homeStyles.exploreMoreWrapper}>
              <button className={homeStyles.getMoreInfoButton}>
                <a href="/academics/programs-short-courses" className="getMoreInfoButton">View all</a>
              </button>
            </div>
          </div>

          {/* dynamic program */}
          {/* <div className={homeStyles.programsGrid}>
            {programs.length > 0 ? (
              programs.slice(0, 6).map((program, index) => {
                const navButtonClass = homeStyles.navButtonOther;
                const cardClass = `${homeStyles.programCard} ${homeStyles.otherCard}`;
                return (
                  <div key={program._id} className={cardClass}>
                    <div className={homeStyles.cardOverlay}></div>
                    {console.log("program.iconImage", program)}
                    <div className={homeStyles.cardContent}>
                      <div className={homeStyles.cardHeader}>
                        <div className={homeStyles.cardIcon}>
                          <Image
                            src={`${API_BASE_URL}${program?.iconImage}`}
                            alt={program.title}
                            width={70}
                            height={70}
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      </div>
                      <div className={homeStyles.cardFooter}>
                        <h3 className={homeStyles.cardTitle}>{program.title}</h3>
                        <button className={`${homeStyles.navButton} ${navButtonClass}`}>
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Loading programs...</p>
            )}
          </div> */}

          {/* static program */}
          <div className={homeStyles.programsGrid}>
            {staticPrograms.length > 0 ? (
              staticPrograms.slice(0, 6).map((program) => {
                const navButtonClass = homeStyles.navButtonOther;
                const cardClass = `${homeStyles.programCard} ${homeStyles.otherCard}`;
                return (
                  <div key={program._id} className={cardClass}>
                    <div className={homeStyles.cardOverlay}></div>
                    <div className={homeStyles.cardContent}>
                      <div className={homeStyles.cardHeader}>
                        <div className={homeStyles.cardIcon}>
                          <Image
                            src={program.iconImage}
                            alt={program.title}
                            width={70}
                            height={70}
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      </div>
                      <div className={homeStyles.cardFooter}>
                        <h3 className={homeStyles.cardTitle}>
                          {program.title}
                        </h3>

                        <button
                          className={`${homeStyles.navButton} ${navButtonClass}`}
                        >
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No programs available</p>
            )}
          </div>

        </div>
      </section>


      {/* University Life Section */}
      <section className="sectionPadding homeGallery">
        <div className="container">
          <h2 className="sectionheading">Gallery</h2>

          {/* dynamic gallery */}
          {/* <Slider {...settings}>
            {galleryItems.map((img, index) => (
              <div key={index}>
                <Image
                  src={`${API_BASE_URL}${img?.image}`}
                  alt={`Gallery ${index}`}
                  width={400}
                  height={300}
                  className="img-fluid imgRadius"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </Slider> */}

          {/* static gallery  */}
          <Slider {...settings}>
            {staticGalleryItems.map((img, index) => (
              <div key={img._id || index}>
                <Image
                  src={img.image}
                  alt={img.title || `Gallery ${index + 1}`}
                  width={400}
                  height={300}
                  className="img-fluid imgRadius"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </Slider>

        </div>
      </section>

      <Footer />
      <ConnectTab />
    </div>
  );
}



