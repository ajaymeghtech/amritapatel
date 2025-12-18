"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import advisoryBanner from "@/app/assets/images/banner/advisory_innerbanner.png";
import { fetchCourses } from "@/app/services/courseService";
import next from "@/app/assets/images/next.png";
import kinjalahir from "@/app/assets/images/guest/kinjalahir.jpg";
import pradeepkumar from "@/app/assets/images/guest/pradeepkumar.jpg";
import baijuverghese from "@/app/assets/images/guest/baijuverghese.jpg";
import leelavisaria from "@/app/assets/images/guest/leelavisaria.jpg";
import dhirenmodi from "@/app/assets/images/guest/dhirenmodi.jpg";
import rakeshpatel from "@/app/assets/images/guest/rakeshpatel.jpg";
import sumitunadkat from "@/app/assets/images/guest/sumitunadkat.jpg";
import kapilgandha from "@/app/assets/images/guest/kapilgandha.jpg";
import bhawanisingh from "@/app/assets/images/guest/bhawanisinghkushwaha.jpg";
import keyurravat from "@/app/assets/images/guest/keyurravat.jpg";
import bhaveshmodi from "@/app/assets/images/guest/bhaveshmodi.jpg";
import urvishjoshi from "@/app/assets/images/guest/urvishjoshi.jpg";
import kishorsochaliya from "@/app/assets/images/guest/kishorsochaliya.jpg";
import vinayakpatel from "@/app/assets/images/guest/vinayakpatel.jpg";
import krupal from "@/app/assets/images/guest/krupal.jpg";
import hamid from "@/app/assets/images/guest/hamid.jpg";

