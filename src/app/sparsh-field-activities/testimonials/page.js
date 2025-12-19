"use client";
import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "@/app/styles/scss/main.scss";
import Innerbanner from "@/app/components/common/Innerbanner";
import commonBanner from "@/app/assets/images/banner/academic-calendar-innerbanner.jpg";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

export default function Testimonials() {

  const studentTestimonials = {
    written: [
      {
        text: "Bhaikaka University has transformed my life. The faculty's dedication and the hands-on learning approach have equipped me with the skills needed to excel in my career.",
        name: "Parth Patel",
        role: "Third Year Student (MBBS)",
      },
      {
        text: "The exposure to real-world medical scenarios helped me gain confidence and clarity in my profession.",
        name: "Riya Shah",
        role: "Final Year Student (MBBS)",
      },
    ],
    videos: [
      { id: "xfOHCLArwO0", title: "Student Testimonial 1" },
      { id: "xfOHCLArwO0", title: "Student Testimonial 2" },
    ],
  };

  return (
    <>
      <Header />

      <Innerbanner title="Testimonials" image={commonBanner} />

      <div className="sectionPadding admissionpage">
        <div className="container">

          {/* Written Testimonials */}
          <div className="testimonialmainbox">
            {studentTestimonials.written.map((item, index) => (
              <div className="testimonialbox" key={index}>
                <p>"{item.text}"</p>
                <h4>
                  {item.name} <span>{item.role}</span>
                </h4>
              </div>
            ))}
          </div>

          {/* Video Testimonials */}
          <div className="testimonialmainbox videotestimonialmainbox mt-5">
            {studentTestimonials.videos.map((video, index) => (
              <div className="testimonialbox" key={index}>
                <LiteYouTubeEmbed
                  id={video.id}
                  title={video.title}
                />
              </div>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
