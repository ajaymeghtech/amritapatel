"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import "@/app/styles/scss/main.scss";
import styles from "@/app/styles/scss/components/career.module.scss";
import Innerbanner from "@/app/components/common/Innerbanner";
import careerBanner from '@/app/assets/images/career-innerbanner.jpg';
import { getCareerList } from "@/app/services/careerService";

export default function CareerPage() {

  const [careerList, setCareerList] = useState([]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchData() {
      const careers = await getCareerList();
      setCareerList(careers);
    }
    fetchData();
  }, []);

  const getFullUrl = (filePath) => {
    if (!filePath) return "#";
    if (filePath.startsWith("http")) return filePath;
    return `${API_BASE_URL}${filePath}`;
  };


  // const careerList = [
  //   { label: "Professor – Emergency Medicine", detailLink: "#" , applyLink: "#"},
  //   { label: "Associate Professor - General Surgery", detailLink: "#" , applyLink: "#"},
  //   { label: "Associate Professor - Public Health", detailLink: "#" , applyLink: "#"},
  //   { label: "Associate Professor - Immuno Haematology & Blood Transfusion", detailLink: "#" , applyLink: "#"},
  //   { label: "Associate Professor – ENT", detailLink: "#" , applyLink: "#"},
  //   { label: "Associate Professor – Paediatrics", detailLink: "#" , applyLink: "#"},
  //   { label: "Associate Professor – Skin", detailLink: "#" , applyLink: "#"},
  //   { label: "Associate Professor – Radiology", detailLink: "#" , applyLink: "#"},
  //   { label: "Associate Professor – Emergency Medicine", detailLink: "#" , applyLink: "#"},
  //   { label: "Assistant Professor - Respiratory Medicine", detailLink: "#" , applyLink: "#"}
  // ];

  return (
    <>
      <Header />
      <Innerbanner title="Career"
        image={careerBanner} />
      <div className="sectionPadding">
        <div className="container">

          <ul className={styles.careerList}>

            {careerList.length === 0 && (
              <p>No career opportunities found.</p>
            )}

            {careerList.map((item) => (
              <li key={item._id}>
                <p className={styles.label}>{item.title}</p>

                <div className={styles.buttons}>
                  <Link
                    href={getFullUrl(item.view_details)}
                    className={styles.link}
                    target="_blank"
                  >
                    View Details
                  </Link>

                  <Link
                    href={getFullUrl(item.applynow)}
                    className={styles.link}
                    target="_blank"
                  >
                    Apply Now
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* <div className="sectionPadding">
        <div className="container">
          <ul className={styles.careerList}>
            {careerList.map((item, index) => (
              <li key={index}>
                  <p className={styles.label}>{item.label}</p>
                  <div className={styles.buttons}>
                    <Link href={item.detailLink} className={styles.link}>View Details</Link>
                    <Link href={item.applyLink} className={styles.link}>Apply Now</Link>
                  </div>
              </li>
            ))}
          </ul>
        </div>
      </div> */}
      <Footer />
    </>
  );
}
