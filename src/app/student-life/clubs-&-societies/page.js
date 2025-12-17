"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import academicBanner from '@/app/assets/images/academic-calendar-innerbanner.jpg';
import { fetchCourses } from "@/app/services/courseService";

export default function ClubsAndSocietiesPage () {
  
  return (
    <>
      <Header />
      <Innerbanner title="Clubs & Societies" image={academicBanner} />

      <div className="sectionPadding">
                <div className="container">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            textAlign: "center",
                            padding: "60px 20px",
                        }}
                    >
                        <h1 style={{ fontSize: "36px", marginBottom: "15px" }}>
                            Page Coming Soon
                        </h1>

                        <p style={{ fontSize: "18px", color: "#555", maxWidth: "600px" }}>
                            This page is currently under development. Please check back soon!
                        </p>
                    </div>
                </div>
            </div>

      <Footer />
    </>
  );
}



