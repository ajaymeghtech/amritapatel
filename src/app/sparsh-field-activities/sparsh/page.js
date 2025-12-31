"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import sparshBanner from '@/app/assets/images/banner/sparsh_testimonial_banner.jpg';

import { fetchCourses } from "@/app/services/courseService";

export default function Sparsh() {
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
            <Innerbanner title="SPARSH" image={sparshBanner} />
            <div className="sectionPadding">
                <div className="container">
                    <p>Charutar Arogya Mandal (CAM) [currently the sponsoring body of Bhaikaka
                        University] has been implementing Shree Krishna Hospital Program for
                        Advancement of Rural and Social Health (SPARSH) as a community-based
                        primary healthcare NCD model since the year 2015-16. This program has been
                        successful in development of the conceptual model of care, undertaking the
                        village level enumeration to identify beneficiaries, select and train
                        village level health workers in NCD care, develop treatment protocols and
                        health education materials, and provide individualised health care to NCD
                        patients at village level through health screening camps.
                    </p>
                    <p>
                        Over period of time, we at APCPH are including different field based
                        activities other than NCD like Maternal mortality, adolescent health,
                        WASH(Water, Sanitation & Hygeine) and Mental health screening.</p>
                </div>
            </div>
            <Footer />
        </>
    );
}




