"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import seminarBanner from '@/app/assets/images/banner/seminar_banner.jpg';
import img1 from "@/app/assets/images/img1.jpg";
import img2 from "@/app/assets/images/img2.jpg";
import img3 from "@/app/assets/images/img3.jpg";
import img4 from "@/app/assets/images/img4.jpg";
import img5 from "@/app/assets/images/img5.jpg";
import img6 from "@/app/assets/images/img6.jpg";
import img7 from "@/app/assets/images/img7.jpg";
import img8 from "@/app/assets/images/img8.jpg";
import img9 from "@/app/assets/images/img9.jpg";
import img10 from "@/app/assets/images/img10.jpg";
import img11 from "@/app/assets/images/img11.jpg";
import img12 from "@/app/assets/images/img12.jpg";
import img13 from "@/app/assets/images/img13.jpg";
import img14 from "@/app/assets/images/img14.jpg";
import img15 from "@/app/assets/images/img15.jpg";
import img16 from "@/app/assets/images/img16.jpg";
import img17 from "@/app/assets/images/img17.jpg";
import img18 from "@/app/assets/images/img18.jpg";
import img19 from "@/app/assets/images/img19.jpg";
import img20 from "@/app/assets/images/img20.jpg";
import img21 from "@/app/assets/images/img21.jpg";
import img22 from "@/app/assets/images/img22.jpg";
import img23 from "@/app/assets/images/img23.jpg";
// import img24 from "@/app/assets/images/img24.jpg";
import img25 from "@/app/assets/images/img25.jpg";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Fancybox } from "@fancyapps/ui";

