"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import commonBanner from '@/app/assets/images/banner/academic-calendar-innerbanner.jpg';
import { fetchCourses } from "@/app/services/courseService";

export default function Testimonials() {
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
            <Innerbanner title="Testimonials" image={commonBanner} />
           <div className="sectionPadding admissionpage">
                <div className="container">
                  
                    <div className="topmenubox">
                        <ul className="testimonial-list">
                            <li>
                                <a href="#">Studets</a>
                            </li>
                            <li>
                                <a href="#">Faculty</a>
                            </li>
                            <li>
                                <a href="#">Community</a>
                            </li>
                        </ul>
                    </div>  
                   <h1 className="mb-4">Written Testimonials</h1>  
                   <div className="testimonialmainbox">
                        <div className="testimonialbox">
                            <p>"Bhaikaka University has transformed my life. The faculty's dedication and the hands-on learning approach have equipped me with the skills needed to excel in my career."</p>
                            <h4>Parth Patel <span>Third Year Student (MBBS)</span></h4>
                        </div>
                          <div className="testimonialbox">
                            <p>"Bhaikaka University has transformed my life. The faculty's dedication and the hands-on learning approach have equipped me with the skills needed to excel in my career."</p>
                            <h4>Parth Patel <span>Third Year Student (MBBS)</span></h4>
                        </div>
                   </div>
                </div>
            </div>
            <Footer />
        </>
    );
}




