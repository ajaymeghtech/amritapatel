"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import next from "@/app/assets/images/next.png";
import Image from "next/image";
import Innerbanner from "@/app/components/common/Innerbanner";
import advisoryBanner from "@/app/assets/images/banner/advisory_innerbanner.png";
import shriatulpatel from "@/app/assets/images/board/atul_patel.jpg";
import deepakbsharma from "@/app/assets/images/board/deepak_b_sharma.jpg";
import baijuverghese from "@/app/assets/images/guest/baijuverghese.jpg";
import dhirenmodi from "@/app/assets/images/guest/dhirenmodi.jpg";
import rakeshpatel from "@/app/assets/images/guest/rakeshpatel.jpg";
import kallol from "@/app/assets/images/board/kallol_roy.jpg";
import swati from "@/app/assets/images/board/swati_roy.jpg";
import nasreen from "@/app/assets/images/board/nasreen_bha.jpg";
import mrina from "@/app/assets/images/board/mrina_patel.jpg";
import { fetchCMSByKey } from "@/app/services/cmsService";
import dummyimg from "@/app/assets/images/board/dummy_img.png";


export default function BoardOfStudies() {
    const [cmsData, setCmsData] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        async function loadData() {
            const res = await fetchCMSByKey("board_of_studies");
            setCmsData(res);
        }
        // loadData();
    }, []);

    let Modal;
    if (typeof window !== "undefined") {
        Modal = require("bootstrap").Modal;
    }

    const openModal = (member) => {
        setSelectedMember(member);
        const modalElement = document.getElementById("councilModal");
        const modal = new Modal(modalElement);
        modal.show();
    };

    const boardofstudiesMembers = [
        {
            srNo: 1,
            name: "Dr. Deepak Sharma",
            designation: "Director, APCPH, BU",
            role: "Chairperson",
            image: deepakbsharma,
            description: "Dr. Deepak B. Sharma is the Director of the Amrita Patel Centre for Public Health and a Professor of Community Medicine. His profile is marked by an MD in Community Medicine, a Post Graduate Certificate course in Industrial Health (PGCIH), Advance Course in Medical Education (ACME) and a Ph.D. in Psychiatry. This combination allows him to lead innovative research in occupational health psychology, workplace wellbeing and mental health in the community. An award-winning researcher and prolific author, Dr. Sharma is a guiding force in public health, serving as a Ph.D. guide and a key resource person for promoting health across diverse populations."
        },
        {
            srNo: 2,
            name: "Dr. Dharmik Patel",
            designation: "Professor & HOD, Biochemistry, PSMC",
            image: dummyimg,
            description: "Dr. Dharmikkumar Patel serves as Professor and Head of Biochemistry at Pramukhswami Medical College, Bhaikaka University. He is an expert in clinical biochemistry and a recognized leader in medical education. As a resource faculty for the NMC-Nodal Centre , he specializes in implementing innovative, student-centered methodologies like CBME and case-based learning. Dr. Patel's work is pivotal in enhancing diagnostic accuracy and laboratory efficiency, holding deep expertise in quality management systems, including NABL accreditation and Six Sigma methodologies. His research focuses on integrating biochemical insights with medical education technology and quality control to improve patient care",
        },
        {
            srNo: 3,
            name: "Dr. Uday Shankar Singh",
            designation: "Professor, Community Medicine, PSMC",
            image: dummyimg,
            description: "Dr. Uday Shankar Singh is a senior Professor in the Department of Community Medicine with over two decades of teaching experience. As a GSMC-FAIMER Fellow and Co-Convenor for the Advance Course in Medical Education (ACME) at the NMC Nodal Centre, he is a leader in faculty development and curriculum. Dr. Singh previously served as Head of the Department for 7.5 years and is also a trained Palliative Care Physician. His extensive contributions include mentoring numerous postgraduate students as a recognized guide and publishing 52 research articles in national and international indexed journals",
        },
        {
            srNo: 4,
            name: "Dr. Mrina Patel",
            designation: "Tutor, Dentistry, PSMC",
            image: mrina,
            description: "Ms. Nasreen Bha serves as an Assistant Professor at Amrita Patel Centre for Public Health, Bhaikaka University. She holds a Master of Public Health (MPH) with her graduation in Nutrition , positioning her as a key specialist in public health nutrition. Ms. Bha also has direct experience assessing the functionality of Nutrition Rehabilitation Centers (CMTCs). She applies strong communication skills to support public health and nutrition initiatives in the community.",
        },
        {
            srNo: 5,
            name: "Dr. Kallol Roy",
            designation: "Assistant Professor, APCPH",
            image: kallol,
            description: "Dr. Kallol Roy is a results-driven public health professional with his training in Medical Physiology and has channelized his research skills with a Ph.D. (Community Medicine) from Kasturba Medical College, Manipal. He holds key portfolios at Amrita Patel Centre for Public Health, Bhaikaka University. He is an Assistant Professor & the academic coordinator - MPH. He also serves as a Principal Investigator of a multi centric extramurally funded project - WE-CAN. He is also the Program In Charge of a large community based NCD program implemented across three districts of Gujarat in 150 villages. Kallol's unique blend of high-level program implementation, data-driven methodology and specialized skills in life skills training makes him a key asset for developing and scaling next-generation health interventions. Pursuing his academic excellence, he has recently completed his PG Diploma in Environment & Occupational Health.",
        },
        {
            srNo: 6,
            name: "Ms. Nasreen Bha",
            designation: "Assistant Professor, APCPH",
            image: nasreen,
            description: "Ms. Nasreen Bha serves as an Assistant Professor at Amrita Patel Centre for Public Health, Bhaikaka University. She holds a Master of Public Health (MPH) with her graduation in Nutrition , positioning her as a key specialist in public health nutrition. Ms. Bha also has direct experience assessing the functionality of Nutrition Rehabilitation Centers (CMTCs). She applies strong communication skills to support public health and nutrition initiatives in the community.",
        },
        {
            srNo: 7,
            name: "Dr. Swati Roy",
            designation: "Assistant Professor, APCPH",
            image: swati,
            description: "Dr. Swati Roy is a public health professional and academic strategist, holding an MPH- Epidemiology from Manipal University and she also holds a B.Ed training. This combination demonstrates her commitment to master a modern public health pedagogy. As an Assistant Professor, Amrita Patel Centre for Public Health, Bhaikaka University her expertise lies in the critical 21st-century skills of qualitative research and designing Behavioural Change Communication strategies. Her significant leadership capability is evidenced by her role as Member Secretary for Clinical & Biomedical Research at the University Ethics Committees [1,2].  Swati is an ideal professional for advancing health advocacy and instilling rigorous ethical governance in public health education.",
        },

        // {
        //     section: "External Members",
        // },

        {
            srNo: 8,
            name: "Dr. Atul Trivedi",
            designation:
                "Associate Professor, Community Medicine, B J Medical College, Ahmedabad",
            image: dummyimg,
            description: "Dr. Atul Trivedi is a senior public health leader with 30 years of experience and an MD in Community Medicine. He serves as Associate Professor at B.J. Medical College and Secretary of the IAPSM Gujarat Chapter. His profile is marked by high-level administrative roles, including Officer on Special Duty (OSD) for Medical Education and coordinator at the Gujarat AIDS Control Society (GSACS). He is a field-tested expert in epidemic investigation,disaster management and data analysis using modern tools like Kobo and EpiCollect. Dr. Trivedi is also the nodal person for One Health outreach activities.",
        },
        {
            srNo: 9,
            name: "Dr. Rakesh Patel",
            designation:
                "Quality Assurance Medical Officer, District Health Team, Anand",
            image: rakeshpatel,
            description: "Dr. Rakesh Patel is a public health specialist, holding an MD in Community Medicine and a Certificate in Industrial Health. He brings over nine years of experience in the public sector, currently serving as a Quality Assurance Medical Officer for the Government of Gujarat. This key role leverages his expertise in healthcare management, quality systems, and epidemiology. Dr. Patel's contributions are further supported by his field experience in handling medical emergencies and his research on topics including geriatric cognitive health and vaccine logistics management.",
        },
        {
            srNo: 10,
            name: "Mr. Baiju Verghese",
            designation:
                "HOD & Assistant Professor, Industrial Hygiene and Safety, ISTAR, CVM University, Anand",
            image: baijuverghese,
            description: "Mr. Baiju G. Verghese is the Head & Assistant Professor for the Industrial Hygiene and Safety programme at ISTAR, CVM University. He is a distinguished expert in EHS, HAZOP, and ergonomic principles , with extensive field experience at organizations like Kohler and Adani Wilmar. Mr. Verghese is a DNV-certified auditor for ISO 14001 and OHSA 18001 and was honored with the American Industrial Hygiene Association's \"President's Award\" in 2015. He actively bridges the gap between academia and industry, conducting specialized training and ensuring graduates are placed in leading corporations, significantly contributing to workforce safety and health.",
        },
        // {
        //     section: "Provost Nominee",
        // },
        {
            srNo: 11,
            name: "Dr. Dhiren Modi",
            designation:
                "Director, Community Health Project, Trustee, SEWA Rural, Jhagadiya, Bharuch",
            image: dhirenmodi,
            description: "Dr. Dhiren Modi is the Director of the Community Health Program and a Trustee at SEWA Rural. With an MD in Community Medicine , he is a leading expert in community-based operational research and public health implementation. Dr. Modi spearheads the acclaimed \"ImTeCHO\" mHealth initiative, a pioneering program that empowers ASHA workers using mobile technology to improve maternal and child health in tribal areas. He is a state-level trainer for programs like IMNCI and Anemia Mukt Bharat and has published extensively on the cost-effectiveness and impact of mHealth interventions, driving evidence-based health policy in rural India.",
        },
    ];

    console.log("CMS Data:", cmsData, `${API_BASE_URL}${cmsData?.banner_image}`);

    return (
        <>
            <Header />
            <Innerbanner title="Board Of Studies" image={advisoryBanner} />
            {/* <div className="sectionPadding">
                <div className="container">
                    {cmsData?.content ? (
                        <div dangerouslySetInnerHTML={{ __html: cmsData.content }} />
                    ) : (
                        <p>Loading...</p>
                    )}

                    <div class="table-responsive">
                        <table class="courseTable table-bordered boradTable">
                            <thead>
                                <tr>
                                    <th>Sr. No</th>
                                    <th>Designation</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Director, APCPH, BU</td>
                                    <td>Dr. Deepak Sharma [Chairperson]</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Professor & HOD, Biochemistry, PSMC</td>
                                    <td>Dr. Dharmik Patel</td>

                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Professor, Community Medicine, PSMC</td>
                                    <td>Dr. Uday Shankar Singh</td>

                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td> Tutor, Dentistry, PSMC </td>
                                    <td> Dr. Mrina Patel </td>
                                </tr>
                                <tr>
                                    <td> 5</td>
                                    <td>Assistant Professor, APCPH</td>
                                    <td> Dr. Kallol Roy </td>

                                </tr>
                                <tr>
                                    <td> 6</td>
                                    <td> Assistant Professor, APCPH</td>
                                    <td> Ms. Nasreen Bha </td>
                                </tr>
                                <tr>
                                    <td>7</td>
                                    <td> Assistant Professor, APCPH</td>
                                    <td> Dr. Swati Roy</td>
                                </tr>

                                <tr class="boradTableHeadingRow">
                                    <td colSpan="3">External Members</td>
                                </tr>

                                <tr>
                                    <td>8</td>
                                    <td>Associate Professor, Community Medicine B J Medical College, Ahmedabad</td>
                                    <td> Dr. Atul Trivedi</td>
                                </tr>
                                <tr>
                                    <td>9</td>
                                    <td> Quality Assurance Medical Officer District Health Team, Anand</td>
                                    <td> Dr. Rakesh Patel	</td>
                                </tr>
                                <tr>
                                    <td>10</td>
                                    <td>HOD and Assistant Professor, Industrial Hygiene and Safety, ISTAR, CVM University, Anand</td>
                                    <td> Mr. Baiju Verghese</td>
                                </tr>
                                <tr class="boradTableHeadingRow">
                                    <td colSpan="3">Provost Nominee</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td> Director, Community Health Project, Trustee, SEWA Rural, Jhagadiya, Bharuch</td>
                                    <td> Dr. Dhiren Modi</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                </div>
            </div> */}

            <div className="advisoryCouncilSec sectionPadding">
                <div className="container">
                    <div className="row">
                        {boardofstudiesMembers.map((member, index) => (
                            <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={index}>
                                <div className="councilBox">
                                    <div className="councilimg">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            width={600}
                                            height={600}
                                            className="img-fluid"
                                        />
                                    </div>

                                    <h3>{member.name}</h3>
                                    <p>{member.designation}</p>

                                    <a
                                        style={{ cursor: "pointer" }}
                                        onClick={() => openModal(member)}
                                    >
                                        <Image
                                            src={next}
                                            alt="open modal"
                                            width={64}
                                            height={64}
                                            className="img-fluid"
                                        />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div
                className="modal fade"
                id="councilModal"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-body">
                            {selectedMember && (
                                <div className="modalDetail text-center">
                                    <div className="councilerImg">
                                        <Image
                                            src={selectedMember.image}
                                            alt={selectedMember.name}
                                            width={350}
                                            height={350}
                                            className="img-fluid mb-3"
                                        />
                                    </div>

                                    <div className="contentDetail">
                                        <h3>{selectedMember.name}</h3>
                                        <h5 className="mt-2">{selectedMember.designation}</h5>
                                        <p className="mb-3">
                                            {selectedMember.description}
                                        </p>
                                    </div>

                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            className="detailCloseIcon"
                            data-bs-dismiss="modal"
                        >
                            &times;
                        </button>

                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}



