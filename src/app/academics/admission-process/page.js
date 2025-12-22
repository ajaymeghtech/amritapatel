"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import academicBanner from '@/app/assets/images/banner/academics_innerbanner.png';

export default function AdmissionProcess() {

    return (
        <>
            <Header />
            <Innerbanner title="Admission Process" image={academicBanner} />

            <div className="sectionPadding admissionpage">
                <div className="container">
                    <div className="admissioneeligibilitySec">
                        <div className="sectionheading"><h1>Master of Public Health (MPH) Admission Overview for Academic Year 2025-26</h1></div>
                        <p>As a prospective public health professional, choosing the right program is your first step toward a purposeful career. The Master of Public Health (MPH) program at *Bhaikaka University's Amrita Patel Centre for Public Health (APCPH)* is meticulously designed to create a dedicated cadre of public health experts, rooted in the principles of holistic, flexible and learner-centric education as mandated by the National Education Policy (NEP) 2020.</p>
                        <p>Here is a clear guide to the admission process, eligibility requirements and program structure for the Academic Year 2025-26.</p>
                    </div>
                    <div className="admissioneeligibilitySec">
                        <div className="sectionheading mt-5"><h2>Eligibility for ApplicationTo be considered for admission to the regular two-year MPH program, applicants must meet the following criteria</h2></div>
                        <div className="admissioneeligibilityDes">
                            <ul className="admissionList">
                                <li> <b>Educational Qualification</b>: You must be a Graduate from a recognized University in India or abroad.</li>
                                <li><b>Minimum Marks:</b> A minimum of 50% aggregate marks in your final degree certificate is required.</li>
                                <li><b>Preferred Backgrounds: </b>While all eligible graduates may apply, preference will be given to candidates from the following disciplines, as their foundational knowledge strongly aligns with public health core competencies:</li>
                                <li><b>Medical & Allied Sciences:</b> Medicine (MBBS), AYUSH, Dentistry (BDS), Physiotherapy (BPT) and Veterinary Sciences.</li>
                                <li><b>Core Health Sciences: </b>Life Sciences, Nutrition.</li>
                                <li><b>Data Sciences:</b>Statistics, Demography, Population Sciences.</li>
                                <li><b>Social & Behavioral Sciences: </b>Sociology, Psychology, Anthropology and other social sciences.</li>
                            </ul>
                        </div>
                        
                        <p>Note: As there are 10 seats. applications followed by a review from the scrutinizing team ensuring adherence to the above mentioned criteria and other points, the final selection would be informed accordingly. </p>

                    </div>
                    <div className="admissioneeligibilitySec mt-5">
                        <div className="sectionheading"><h2>Program Structure and Duration</h2></div>

                        <div className="admissioneeligibilityDes">
                            <ul className="admissionList">
                                <li><b>Full-Time Program:</b> The MPH program is a two-year, full-time postgraduate degree.</li>
                                <li><b>Duration:</b> Two years of on-campus, full-time academic training.</li>
                                <li><b>Structure:</b> The curriculum is divided across four semesters.</li>
                                <li><b>Medium of Instruction:</b> English is the only medium for teaching and examinations.</li>
                                <li><b>Total Credits:</b> The program comprises 80 academic credits.</li>
                            </ul>
                        </div>

                        <div className="sectionheading sectionPaddingTop mt-5"><h2>Multiple Entry and Exit Points</h2></div>

                        <p>
                            In alignment with NEP 2020, the curriculum offers flexibility with a planned exit option after completing
                            the first academic year (two semesters). Students who choose this option will be awarded:
                        </p>

                        <div className="admissioneeligibilityDes">
                            <ul className="admissionList">
                                <li>
                                    <b>Post-Graduate Diploma in Public Health (PG-DPH):</b>
                                    Awarded upon successful completion of 40 credits (NCfF/NHEQF level 6.0).
                                </li>
                            </ul>
                        </div>

                        <div className="sectionheading sectionPaddingTop mt-5"><h2>What Makes the APCPH Program Unique?</h2></div>

                        <div className="admissioneeligibilityDes">
                            <ul className="admissionList">
                                <li>
                                    APCPH aims to become a self-sustaining center of excellence addressing local health needs through
                                    collaborative community engagement.
                                </li>
                            </ul>
                        </div>


                    </div>
                    <div className="admissioneeligibilitySec mt-5">
                        <div className="sectionheading"><h2>Program Highlights</h2></div>

                        <div className="admissioneeligibilityDes">
                            <ul className="admissionList">

                                <li>
                                    <b>Context-Specific Curriculum:</b>
                                    The program offers a community-based curriculum designed to prepare job-ready and confident
                                    public health professionals for health systems and NGOs in developing countries.
                                </li>

                                <li>
                                    <b>Practical Skills Focus:</b>
                                    Instruction methods are highly interactive, utilizing didactic and interactive lectures,
                                    practical sessions, demonstrations, group discussions, and structured problem-solving exercises.
                                </li>

                                <li>
                                    <b>Core Competencies:</b>
                                    The curriculum is structured around five major competency domains: Public Health Sciences,
                                    Assessment & Analysis, Policy, Planning & Evaluation, Partnerships, Communication & Advocacy,
                                    and Leadership & Systems Thinking.
                                </li>

                                <li>
                                    <b>Real-World Experience:</b>
                                    The Centre runs a full fledged community based NCD care program across 150 villages of Gujarat.
                                    Students get real-time field experience. The program culminates in an Internship (Semester IV)
                                    and a Thesis (Semesters III & IV), enabling students to apply theoretical learning to practical
                                    challenges.
                                </li>

                            </ul>
                        </div>
                        <p>If you are passionate about addressing contemporary and future health challenges in the Indian context,
                            and want to contribute to problem-solving research on local health issues, this MPH program provides the
                            multidisciplinary knowledge and ethical foundation required to succeed.
                        </p>
                    </div>
                </div>
            </div >
            <Footer />
        </>
    );
}



