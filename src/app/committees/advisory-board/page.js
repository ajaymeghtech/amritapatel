"use client";
import React, { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "@/app/styles/scss/main.scss";
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import advisoryBanner from "@/app/assets/images/banner/advisory_innerbanner.png";
import next from "@/app/assets/images/next.png";
import shriatulpatel from "@/app/assets/images/board/atul_patel.jpg";
import gauritrivedi from "@/app/assets/images/board/gauri_trivedi.jpg";
import abhaydharamsi from "@/app/assets/images/board/abhay_dharamsi.jpg";
import jyotitiwari from "@/app/assets/images/board/jyoti_tiwari.jpg";
import utpalakharod from "@/app/assets/images/board/utpala_kharod.jpg";
import ksujatharao from "@/app/assets/images/board/k_sujatha_rao.jpg";
import amarjeetsingh from "@/app/assets/images/board/amarjeet_singh.jpg";
import swapnilagarawal from "@/app/assets/images/board/swapnil_agarwal.jpg";
import deepakbsharma from "@/app/assets/images/board/deepak_b_sharma.jpg";
import nitinraithatha from "@/app/assets/images/board/nitin_raithatha.jpg";
import amkadri from "@/app/assets/images/board/a_m_kadri.jpg";
import dileepmavlankar from "@/app/assets/images/board/dileep_mavlankar.jpg";
import nomitachandhiok from "@/app/assets/images//board/nomita_chandhik.jpg";

export default function SupervisoryCouncil() {
    const [selectedMember, setSelectedMember] = useState(null);
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

    const advisoryboardmembers = [
        {
            name: "Shri Atul Patel",
            designation: "Chairperson, Charutar Arogya Mandal",
            image: shriatulpatel,
            description:
                "Born in 1950 at Vadodara, Mr. Atul H Patel is a dynamic industrialist with the vision of growth, progress and prosperity through commitment and hard work, the philosophy which was imbibed by him from his illustrious father Shri Haribhai F. Patel (Former Chairman of Transpek Industry Limited). He graduated in Textile Engineering from VJTI, Bombay and joined Transpeak Industry Limited as Joint Managing Director and looked after various functions. Under his dynamic leadership, coupled with the excellent technical and managerial competence, the Company could go in for massive expansion, diversification and made tremendous progress and Technology improvement. At present he is managing Director of Tarak Chemicals Limited, a company involved in manufacturing of Oil field Chemicals & other Specialty Chemicals. He is presently on the Board of Directors of following listed and closely held companies which inter alia includes Enviro Infrastructure Co. Limited, 20 Microns Limited, Indo Nippon Chemical Company Limited and Shrieve Chemicals (India) Private Limited. He is deeply involved in the activities of Industrial association, Charitable Organizations and Educational Institutions..."
        },
        {
            name: "Dr. Gauri Trivedi",
            designation: "President, Bhaikaka University",
            image: gauritrivedi,
            description:
                "Dr. Gauri Trivedi, an eminent figure of distinguished stature, serves as an Advisor to Sanskardham and holds pivotal positions as a Board Member in several esteemed companies including Adani Total Gas, The Sandesh Group, and Nikhil Adhesives. Her illustrious career spans over 22 years as an IAS officer..."
        },
        {
            name: "Dr. Abhay Dharamsi",
            designation: "Provost, Bhaikaka University",
            image: abhaydharamsi,
            description:
                "Prof. (Dr.) Abhay Dharamsi serves as the Provost of Bhaikaka University, bringing over 40 years of experience in pharmacy education. His leadership roles include Governing Council Member of Tamil Nadu Dr. M.G.R. Medical University, Academic Council Member of RGUHS, Selection Committee Member of UPSC..."
        },
        {
            name: "Dr. Jyoti Tiwari",
            designation: "Registrar, Bhaikaka University",
            image: jyotitiwari,
            description:
                "Dr. Jyoti Tiwari has a Ph.D. in Computer Science from Sardar Patel University. She has 36 years of experience in Information Technology and university administration, including roles as Technical Assistant, Programmer, Director of Computer Centre, and Registrar (I/C)..."
        },
        {
            name: "Dr. Utpala Kharod",
            designation:
                "Head, Quality Assurance Committee, Amrita Patel Centre for Public Health, Bhaikaka University",
            image: utpalakharod,
            description:
                "Dr. Utpala Kharod is a distinguished academic leader who served as the first Provost of Bhaikaka University and Dean of PSMC for over a decade. She has contributed significantly to public health policy including work with Gujarat Medical Council and Ministry of Health..."
        },
        {
            name: "Dr. K Sujatha Rao",
            designation:
                "Former Union Secretary of the Ministry of Health and Family Welfare, Government of India",
            image: ksujatharao,
            description:
                "Dr. K. Sujatha Rao had a remarkable 36-year civil service career, including serving as Secretary to the Ministry of Health & Family Welfare. She strengthened national NCD programmes, national antibiotic policies, and expanded NACO's capabilities..."
        },
        {
            name: "Dr. Amarjeet Singh",
            designation:
                "Former Principal Secretary Family Welfare & Commissioner of Health, Gujarat",
            image: amarjeetsingh,
            description:
                "Dr. Amarjeet Singh introduced the Chiranjeevi Scheme and significantly contributed to maternal mortality reduction. He held senior positions in MoHFW, HRD Ministry, and Jal Shakti Ministry. He received several awards including Asian Innovation Award..."
        },
        {
            name: "Dr. Swapnil Agarawal",
            designation: "Dean, Pramukhswami Medical College",
            image: swapnilagarawal,
            description:
                "An alumnus of PSMC, Dr. Agarwal specialized in Forensic Medicine & Toxicology. He has served across multiple states and has been a strong advocate for Medical and Research Ethics..."
        },
        {
            name: "Dr. Deepak B. Sharma",
            designation:
                "Director, Amrita Patel Centre for Public Health, Bhaikaka University",
            image: deepakbsharma,
            description:
                "Dr. Deepak B. Sharma is Director of APCPH and Professor of Community Medicine. He holds MD, PGCIH, ACME and Ph.D. degrees, and is known for research in occupational health psychology and mental well-being..."
        },
        {
            name: "Dr. Nitin Raithatha",
            designation:
                "Professor & Head, Department of Obstetrics & Gynaecology, PSMC",
            image: nitinraithatha,
            description:
                "Dr. Nitin Raithatha is a senior professor with 22+ years of teaching experience. He specializes in clinical research governance and is a certified NABH assessor for Clinical Trial Ethics Committees..."
        },
        {
            name: "Dr. A.M. Kadri",
            designation:
                "Executive Director, State Health Systems Resource Centre, Gandhinagar",
            image: amkadri,
            description:
                "Dr. A.M. Kadri has over two decades of service in public health and leads the World Bank–assisted STRESTHA-G project. He has served as Joint Director GSACS and National President of IAPSM..."
        },
        {
            name: "Dr. Dileep Mavlankar",
            designation:
                "Honorary Professor, Indian Institute of Public Health - Gandhinagar",
            image: dileepmavlankar,
            description:
                "Prof. Dr. Dileep Mavlankar has held senior roles at IIMA, Johns Hopkins and Columbia University. His work has improved emergency obstetric care, reproductive health and family welfare quality..."
        },
        {
            name: "Dr. Nomita Chandhiok",
            designation:
                "Former Sr. Deputy Director General/Scientist 'G', ICMR",
            image: nomitachandhiok,
            description:
                "Dr. Nomita Chandhiok is a leading researcher in RMNCH+A and HIV/AIDS, with 35+ years at ICMR. She has coordinated major national research programs and received numerous prestigious awards..."
        }
    ];

    return (
        <>
            <Header />
            <Innerbanner title="Advisory Board" image={advisoryBanner} />

            <div className="advisoryCouncilSec sectionPadding">
                <div className="container">
                    <div className="row">
                        {advisoryboardmembers.map((member, index) => (
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
