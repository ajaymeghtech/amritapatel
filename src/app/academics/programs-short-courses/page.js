"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import academicBanner from '@/app/assets/images/banner/academics_innerbanner.png';
import { fetchCourses } from "@/app/services/courseService";

export default function ProgramsShortCourses() {
  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadCourses() {
      const data = await fetchCourses();
      if (data) {
        // Sort by sortOrder
        const sorted = data.sort((a, b) => a.sortOrder - b.sortOrder);
        setCourses(sorted);
      }
      // setCourses(data);
    }
    loadCourses();
  }, []);

  console.log("Courses Data:", courses);

  return (
    <>
      <Header />
      <Innerbanner title="Programs & Short Courses" image={academicBanner} />

      <div className="sectionPadding">
        <div className="container">
          <div className="table-responsive">
            {/* <table className="courseTable table-bordered leftTdBg">
              <thead>
                  <tr>
                      <th></th>
                      <th>Master of Public Health - Working Professionals (MPH) (to be commencing from Academic Year 2026)</th>
                      <th>Master of Public Health (MPH)</th>
                      <th>Master of Hospital Administration (MHA)</th>
                      <th>Ph.D. in Public Health (from Dr. Madhavi Patel)</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>Duration</td>
                      <td>Two Years; Semester wise</td>
                      <td>Two Years, Semester wise</td>
                      <td>Two Years; Semester wise</td>
                      <td></td>
                  </tr>
                    <tr>
                      <td>Teaching Approach</td>
                      <td>Didactic, interactive sessions, seminars, assignments, problem- based learning approaches</td>
                      <td> Didactic, interactive sessions, social case presentations, seminars, journal clubs</td>
                      <td>Didactic, interactive sessions, social case presentations, seminars, journal clubs</td>
                      <td></td>
                  </tr>
                    <tr>
                      <td>Eligibility</td>
                      <td>Health professionals with at least four years of work experience</td>
                      <td>Graduates from recognized universities in India & abroad with minimum 50% aggregate marks in final year</td>
                      <td>Graduates from recognized universities in India & abroad with minimum 50% aggregate marks in final year</td>
                      <td></td>
                  </tr>
                    <tr>
                      <td>Program Fees (INR)</td>
                      <td>45,000 per year</td>
                      <td> 	45,000 per year </td>
                      <td> 60,000 per year </td>
                      <td></td>
                  </tr>
                    <tr>
                      <td>Preference</td>
                      <td> Graduates in Medicine (MBBS), Dentistry (BDS), Bachelor of Ayurvedic Medicine and Surgery (BAMS), Bachelor of Unani Medicine and Surgery (BUMS), Bachelor of Siddha Medicine and Surgery (BSMS), B.Tech or BE (any branch)/Graduates of four-year degree programme in Veterinary Sciences, Nursing Sciences, Physio/Occupational </td>
                      <td> Graduate/postgraduates in Science, Mathematics, Statistics, Biostatistics, Demography, Population studies, Nutrition, Economics, Psychology, Sociology, Anthropology, Social work, Management</td>
                      <td> Graduate/postgraduates in Science, Mathematics, Statistics, Biostatistics, Demography, Population studies, Nutrition, Economics, Psychology, Sociology, Anthropology, Social work, Management </td>
                      <td></td>
                  </tr>
                    <tr>
                      <td>Key Features</td>
                      <td> Job enrichment program for working professionals in the domain of public health and leadership </td>
                      <td> Hands-on training and experiential learning through ongoing community-based program </td>
                      <td> Hands-on training at a 1000-bed NABH & NABL accredited multispecialty hospital, including Cancer, Cardiac, and Bone Marrow Transplant centers </td>
                      <td></td>
                  </tr>

              </tbody>
              </table> */}

            <table className="courseTable table-bordered leftTdBg">
              <thead>
                <tr>
                  <th className="text-center"> </th>
                  <th>Master of Public Health (MPH) - Regular</th>
                  <th>Master of Public Health - Working Professionals (MPH)</th>
                  <th>Master of Hospital Administration (MHA)</th>
                  <th>Master of Hospital Administration - Working Professionals (MHA) <span className="upcoming">UPCOMING</span></th>
                  <th>Ph.D. in Public Health</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Duration</td>
                  <td>Two Years; Semester wise</td>
                  <td>Two Years; Semester wise</td>
                  <td>Two Years; Semester wise</td>
                  <td>Two Years; Semester wise</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Teaching Approach</td>
                  <td>
                    Didactic, interactive sessions, social case presentations, seminars, journal clubs
                  </td>
                  <td>
                    Didactic, interactive sessions, seminars, assignments, problem based learning approaches
                  </td>
                  <td>
                    Didactic, interactive sessions, hospital case presentations, seminars, journal clubs
                  </td>
                  <td>
                    Didactic, interactive sessions, hospital case presentations, seminars, journal clubs
                  </td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Eligibility</td>
                  <td>Graduates from recognized universities in India & abroad with minimum 50% aggregate marks in final year</td>
                  <td>Professionals with minimum of one year work experience</td>
                  <td>Graduates from recognized universities in India & abroad with minimum 50% aggregate marks in final year</td>
                  <td>Professionals with minimum of one year work experience</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Program Fees (INR)</td>
                  <td>45,000 per year*</td>
                  <td>45,000 per year*</td>
                  <td>60,000 per year*</td>
                  <td>60,000 per year*</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Preference</td>
                  <td>
                    Graduate/postgraduates in Science, Mathematics, Statistics, Biostatistics, Demography, Population studies , Nutrition, Economics, Psychology, Sociology, Anthropology, Social work, Management
                  </td>
                  <td>
                    Medical and Allied Health Sciences: MBBS, BDS, AYUSH, Nursing, Veterinary Sciences, Physiotherapy, Pharmacy and Occupational Therapy.
                    Other Relevant Disciplines: Graduates with degrees in Science, Mathematics, Statistics, Economics, Engineering, Environmental science, Nutrition, and Demography are also eligible, provided their work experience is in the health sector.
                  </td>
                  <td>
                    Candidates possessing a bachelor’s degree in disciplines including, but not limited to, medicine and surgery, dentistry, physiotherapy, AYUSH, health and allied paramedical sciences, and nursing, encompassing subjects such as biology, biochemistry, zoology, biotechnology and life sciences.
                  </td>
                  <td>
                    Candidates possessing a bachelor’s degree in disciplines including, but not limited to, medicine and surgery, dentistry, physiotherapy, AYUSH, health and allied paramedical sciences, and nursing, encompassing subjects such as biology, biochemistry, zoology, biotechnology and life sciences.
                  </td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Key Features</td>
                  <td>Hands-on training and experiential learning through ongoing community based program</td>
                  <td>Job enrichment program for working professionals in the domain of public health and leadership</td>
                  <td>Hands-on training and experiential learning at attached 1000 bedded NABH, NABL accredited multispecialty hospital, Cancer, Cardiac, Bone marrow transplant centre</td>
                  <td>Hands-on training and experiential learning at attached 1000 bedded NABH, NABL accredited multispecialty hospital, Cancer, Cardiac, Bone marrow transplant centre</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Intake</td>
                  <td>10 seats per academic year</td>
                  <td>10 seats per academic year</td>
                  <td>10 seats per academic year</td>
                  <td>10 seats per academic year</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Hostel Facility</td>
                  <td>Separate hostels available on first come first serve basis</td>
                  <td>NA</td>
                  <td>Separate hostels available on first come first serve basis</td>
                  <td>NA</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan={5}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="sectionPadding sectionPaddingTop">
        <div className="container">
          <h2 className="sectionheading">Short Courses for all Health Professionals</h2>
          <div className="table-responsive">
            <table className="courseTable table-bordered shortCourse">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Qualitative Methods in Health Research</td>
                  <td>	5 Days</td>
                </tr>
                <tr>
                  <td>Mixed Methods Research</td>
                  <td>	2 Days</td>
                </tr>
                <tr>
                  <td> Meta-Analysis </td>
                  <td>	2 Days </td>
                </tr>
                <tr>
                  <td> Epidemiology </td>
                  <td>	Upcoming </td>
                </tr>
                <tr>
                  <td> Biostatistics </td>
                  <td>	Upcoming </td>
                </tr>
                <tr>
                  <td> Occupational Health </td>
                  <td>	Upcoming </td>
                </tr>
                <tr>
                  <td> Rural Sensitization Program </td>
                  <td>	Upcoming </td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
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




