"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "@/app/styles/scss/main.scss";
import Innerbanner from "@/app/components/common/Innerbanner";
import campusBanner from "@/app/assets/images/campus-innerbanner.jpg";
import Image from "next/image";
import { fetchCMSByKey } from '@/app/services/cmsService';
import { fetchCampuslife } from '@/app/services/campuslifeService';

// Separate component that uses useSearchParams
function CampusLifeContent() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [openIndex, setOpenIndex] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [campusData, setCampusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const refs = useRef([]);

  const params = useParams();
  const searchParams = useSearchParams();

  const slug = params.slug;
  const id = searchParams.get("id");

  useEffect(() => {
    async function loadData() {
      try {
        const cms = await fetchCMSByKey("campus-life");
        setPageData(cms);

        let campusLifeData = await fetchCampuslife(id);
        campusLifeData = campusLifeData.images;
        setCampusData(campusLifeData);

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    // loadData();
  }, [id]);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <>
        <Header />
        <Innerbanner title="Campus Life" image={campusBanner} />
        <div className="sectionPadding">
          <div className="container">
            <p className="text-center">Loading campus life information...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (campusData.length === 0) {
    return (
      <>
        <Header />
        <Innerbanner title={pageData?.title || "Campus Life"} image={pageData?.banner_image || campusBanner} />
        <div className="sectionPadding">
          <div className="container">
            <p className="text-center">No campus life information available.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Innerbanner title={pageData?.title} image={pageData?.banner_image} />

      <div className="sectionPadding">
        <div className="container">
          <div
            className="text-center"
            dangerouslySetInnerHTML={{ __html: pageData?.content }}
          />

          <div className="accordionWrapper" id="myAccordion">
            {campusData.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="accordionItem">
                  <div
                    className="accordionHeader"
                    onClick={() => handleToggle(index)}
                  >
                    <p className="title">{item.title}</p>
                    <span className="icon">{isOpen ? "−" : "+"}</span>
                    <span className="shape"></span>
                  </div>
                  <div
                    className="accordionBody"
                    ref={(el) => (refs.current[index] = el)}
                    style={{
                      height: isOpen ? refs.current[index]?.scrollHeight : 0,
                    }}
                  >
                    <div className="accordionContent">
                      <div className="accordionText">{item.description}</div>

                      {item.image && (
                        <div className="rightImageSec">
                          <Image
                            src={`${API_BASE_URL}${item?.image}`}
                            alt={item.title}
                            className="img-fluid rightImage"
                            width={400}
                            height={300}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// Main export with Suspense wrapper
export default function CampusLifePage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <Innerbanner title="Campus Life" image={campusBanner} />
        <div className="sectionPadding">
          <div className="container">
            <p className="text-center">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    }>
      <CampusLifeContent />
    </Suspense>
  );
}