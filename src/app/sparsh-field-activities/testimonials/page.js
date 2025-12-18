"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import commonBanner from '@/app/assets/images/banner/academic-calendar-innerbanner.jpg';
import { fetchCourses } from "@/app/services/courseService";
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

export default function Testimonials() {
    const [activeTab, setActiveTab] = useState("students");


    const testimonialsData = {
        students: {
            written: [
                {
                    text: "Bhaikaka University has transformed my life. The faculty's dedication and the hands-on learning approach have equipped me with the skills needed to excel in my career.",
                    name: "Parth Patel",
                    role: "Third Year Student (MBBS)"
                },
                {
                    text: "The exposure to real-world medical scenarios helped me gain confidence and clarity in my profession.",
                    name: "Riya Shah",
                    role: "Final Year Student (MBBS)"
                }
            ],
            videos: [
                { id: "xfOHCLArwO0", title: "Student Testimonial 1" },
                { id: "xfOHCLArwO0", title: "Student Testimonial 2" }
            ]
        },

        faculty: {
            written: [
                {
                    text: "Teaching at Bhaikaka University has been a deeply fulfilling experience. The institution promotes innovation, research, and student-centered learning.",
                    name: "Dr. Amit Desai",
                    role: "Professor, Community Medicine"
                },
                {
                    text: "The academic environment encourages interdisciplinary collaboration and continuous professional growth.",
                    name: "Dr. Neha Mehta",
                    role: "Associate Professor"
                }
            ],
            videos: [
                { id: "xfOHCLArwO0", title: "Faculty Testimonial 1" }
            ]
        },

        community: {
            written: [
                {
                    text: "The university’s outreach programs have significantly improved healthcare awareness in our village.",
                    name: "Rameshbhai Patel",
                    role: "Community Leader, Anand"
                },
                {
                    text: "Health camps and awareness sessions conducted by the university have benefited our families immensely.",
                    name: "Savitaben Patel",
                    role: "Beneficiary, Community Health Program"
                }
            ],
            videos: [
                { id: "xfOHCLArwO0", title: "Community Testimonial 1" }
            ]
        }
    };


    return (
        <>
            <Header />
            <Innerbanner title="Testimonials" image={commonBanner} />
            <div className="sectionPadding admissionpage">
                <div className="container">
                    <div className="topmenubox">
                        <ul className="testimonial-list">
                            <li>
                                <a
                                    href="#"
                                    className={activeTab === "students" ? "active" : ""}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab("students");
                                    }}
                                >
                                    Students
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className={activeTab === "faculty" ? "active" : ""}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab("faculty");
                                    }}
                                >
                                    Faculty
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className={activeTab === "community" ? "active" : ""}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab("community");
                                    }}
                                >
                                    Community
                                </a>
                            </li>
                        </ul>

                    </div>
                    <h1 className="mb-4">Written Testimonials</h1>
                    <div className="testimonialmainbox">
                        {testimonialsData[activeTab].written.map((item, index) => (
                            <div className="testimonialbox" key={index}>
                                <p>"{item.text}"</p>
                                <h4>
                                    {item.name} <span>{item.role}</span>
                                </h4>
                            </div>
                        ))}
                    </div>


                    <h1 className="mb-4 mt-6">Video Testimonials</h1>
                    <div className="testimonialmainbox videotestimonialmainbox">
                        {testimonialsData[activeTab].videos.map((video, index) => (
                            <div className="testimonialbox" key={index}>
                                <LiteYouTubeEmbed id={video?.id} title={video?.title} />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}




