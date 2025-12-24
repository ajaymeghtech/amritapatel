"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import publiationBanner from '@/app/assets/images/banner/publiation_innerbanner.png';
import pdf from '@/app/assets/images/pdf.png';

export default function Publications() {

    const publications = [
        {
            name: "Dr. Deepak B. Sharma",
            file: "/pdfs/Deepak_Sharma_List_of_Publications.pdf",
        },
        {
            name: "Dr. Kallol Roy",
            file: "/pdfs/Kallol_Roy_List_of_Publications.pdf",
        },
        {
            name: "Dr. Swati Roy",
            file: "/pdfs/Swati_Roy_List_of_Publications.pdf",
        },
        {
            name: "Dr. Priya Mistri",
            file: "/pdfs/Priya_Mistri_List_of_Publications.pdf",
        },
    ];


    return (
        <>
            <Header />
            <Innerbanner title="Publications" image={publiationBanner} />

            <div className="publicationSec sectionPadding">
                <div className="container">
                    {/* <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6 col-12 p-3">
                    <a href="#" className="pdfBox">
                        <p>Dr. Deepak B. Sharma</p>
                        <Image src={pdf} alt="pdf" width={60} height={60} className="img-fluid"  />
                    </a>
                </div> 
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6 col-12 p-3">
                    <a href="#" className="pdfBox">
                        <p>Dr. Kallol Roy</p>
                        <Image src={pdf} alt="pdf" width={60} height={60} className="img-fluid"  />
                    </a>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6 col-12 p-3">
                    <a href="#" className="pdfBox">
                        <p>Dr. Swati Roy</p>
                        <Image src={pdf} alt="pdf" width={60} height={60} className="img-fluid"  />
                    </a>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6 col-12 p-3">
                    <a href="#" className="pdfBox">
                        <p>Dr. Priya Mistri</p>
                        <Image src={pdf} alt="pdf" width={60} height={60} className="img-fluid"  />
                    </a>
                </div>
            </div> */}

                    <div className="row">
                        {publications.map((item, index) => (
                            <div
                                key={index}
                                className="col-lg-3 col-md-4 col-sm-6 col-xs-6 col-12 p-3"
                            >
                                <a
                                    href={item.file}
                                    className="pdfBox"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <p>{item.name}</p>
                                    <Image
                                        src={pdf}
                                        alt="pdf"
                                        width={60}
                                        height={60}
                                        className="img-fluid"
                                    />
                                </a>
                            </div>
                        ))}
                    </div>


                </div>
            </div>

            <Footer />
        </>
    );
}



