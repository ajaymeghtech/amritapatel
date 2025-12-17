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


    const openGallery = (index) => {
        Fancybox.show(
            councilMembers.map((item) => ({
                src: item.image.src,
                thumb: item.image.src,
                caption: item.description,
            })),
            {
                startIndex: index,
            }
        );
    };
    return (
        <>
            <Header />
            <Innerbanner title="Gallery" image={commonBanner} />
            <div className="advisoryCouncilSec sectionPadding">
                <div className="container">
                    <div className="row">
                        {councilMembers.map((member, index) => (
                            <div
                                className="col-lg-3 col-md-4 col-sm-6 col-12"
                                key={index}
                            >
                                <div className="councilBox">
                                    <Image
                                        src={member.image}
                                        alt="galleryimg"
                                        height={600}
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




