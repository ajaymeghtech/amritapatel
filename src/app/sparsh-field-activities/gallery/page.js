"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import commonBanner from '@/app/assets/images/banner/academic-calendar-innerbanner.jpg';
import { fetchCourses } from "@/app/services/courseService";
import dr_utpala from "@/app/assets/images/dr_utpala.jpg";
import nextIcon from "@/app/assets/images/next.png";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { fetchHomeGallery } from '@/app/services/galleryService';
import { getGalleryImageUrl } from '@/app/services/galleryService';
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

export default function Gallery() {
    const [gallery, setGallery] = useState([]);

    useEffect(() => {

        async function loadGallery() {
            try {
                const data = await fetchHomeGallery();
                setGallery(data);
                console.log("Gallery Data:", data);
            } catch (error) {
                console.error("Error loading gallery:", error);
            }
        }

        loadGallery();
    }, []);


    const councilMembers = [
        {
            id: 1,
            title: "Aashirwad Scheme",
            year: "2024",
            image: [img3],
            description: "Aashirwad Scheme: Bringing affordable healthcare to every doorstep in Anand",
        },
        { id: 2, title: "SPARSH Awareness Sessions", year: "2025", image: [img2], description: "SPARSH Awareness Sessions: Cultivating Knowledge, Fostering Community Progress" },
        { id: 3, title: "Building Healthier Futures", year: "2024", image: [img3], description: "Building Healthier Futures: NCD camp Awareness at the grassroots" },
        { id: 4, title: "Community Wellness", year: "2025", image: [img4], description: "Community Wellness: NCD Screening in Action with Government Support" },
        { id: 5, title: "Ensuring Continuity", year: "2024", image: [img5, img5], description: "Ensuring Continuity: Patients Referred for Further Care at Shree Krishna Hospital" },
        { id: 6, title: "Harvesting Hope", year: "2023", image: [img6], description: "Harvesting Hope: Collaborative Organic Composting for a Sustainable Tomorrow" },
        { id: 7, title: "Healthy Habits, Happy Kids", year: "2023", image: [img7], description: "Healthy Habits, Happy Kids: Empowering 150 Gujarat Govt Schools through Healthy lifestyle interventions" },
        { id: 8, title: "Mapping Health, Saving Lives", year: "2023", image: [img8], description: "Mapping health, saving lives: The power of a community survey" },
        { id: 9, title: "Men for Women's Health", year: "2021", image: [img9], description: "Men for Women's Health: Taking a Stand Against Cervical Cancer" },
        { id: 10, title: "Empowering the Unsung Heroes", year: "2022", image: [img10], description: "Empowering the Unsung Heroes: NCD Screening for University Housekeeping Staff" },
        { id: 11, title: "Unnat Bharat Abhiyan in Practice", year: "2023", image: [img11], description: "Unnat Bharat Abhiyan in Practice: Next-Gen Doctors Engaged in Community Health & Participatory Research through APCPH staff" },
        { id: 12, title: "Bridging Academia and Community", year: "2023", image: [img12], description: "Bridging Academia and Community: Internship Exposure with APCPH" },
        { id: 13, title: "Global Collaboration, Local Impact", year: "2023", image: [img13], description: "Global Collaboration, Local Impact: UMass Students Exploring Rural Healthcare in SPARSH" },
        { id: 14, title: "Extending a Lifeline", year: "2024", image: [img14], description: "Extending a Lifeline: APCPH's COVID-19 Ration Distribution in Rural Anand" },
        { id: 15, title: "Empowering Remotely", year: "2020", image: [img15], description: "Empowering Remotely: APCPH's Hands-on Online Training for Village Health Workers in COVID-19" },
        { id: 16, title: "Understanding the Pandemic", year: "2020", image: [img17, img16], description: "Understanding the Pandemic: Surveying COVID-19's Reach and Repercussions" },
        { id: 17, title: "Healing at Home", year: "2025", image: [img4], description: "Healing at Home: Community-Based Palliative Care & Rehabilitation in Rural Anand Amidst COVID-19" },
        { id: 18, title: "Community Care", year: "2025", image: [img18], description: "Community Care: Standing Together Against Diabetes – World Diabetes Day celebration at Ghuteli Village, Anand" },
        { id: 19, title: "Bridging Curiosity and Discovery", year: "2025", image: [img19], description: "Bridging curiosity and discovery: A one day Research Methods Workshop for UG & PG students at Amrita Patel Centre for Public Health" },
        { id: 20, title: "Young Minds, Safe Futures", year: "2021", image: [img20], description: "Young Minds, Safe Futures: Let’s Talk HIV/AIDS – World AIDS Day celebration at a higher secondary school in Fangani, Anand" },
        { id: 21, title: "Field Staff Felicitation", year: "2022", image: [img21], description: "Field Staff of APCPH felicitated for support in ‘Swasthya Naari Shashakt Parivaar Abhiyaan’ in Jesharva, Anand" },
        { id: 22, title: "Collaborative NCD Screening Camp", year: "2024", image: [img22], description: "Collaborative Government-supported Non Communicable Disease screening camp of SPARSH at Vadeli, Anand" },
        { id: 23, title: "Cervical Cancer Screening Camps", year: "2025", image: [img23], description: "Cervical Cancer screening camps organized across six villages of Petlad Taluka, Anand" },
        // { id: 24, image: [img24], description: "Training session for APCPH field staff on identification of High Risk Pregnant mothers in the community" },
        { id: 25, image: [img25], title: 'Empowering Communities', description: "Empowering Communities: Continuous outreach and field engagement by APCPH team" },
    ];


    // Year filter state
    const [selectedYear, setSelectedYear] = useState("All");
    const years = Array.from(new Set(councilMembers.map((m) => m.year).filter(Boolean))).sort();
    const yearOptions = ["All", ...years];
    const filteredMembers = selectedYear === "All" ? councilMembers : councilMembers.filter((m) => m.year === selectedYear);

    // Open Fancybox showing only the clicked member's images (accepts member object)
    const openGallery = (item) => {
        if (!item) return;
        const imgs = Array.isArray(item.image) ? item.image : [item.image];
        const items = imgs.map((img) => ({
            src: img.src ?? img,
            thumb: img.src ?? img,
            caption: item.description,
            title: item.title,
            year: item.year,
        }));
        Fancybox.show(items, { startIndex: 0 });
    };

   const MagnifierIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Magnifier circle */}
    <circle
      cx="11"
      cy="11"
      r="7"
      stroke="white"
      strokeWidth="2"
    />

    {/* Plus sign */}
    <line
      x1="11"
      y1="8"
      x2="11"
      y2="14"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="11"
      x2="14"
      y2="11"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Handle */}
    <line
      x1="16.65"
      y1="16.65"
      x2="21"
      y2="21"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);


    return (
        <>
            <Header />
            <Innerbanner title="Gallery" image={commonBanner} />
            <div className="advisoryCouncilSec sectionPadding gallerypage">
                <div className="container">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <div className="d-flex align-items-center flex-end">
                                <label className="me-2" htmlFor="yearFilter">Select Year:</label>
                                <select id="yearFilter" className="form-select w-auto" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                    {yearOptions.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {filteredMembers.map((member, index) => (
                            <div
                                className="col-lg-3 col-md-4 col-sm-6 col-12" style={{ cursor: "pointer" }}
                                key={index} onClick={() => openGallery(member)}
                            >
                                <div className="councilBox">
                                    <Image
                                        src={Array.isArray(member.image) ? member.image[0] : member.image}
                                        alt={member.title || 'galleryimg'}
                                        height={600}
                                        className="img-fluid"
                                    />
                                    <h4>{member?.title}</h4>
                                    <a
                                        style={{ cursor: "pointer" }}
                                        onClick={() => openGallery(member)}
                                    >
                                        {/* <Image
                                            src={nextIcon}
                                            alt="open modal"
                                            width={64}
                                            height={64}
                                            className="img-fluid"
                                        /> */}
                                        <MagnifierIcon />
                                    </a>
                                </div>

                            </div>
                        ))}

                        {/* {gallery.map((item, index) => (
                            <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={index}>
                                <div className="councilBox">
                                    <img
                                        src={getGalleryImageUrl(item.image)}
                                        alt={item.description}
                                        className="img-fluid"
                                    />

                                    <a
                                        style={{ cursor: "pointer" }}
                                        onClick={() => openGallery(index)}
                                    >
                                        <Image
                                            src={nextIcon}
                                            alt="open modal"
                                            width={64}
                                            height={64}
                                            className="img-fluid"
                                        />
                                    </a>
                                </div>
                            </div>
                        ))} */}


                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}