export default function SeminarsWorkshops() {

  const ITEMS_PER_PAGE = 9;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);


  const seminarData = [
    {
      title: "Research Methods",
      date: "Nov 27, 2025",
      eventType: "Workshop",
      speaker: "--",
      coFacilitator: "--",
      venue: "Bhaikaka University Campus",
      images: [
        {
          image: img19,
          caption: "Bridging curiosity and discovery: A one day Research Methods Workshop for UG & PG students"
        },
        // {
        //   image: img12,
        //   caption: "Bridging Academia and Community: Internship Exposure with APCPH"
        // },
        {
          image: img13,
          caption: "Global Collaboration, Local Impact: UMass Students Exploring Rural Healthcare"
        }
      ]
    },
    {
      title: "One Health",
      date: "Nov 25, 2025",
      eventType: "Seminar",
      speaker: "--",
      coFacilitator: "--",
      venue: "Bhaikaka University Campus",
    },
    {
      title: "Systems Mapping",
      date: "Mar 01, 2025",
      eventType: "Sensitization Workshop",
      speaker: "Dr. Nayanjeet Chaudhury",
      coFacilitator: "--",
      venue: "Bhaikaka University Campus",
      images: [
        {
          image: img8,
          caption: "Mapping health, saving lives: The power of a community survey"
        },
        {
          image: img9,
          caption: "Men for Women's Health: Taking a Stand Against Cervical Cancer"
        }
      ]
    },
    {
      title: "Understanding Research in Biomedical Sciences",
      date: "Feb 04, 2025",
      eventType: "Workshop",
      speaker: "Dr. Swati Roy",
      coFacilitator: "Faculty of BU",
      venue: "Bhaikaka University Campus",
      images: [
        {
          image: img11,
          caption: "Unnat Bharat Abhiyan in Practice: Next-Gen Doctors Engaged in Community Health"
        }
      ]
    },
    {
      title: "Design Thinking",
      date: "Feb 01, 2025",
      eventType: "Workshop",
      speaker: "Dr. Nayanjeet Chaudhury",
      coFacilitator: "--",
      venue: "Bhaikaka University Campus",

    },
    {
      title: "Teaching Learning Methodologies",
      date: "Feb 01, 2025",
      eventType: "Workshop",
      speaker: "Dr. Nayanjeet Chaudhury",
      coFacilitator: "--",
      venue: "Bhaikaka University Campus",

    },
    {
      title: "Innovative Thinking in Public Health",
      date: "Jan 01, 2025",
      eventType: "Sensitization Workshop",
      speaker: "Dr. Nayanjeet Chaudhury",
      coFacilitator: "--",
      venue: "Bhaikaka University Campus",
      images: [
        {
          image: img1,
          caption: "Aashirwad Scheme: Bringing affordable healthcare to every doorstep in Anand"
        },
        {
          image: img2,
          caption: "SPARSH Awareness Sessions: Cultivating Knowledge, Fostering Community Progress"
        }
      ]
    },
    {
      title: "Monitoring & Evaluation",
      date: "Nov 25, 2024",
      eventType: "Workshop",
      speaker: "Dr. Nayanjeet Chaudhury",
      coFacilitator: "Mr. Ajay Phatak",
      venue: "Bhaikaka University Campus",
      images: [
        {
          image: img3,
          caption: "Building Healthier Futures: NCD camp Awareness at the grassroots"
        },
        {
          image: img4,
          caption: "Community Wellness: NCD Screening in Action with Government Support"
        }
      ]
    },
    {
      title: "Communication, SBCC for NHM - Odisha",
      date: "Feb 02, 2024",
      eventType: "Workshop",
      speaker: "Dr. Kallol Roy",
      coFacilitator: "Dr. Swati Roy",
      venue: "IRMA & BU Campus",
      images: [
        {
          image: img20,
          caption: "Young Minds, Safe Futures: World AIDS Day celebration at Fangani, Anand"
        }
      ]
    },
    {
      title: "Information Mgmt. & Documentation (NHM - Odisha)",
      date: "Jan 23, 2024",
      eventType: "Workshop",
      speaker: "Dr. Kallol Roy",
      coFacilitator: "Team of APCPH",
      venue: "IRMA Campus",

    },
    {
      title: "Public Health Leadership - 1",
      date: "Jan 01, 2024",
      eventType: "Certificate Program",
      speaker: "Dr. Nayanjeet Chaudhury",
      coFacilitator: "Ms. Shailee Shah, Dr. Dipika Bumb",
      venue: "Bhaikaka University Campus",

    },
    {
      title: "Literature Search & Referencing",
      date: "Sep 22, 2023",
      eventType: "Short Course",
      speaker: "Mrs. Vasumathi Sriganesh",
      coFacilitator: "Dr. Kallol Roy",
      venue: "Bhaikaka University Campus",

    },
    {
      title: "Process Documentation for UMass Students",
      date: "Jul 18, 2023",
      eventType: "Workshop",
      speaker: "Dr. Kallol Roy",
      coFacilitator: "Dr. Amol Dongre",
      venue: "Bhaikaka University Campus",

    },
    {
      title: "EPI - Data",
      date: "May 18, 2023",
      eventType: "Short Course",
      speaker: "Dr. Vinayagamoorthy",
      coFacilitator: "Dr. Kallol Roy",
      venue: "Bhaikaka University Campus",

    },
    {
      title: "GCP Ethics for IEC Members",
      date: "May 02, 2023",
      eventType: "Guest Speaker Workshop",
      speaker: "Dr. Swati Roy",
      coFacilitator: "Faculty at PSMC, BU",
      venue: "CVM University",
    },
    {
      title: "Meta Analysis",
      date: "Apr 20, 2023",
      eventType: "Short Course",
      speaker: "Dr. Pradeep Deshmukh",
      coFacilitator: "Dr. Kallol Roy",
      venue: "Bhaikaka University Campus",
    },
    {
      title: "GCP and Ethical Issues",
      date: "Apr 18, 2023",
      eventType: "Workshop",
      speaker: "Dr. Swati Roy",
      coFacilitator: "Faculty of PSMC, BU",
      venue: "Maganbhai Adenwala Mahagujarat University, Nadiad",

    },
    {
      title: "Ethical Conduct of Research",
      date: "Feb 24, 2023",
      eventType: "Workshop",
      speaker: "Dr. Swati Roy",
      coFacilitator: "Faculty at PSMC, BU",
      venue: "IIT Gandhinagar, Gujarat",

    },
    {
      title: "Mixed Methods Research",
      date: "Feb 02, 2023",
      eventType: "Short Course",
      speaker: "Dr. Amol Dongre",
      coFacilitator: "Dr. Amol Dongre",
      venue: "Bhaikaka University Campus",

    },
    {
      title: "Qualitative Research Methods",
      date: "Jan 09, 2023",
      eventType: "Short Course",
      speaker: "Dr. Amol Dongre",
      coFacilitator: "Dr. Kallol Roy",
      venue: "Bhaikaka University Campus",
    },
    {
      title: "Research Methodology (77th Online)",
      date: "Dec 12, 2022",
      eventType: "Refresher Course",
      speaker: "Dr. Swati Roy",
      coFacilitator: "--",
      venue: "UGC-HRDC, Sardar Patel University, Anand (ONLINE)",
    },
    {
      title: "Early Breastfeeding",
      date: "Dec 12, 2022",
      eventType: "Sensitization Session",
      speaker: "Dr. Taru Jindal",
      coFacilitator: "--",
      venue: "Bhaikaka University Campus",
    },
    {
      title: "Community-Based De-addiction",
      date: "Dec 12, 2022",
      eventType: "Sensitization Session",
      speaker: "Dr. Dharav Shah",
      coFacilitator: "--",
      venue: "Bhaikaka University Campus",

    },
    {
      title: "Teaching, Learning Methods & Curriculum Development",
      date: "Dec 09, 2022",
      eventType: "Workshop",
      speaker: "Dr. Amol Dongre",
      coFacilitator: "Dr. Kallol Roy",
      venue: "Bhaikaka University Campus",

    },
    {
      title: "Leadership in Healthcare",
      date: "Nov 16, 2022",
      eventType: "Workshop",
      speaker: "Dr. Amol Dongre",
      coFacilitator: "Dr. Himanshu Pandya",
      venue: "B.U Campus",

    },
    {
      title: "FERCICON 2022",
      date: "Nov 10, 2022",
      eventType: "Conference",
      speaker: "Dr. Swati Roy (Joint Organizing Secretary)",
      coFacilitator: "--",
      venue: "Bhaikaka University Campus (ONLINE)",

    }
  ];

  const eventGallery = [
    { image: img1, description: "Aashirwad Scheme: Bringing affordable healthcare to every doorstep in Anand" },
    { image: img2, description: "SPARSH Awareness Sessions: Cultivating Knowledge, Fostering Community Progress" },
    { image: img3, description: "Building Healthier Futures: NCD camp Awareness at the grassroots" },
    { image: img4, description: "Community Wellness: NCD Screening in Action with Government Support" },
    { image: img5, description: "Ensuring Continuity: Patients Referred for Further Care at Shree Krishna Hospital" },
    { image: img6, description: "Harvesting Hope: Collaborative Organic Composting for a Sustainable Tomorrow" },

    { image: img7, description: "Healthy Habits, Happy Kids: Empowering 150 Gujarat Govt Schools through Healthy lifestyle interventions" },
    { image: img8, description: "Mapping health, saving lives: The power of a community survey" },
    { image: img9, description: "Men for Women's Health: Taking a Stand Against Cervical Cancer" },
    { image: img10, description: "Empowering the Unsung Heroes: NCD Screening for University Housekeeping Staff" },

    { image: img11, description: "Unnat Bharat Abhiyan in Practice: Next-Gen Doctors Engaged in Community Health & Participatory Research through APCPH staff" },
    { image: img12, description: "Bridging Academia and Community: Internship Exposure with APCPH" },
    { image: img13, description: "Global Collaboration, Local Impact: UMass Students Exploring Rural Healthcare in SPARSH" },
    { image: img14, description: "Extending a Lifeline: APCPH's COVID-19 Ration Distribution in Rural Anand" },

    { image: img15, description: "Empowering Remotely: APCPH's Hands-on Online Training for Village Health Workers in COVID-19" },
    { image: img16, description: "Understanding the Pandemic: Surveying COVID-19's Reach and Repercussions" },
    { image: img17, description: "Healing at Home: Community-Based Palliative Care & Rehabilitation in Rural Anand Amidst COVID-19" },
    { image: img18, description: "Community Care: Standing Together Against Diabetes – World Diabetes Day celebration at Ghuteli Village, Anand" },

    { image: img19, description: "Bridging curiosity and discovery: A one day Research Methods Workshop for UG & PG students at Amrita Patel Centre for Public Health" },
    { image: img20, description: "Young Minds, Safe Futures: Let’s Talk HIV/AIDS – World AIDS Day celebration at a higher secondary school in Fangani, Anand" },

    { image: img21, description: "Field Staff of APCPH felicitated for support in ‘Swasthya Naari Shashakt Parivaar Abhiyaan’ in Jesharva, Anand" },
    { image: img22, description: "Collaborative Government-supported Non Communicable Disease screening camp of SPARSH at Vadeli, Anand" },
    { image: img23, description: "Cervical Cancer screening camps organized across six villages of Petlad Taluka, Anand" },
    // { image: img24, description: "Training session for APCPH field staff on identification of High Risk Pregnant mothers in the community" },

    { image: img25, description: "Empowering Communities: Continuous outreach and field engagement by APCPH team" }
  ];

  const getRelatedImages = (eventTitle) => {
    const keywords = eventTitle.toLowerCase().split(" ");

    return eventGallery.filter(item =>
      keywords.some(word =>
        item.description.toLowerCase().includes(word)
      )
    );
  };


  const openGallery = (images) => {
    Fancybox.show(
      images.map(item => ({
        src: item.image.src,
        type: "image",
        caption: item.caption
      })),
      {
        Thumbs: false,
        Toolbar: {
          display: ["close"]
        }
      }
    );
  };


  return (
    <>
      <Header />
      <Innerbanner title="Seminars/Workshops" image={seminarBanner} />

      <div className="sectionPadding">
        <div className="container">
          <ul className="seminarList">
            {seminarData.slice(0, visibleCount).map((item, index) => (
              <li className="event-card" key={index}>
                <div className="eventmaincardbox">
                <div className="event-header">
                  <h4>{item.title}</h4>
                  <div className="dflex dcolumn">
                    <p className="date-badge">{item.date}</p>
                    <div className="durationline">
                      <p>Duration: 1 Day</p>
                    </div>
                  </div>
                </div>


                <div className="event-body">
                  <div className="eventBox">
                    <p className="label">Event Type</p>
                    <p className="value">{item.eventType}</p>
                  </div>
                  

                  <div className="eventBox">
                    <p className="label">Lead Facilitator(s) / Speaker</p>
                    <p className="value">{item.speaker}</p>
                  </div>
                    <div className="eventBox">
                    <p className="label">Venue / Affiliation</p>
                    <p className="value">{item.venue}</p>
                  </div>

                  <div className="eventBox">
                    <p className="label">Co-facilitator</p>
                    <p className="value">{item.coFacilitator}</p>
                  </div>

                  {/* <a href={item.galleryLink} className="gallery-link">
                    View Event Gallery →
                  </a> */}

                
                </div>
                </div>
                 {item.images?.length > 0 && (
                    <button
                      type="button"
                      className="gallery-link"
                      onClick={() => openGallery(item.images)}
                    >
                      View Event Gallery →
                    </button>
                  )}
              </li>
            ))}
          </ul>
          {visibleCount < seminarData.length && (
            <div className="text-center mt-4">
              <button
                className="loadMoreBtn"
                onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
              >
                Load More
              </button>
            </div>
          )}


        </div>
      </div>

      <Footer />
    </>
  );
}



