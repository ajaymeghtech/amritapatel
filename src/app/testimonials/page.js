"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
// import activitiesBanner from '@/app/assets/images/banner/activities_innerbanner.png';
import commonBanner from '@/app/assets/images/banner/academic-calendar-innerbanner.jpg';
import { fetchCourses } from "@/app/services/courseService";
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

export default function TestimonialsPage () {
  
  return (
    <>
      <Header />
      <Innerbanner title="Testimonals" image={commonBanner} />
      <div className="sectionPadding admissionpage">
                <div className="container">
                  
                    <div className="topmenubox">
                        <ul className="testimonial-list">
                            <li>
                                <a href="#" className="active">Studets</a>
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
                         <div className="testimonialbox">
                            <p>"Bhaikaka University has transformed my life. The faculty's dedication and the hands-on learning approach have equipped me with the skills needed to excel in my career."</p>
                            <h4>Parth Patel <span>Third Year Student (MBBS)</span></h4>
                        </div>
                          <div className="testimonialbox">
                            <p>"Bhaikaka University has transformed my life. The faculty's dedication and the hands-on learning approach have equipped me with the skills needed to excel in my career."</p>
                            <h4>Parth Patel <span>Third Year Student (MBBS)</span></h4>
                        </div>
                   </div>

                   <h1 className="mb-4 mt-6">Video Testimonials</h1>  
                   <div className="testimonialmainbox videotestimonialmainbox">
                        <div className="testimonialbox">
                            <LiteYouTubeEmbed
                                id="JSna82T2tm0"
                                title="Rick Astley - Never Gonna Give You Up"
                                />
                        </div>
                         <div className="testimonialbox">
                            <LiteYouTubeEmbed
                                id="JSna82T2tm0"
                                title="Rick Astley - Never Gonna Give You Up"
                                />
                        </div>
                          
                   </div>
                </div>
            </div>

      <Footer />
    </>
  );
}



