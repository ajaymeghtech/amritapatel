"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import projectBanner from '@/app/assets/images/project_banner.png';

export default function OngoingProjects() {

  return (
    <>
      <Header />

      {/* Title from API */}
      <Innerbanner
        title={"Projects & Grants"}
      image={projectBanner} 
      />

      <div className="sectionPadding">
        <div className="container">
          <div>
            <h2 className="sectionheading">Funded Research Projects</h2>
            <div className="table-responsive">
              <p>The Centre is a new establishment, but the contribution to community health has been a tale of decades for us. Community health is intrinsic to our existence, and our interventions have been generously, and regularly supported by like-minded ones, who have the resources, counting on the expertise and commitment with which we have thrived.</p>
            </div>
          </div>
          <div>
            <h2 className="sectionheading sectionPaddingTop">Few Recent Projects</h2>

            <div className="table-responsive">
              <table className="courseTable table-bordered projectTable">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Duration</th>
                    <th>Funding Agency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>SPARSH 3.0</td>
                    <td>2025 - 2028</td>
                    <td>GMM Pfaudler Limited, Karamsad</td>
                    <td>Ongoing</td>
                  </tr>
                  <tr>
                    <td>Health Leadership Enhancement Programme - Third Party Evaluation</td>
                    <td>2025 (Oct-Nov)</td>
                    <td>Indian Institute of Public Health (IIPH), Gandhinagar & State Health System and Resource Centre (SHSRC), Ahemdavad</td>
                    <td>Completed</td>
                  </tr>
                  <tr>
                    <td>Women Empowerment-Cancer Awareness Nexus (WE-CAN): An Implementation Research Study of Cervical Cancer Prevention through HPV Self-Sampling and Education in India</td>
                    <td>2023 - 2026</td>
                    <td>Indian Council of Medical Research (ICMR) and Canadian Institute of Health Research (CIHR)</td>
                    <td>Ongoing</td>
                  </tr>
                  <tr>
                    <td>SPARSH 2.0</td>
                    <td> 2022-2025 </td>
                    <td> GMM Pfaudler Foundation </td>
                    <td>Completed</td>
                  </tr>
                  <tr>
                    <td> Innovation and Learning Centre</td>
                    <td>2018 - 2024</td>
                    <td> National Health System and Resource Centre (NHSRC), New Delhi </td>
                    <td>Completed</td>
                  </tr>
                  <tr>
                    <td> Innovation Learning Centre - Dahod Block</td>
                    <td> 2018-2021</td>
                    <td> National Health Systems Resource Centre (NHSRC), New Delhi </td>
                    <td>Completed</td>
                  </tr>
                  <tr>
                    <td>SPARSH - 150</td>
                    <td> 2018-2021</td>
                    <td> Sir Dorabji Tata Trust & GMM Pfaudler Ltd.</td>
                    <td>Completed</td>
                  </tr>
                  <tr>
                    <td>Shree Krishna Hospital Programme for Advancement of Rural and social health (SPARSH)</td>
                    <td>2016-2018</td>
                    <td> GMM Pfaudler Ltd. & Shamdasani Foundation</td>
                    <td>Completed</td>
                  </tr>
                  <tr>
                    <td> Cancer Prevention and Care Programme</td>
                    <td> 2014-2017</td>
                    <td> Sir Dorabji Tata Trust	</td>
                    <td>Completed</td>
                  </tr>
                  <tr>
                    <td colSpan={4}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}



