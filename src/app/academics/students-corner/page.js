"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "@/app/styles/scss/main.scss";
import Innerbanner from "@/app/components/common/Innerbanner";
import studentBanner from '@/app/assets/images/banner/student_corner_banner.png';
import pdf from '@/app/assets/images/pdf.png';
import Image from "next/image";

export default function StudentCorner() {

    const publications = [
        {
            name: "APCPH Student Handbook",
            file: "/pdfs/studentcorner/APCPH_Student_Handbook.pdf",
        },
        {
            name: "Curriculum Module",
            file: "/pdfs/studentcorner/curriculum_module.pdf",
        },
    ];


    return (
        <>
            <Header />
            <Innerbanner title="Students Corner" image={studentBanner} />

            <div className="publicationSec sectionPadding">
                <div className="container">

                    <div className="row">
                        {publications.map((item, index) => (
                            <div
                                key={index}
                                className="col-lg-3 col-md-4 col-sm-6 col-xs-6 col-12 p-3"
                            >
                                <a
                                    href={item.file}
                                    className="pdfBox"
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Image
                                        src={pdf}
                                        alt="pdf"
                                        width={60}
                                        height={60}
                                        className="img-fluid mb-2"
                                    />
                                    <p>{item.name}</p>
                                </a>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            {/* <div className="sectionPadding">
                <div className="container">
                    <div className="table-responsive">
                        <table className="courseTable table-bordered facultyTable">
                            <thead>
                                <tr>
                                    <th>Domains</th>
                                    <th>To be Ready in a File/Soft copy Document (Wherever applicable)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <ul>
                                            <li>Master of Public Health (MPH)</li>
                                            <li>Master in Hospital Administration (MHA)</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <ul>
                                            <li>Curriculum Details (Both Regular/Working Professionals)</li>
                                            <li>No. of courses per semester</li>
                                            <li>Course Teaching contents semester wise</li>
                                            <li>CO-PO matrix</li>
                                            <li>Teaching Methods</li>
                                            <li>Practical components</li>
                                            <li>Details of visits with Specific Learning Objectives</li>
                                            <li>Exam details including Internal exams and University exams</li>
                                            <li>Admission Eligibility</li>
                                            <li>Fees structure</li>
                                            <li>Admission process</li>
                                            <li>Scholarship, if available</li>
                                            <li>Hostel accommodation</li>
                                            <li>Anti-ragging Measures</li>
                                            <li>Mess/Canteen facilities in campus</li>
                                            <li>Facilities available in campus</li>
                                            <li>Other constituent institutes of campus</li>
                                            <li>Student support cell</li>
                                            <li>Mentorship program</li>
                                            <li>Grievance addressal if any</li>
                                            <li>Leaves provision</li>
                                            <li>Attendance</li>
                                            <li>Miscellaneous information, if any</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> */}

            <Footer />
        </>
    );
}
