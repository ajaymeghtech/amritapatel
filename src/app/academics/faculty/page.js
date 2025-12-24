"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import academicBanner from '@/app/assets/images/banner/academics_innerbanner.png';

export default function Faculty() {
  return (
    <>
      <Header />
      <Innerbanner title="Faculty" image={academicBanner} />
      <div className="sectionPadding">
        <div className="container">
          <div className="table-responsive">
            <table className="courseTable table-bordered facultyTable">
              <thead>
                <tr>
                  <th> Faculty </th>
                  <th> Qualification </th>
                  <th> CV </th>
                  <th>Designation</th>
                  <th> Availability </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dr. Deepak B. Sharma</td>
                  <td> M.D (Community Medicine), Ph.D. (Psychiatry), PGCIH (PG Certificate Course in Industrial Health), ACME (Advanced Course in Medical Education)</td>
                  <td><a href="/pdfs/deepak-sharma.pdf" target="_blank">View Detail </a></td>
                  <td>Director</td>
                  <td>Full-Time</td>
                </tr>
                <tr>
                  <td>Dr. Kallol Roy</td>
                  <td> Ph.D., PG Diploma(Environmental & Occupational Health), FAGE </td>
                  <td><a href="/pdfs/CV_KR_2025_JUN.pdf" target="_blank">View Detail </a></td>
                  <td> Assistant Professor & Academic Coordinator </td>
                  <td>Full-Time</td>
                </tr>
                <tr>
                  <td>Ms. Nasreen G Bha</td>
                  <td> MPH </td>
                  <td><a href="#" target="_blank">View Detail </a></td>
                  <td>Assistant Professor</td>
                  <td>Full-Time</td>
                </tr>
                <tr>
                  <td>Dr. Swati A Roy</td>
                  <td>MPH, B.Ed., Ph.D. Public Health (Pursuing)</td>
                  <td><a href="/pdfs/SAR_CV.pdf" target="_blank">View Detail </a></td>
                  <td>Assistant Professor</td>
                  <td>Full-Time</td>
                </tr>
                <tr>
                  <td colSpan={5}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}