export default function GuestSpeakersPage() {

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

  const GuestSpeakersMembers = [
    {
      name: "Dr. Kinjal Ahir",
      designation:
        "Professor & Head, Department of Economics, Sardar Patel University",
      image: kinjalahir,
      description:
        "Dr. Kinjal Vijay Ahir is Professor & Head, Department of Economics at Sardar Patel University, Vallabh Vidyanagar, and Hon. Deputy Director of the Agro Economic Research Centre under the Ministry of Agriculture and Farmers’ Welfare, Government of India. A gold medallist in Economics and Ph.D. in Higher Education Economics, she has over two decades of teaching and research experience. Dr. Ahir has led nationally funded projects on dairy economics, agricultural markets, and policy evaluation, authored and edited several books, and published widely in reputed journals. She has been invited to speak at international forums including BRICS Higher Education seminars and TEDx, and continues to contribute actively to academic leadership, research, and policy dialogues."
    },
    {
      name: "Dr. Pradeep Kumar",
      designation: "Retired Professor, Community Medicine",
      image: pradeepkumar,
      description:
        "Dr. Pradeep Kumar is a Distinguished Professor of Public Health at IIPH Gandhinagar with over 44 years of leadership experience. He has held senior administrative roles including Additional Project Director at GSACS and has managed major public health emergencies such as plague, leptospirosis, and bird flu. A national-level trainer for HIV/AIDS, RNTCP, and IMNCI, he is a former Editor-in-Chief of the Indian Journal of Community Medicine with over 100 publications and 1030 citations."
    },
    {
      name: "Mr. Baiju G. Verghese",
      designation:
        "Assistant Professor & Head, Industrial Hygiene and Safety, ISTAR, CVM University",
      image: baijuverghese,
      description:
        "Mr. Baiju G. Verghese is Head & Assistant Professor of Industrial Hygiene and Safety at ISTAR, CVM University. An expert in EHS, HAZOP, and ergonomics, he has industry experience with Kohler and Adani Wilmar. He is a DNV-certified auditor for ISO 14001 and OHSAS 18001 and received the American Industrial Hygiene Association’s President’s Award in 2015. He actively bridges academia and industry through training and placements."
    },
    {
      name: "Dr. Leela Visaria",
      designation:
        "Honorary Professor & Former Director, Gujarat Institute of Development Research",
      image: leelavisaria,
      description:
        "Dr. Leela Visaria, an Honorary Professor and former Director of GIDR, holds a Ph.D. from Princeton University. She is a nationally and internationally recognized public health researcher known for field-based research on family planning, health, and demographic transition. She coordinated the HealthWatch network and has authored and edited seminal works on maternal health, contraception, and abortion. She is an ICSSR National Professor and former President of the Asian Population Association."
    },
    {
      name: "Dr. Dhiren Modi",
      designation:
        "Director, Community Health Project & Trustee, SEWA Rural, Bharuch",
      image: dhirenmodi,
      description:
        "Dr. Dhiren Modi is Director of the Community Health Program and Trustee at SEWA Rural. An MD in Community Medicine, he leads community-based operational research and public health implementation. He spearheads the ImTeCHO mHealth initiative empowering ASHA workers to improve maternal and child health in tribal areas and is a state-level trainer for IMNCI and Anemia Mukt Bharat."
    },
    {
      name: "Dr. Rakesh Patel",
      designation:
        "Quality Assurance Medical Officer, District Anand, Government of Gujarat",
      image: rakeshpatel,
      description:
        "Dr. Rakesh Patel is a public health specialist with an MD in Community Medicine and a Certificate in Industrial Health. With over nine years of public-sector experience, he currently serves as a Quality Assurance Medical Officer. His expertise includes healthcare management, quality systems, epidemiology, emergency response, and research in geriatric cognitive health and vaccine logistics."
    },
    {
      name: "Dr. Sumit V. Unadkat",
      designation:
        "Associate Professor, Community Medicine, M. P. Shah Government Medical College",
      image: sumitunadkat,
      description:
        "Dr. Sumit Unadkat has over 22 years of experience in medical education and epidemiological research. A specialist in biostatistics, systematic reviews, meta-analysis, and time-series analysis, he uses tools such as R and Q-GIS. He has formal training in Field Epidemiology from NICD, New Delhi, and has authored over 25 publications in NCDs, nutrition, and maternal and child health."
    },
    {
      name: "Dr. Kapil M. Gandha",
      designation:
        "Assistant Professor, Community Medicine, M. P. Shah Govt. Medical College",
      image: kapilgandha,
      description:
        "Dr. Kapil Gandha is a leading expert in healthcare quality assurance and a National External Assessor for NQAS, having completed over 50 assessments. He is a key trainer for LaQshya, HELP, and Advanced Vaccinology programs and a major resource for Infection Prevention and Control, having conducted over 120 training sessions. He is also a published author contributing to quality standards in public health."
    },
    {
      name: "Dr. Abdul Hamid",
      designation:
        "Occupational Health Physician, Kuwait Integrated Petroleum Industries Company (KIPIC–HEISCO), Kuwait",
      image: hamid,
      description:
        "Dr. Abdul Hamid Mavli is an experienced Occupational Health Physician with over 12 years of clinical and public health experience across industrial, community, and hospital settings. Currently serving at Kuwait Integrated Petroleum Industries Company (KIPIC–HEISCO), he specializes in workplace health surveillance, occupational injury management, fitness-to-work certifications, and employee wellness programs. He holds an MD in Community Health & Preventive Medicine and a Professional Diploma in Occupational Medicine from the Royal College of Physicians of Ireland. His expertise includes corporate wellness, industrial health promotion, implementation of return-to-work programs, and management of acute and chronic illnesses. Dr. Mavli has previously worked as a General Practitioner in Kuwait and India, Assistant Professor in Community Medicine, and Medical Officer in government health services, with strong research credentials and multiple peer-reviewed publications."
    },

    {
      name: "Dr. Bhawani Singh Kushwaha",
      designation:
        "Deputy Commissioner (TB Officer), Central TB Division, MoHFW",
      image: bhawanisingh,
      description:
        "Dr. Bhawani Singh Kushwaha is a senior public health specialist with the Central TB Division, Ministry of Health & Family Welfare. He has served at NACO and with WHO as a Surveillance Medical Officer. Holding an MD in Preventive & Social Medicine and an Executive MBA in Project Management, he is an expert in managing national health programs, budgeting, social contracting, and large global grants."
    },
    {
      name: "Dr. Keyur Ravat",
      designation:
        "District Child Survival Officer (DCSO), UNICEF Gujarat",
      image: keyurravat,
      description:
        "Dr. Keyur Ravat is a public health professional (MPH) with over nine years of experience in health systems strengthening. As DCSO for UNICEF Gujarat, he leads RMNCAH, immunization, and quality assurance initiatives in aspirational districts. He has held key roles in World Bank–funded SRESTHA-G and NHM Gujarat and excels in policy implementation and data-driven monitoring."
    },
    {
      name: "Dr. Bhavesh Modi",
      designation:
        "Director, ICMR–National Institute of Occupational Health (ICMR-NIOH)",
      image: bhaveshmodi,
      description:
        "Dr. Bhavesh Modi is Director of ICMR-NIOH with over two decades of leadership in health systems strengthening. He holds an MD (PSM), MPH in Health Policy, and an MBA in Healthcare from Johns Hopkins University. Formerly Professor & Head at AIIMS Rajkot, he has over 100 publications and has received WHO SEARO recognition for excellence in tobacco control."
    },
    {
      name: "Dr. Urvish Joshi",
      designation:
        "Associate Professor, Community Medicine, Narendra Modi Medical College & NHL MMC",
      image: urvishjoshi,
      description:
        "Dr. Urvish Joshi has over 20 years of experience and specializes in Artificial Intelligence and Machine Learning applications in healthcare. He has international training from Johns Hopkins University in Global Tobacco Control and specializes in systematic reviews and meta-analysis. He has also served as a State Consultant for HIV/AIDS (PMTCT) at GSACS."
    },
    {
      name: "Dr. Kishor Sochaliya",
      designation:
        "Professor & Head, Community Medicine, C. U. Shah Medical College",
      image: kishorsochaliya,
      description:
        "Dr. Kishor Sochaliya is Professor & Head of Community Medicine and former Additional Dean at C. U. Shah Medical College. He has extensive experience in National Health Program management, disaster relief, maternal death audits, biostatistics, and research methodology. A UGC NET paper setter and PG guide, he has 21 publications and is trained in ACME, GCP, and IEC."
    },
     {
      name: "Dr. Krupal Joshi",
      designation:
        "-",
      image: krupal,
      description:
        "-"
    },
    {
      name: "Dr. Vinayak Patel",
      designation:
        "Retired Professor & Former Head, Department of Home Science, Sardar Patel University",
      image: vinayakpatel,
      description:
        "Dr. Vinayak Patel has 37 years of teaching and 30 years of research experience in Foods & Nutrition and Food Biotechnology. He has guided 12 Ph.D. scholars and over 160 M.Sc. students, coordinated UGC-funded programs, published 50 papers, and presented over 120 papers nationally and internationally. His leadership roles include Dean, Syndicate Member, and Academic Council Member at Sardar Patel University."
    }
  ];


  return (
    <>
      <Header />
      <Innerbanner title="Guest Speakers" image={advisoryBanner} />

      <div className="advisoryCouncilSec sectionPadding">
        <div className="container">
          <div className="row">
            {GuestSpeakersMembers.map((member, index) => (
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

            {/* ❌ Header removed */}

            <div className="modal-body">
              {selectedMember && (
                <div className="modalDetail text-center">
                  {/* Image */}
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
                    {/* ✅ Description at TOP */}




                    {/* Name */}
                    <h3>{selectedMember.name}</h3>

                    {/* Designation */}
                    <h5 className="mt-2">{selectedMember.designation}</h5>
                    <p className="mb-3">
                      {selectedMember.description}
                    </p>
                  </div>

                </div>
              )}
            </div>

            {/* <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0 m-3"
                        data-bs-dismiss="modal"
                      ></button> */}
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



