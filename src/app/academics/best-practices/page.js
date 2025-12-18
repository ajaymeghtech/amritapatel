"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import academicBanner from '@/app/assets/images/banner/academics_innerbanner.png';

export default function ExaminationResults() {

    return (
        <>
            <Header />
            <Innerbanner title="Best Practices" image={academicBanner} />

            <div className="aboutinnerSec sectionPadding">
                <div className="container">
                    <div className="sectionheading">Best Practices</div>
                    <div className="admissioneeligibilityDes">
                        <ul className="admissionList">
                            <li>Community-Centric Approach: We prioritize active community engagement to identify needs and priorities through assessments, ensuring our programs are highly relevant and effective </li>
                            <li>Strategic Partnerships: We foster collaborative partnerships with diverse stakeholders to achieve a comprehensive and coordinated approach to public health education</li>
                            <li>Tailored Learning Experiences: Content and methods are meticulously tailored to the target audience's learning styles and specific objectives, often incorporating innovative techniques like simulation-based learning </li>
                            <li>CProficient Educators: Our programs are delivered by proficient and well-trained educators who maintain fidelity to the program model, ensuring high-quality instruction</li>
                            <li>Accessible Delivery: We prioritize accessible delivery of programs in convenient settings to maximize participant engagement and reach</li>
                            <li>Continuous Quality Improvement: We are committed to continuous evaluation and improvement, regularly assessing the relevance, effectiveness, efficiency, and sustainability of our educational programs</li>
                            <li>Promotion of Healthy Habits: Our learning environments are designed to promote healthy habits as lifelong practices, providing access to resources that support well- being</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}



