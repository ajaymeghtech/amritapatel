"use client";
import React, { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "@/app/styles/scss/main.scss";
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import advisoryBanner from "@/app/assets/images/banner/advisory_innerbanner.png";
import nextIcon from "@/app/assets/images/next.png";
import dr_deepak from "@/app/assets/images/board/deepak_b_sharma.jpg";
import dr_nitin from "@/app/assets/images/board/nitin_raithatha.jpg";
import dr_bhakti from "@/app/assets/images/board/bhakti_bajpai.jpg";
import dr_minal from "@/app/assets/images/board/minal_patel.jpg";
import dr_rakesh from "@/app/assets/images/board/rakesh_patel.jpg";
import dr_rajesh from "@/app/assets/images/board/rajesh_patel.jpg";
import dr_hemshree from "@/app/assets/images/board/hemshree_parmar.jpg";
import dr_kallol from "@/app/assets/images/board/kallol_roy.jpg";
import dr_swati from "@/app/assets/images/board/swati_roy.jpg";
import dr_priya from "@/app/assets/images/board/priya.jpg";
import ms_nasreen from "@/app/assets/images/board/nasreen_bha.jpg";
import dr_mrina from "@/app/assets/images/board/mrina_patel.jpg";

export default function InternalQualityAssuranceCell() {
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

  const BordsOfStudies = [
    {
      name: "Dr. Deepak B. Sharma",
      designation:
        "Director, Amrita Patel Centre for Public Health, Bhaikaka University",
      image: dr_deepak,
      description:
        "Dr. Deepak B. Sharma is the Director of the Amrita Patel Centre for Public Health and a Professor of Community Medicine. His profile is marked by an MD in Community Medicine, a Post Graduate Certificate course in Industrial Health (PGCIH), Advance Course in Medical Education (ACME) and a Ph.D. in Psychiatry. This combination allows him to lead innovative research in occupational health psychology, workplace wellbeing and mental health in the community. An award-winning researcher and prolific author, Dr. Sharma is a guiding force in public health, serving as a Ph.D. guide and a key resource person for promoting health across diverse populations."
    },
    {
      name: "Dr. Nitin Raithatha",
      designation:
        "Professor & Head, Department of Obstetrics & Gynaecology, Pramukhswami Medical College, Bhaikaka University",
      image: dr_nitin,
      description:
        "Dr. Nitin Raithatha is a senior Professor of Obstetrics & Gynecology with over 22 years of teaching experience. His public health contributions are substantial, specializing in clinical research governance. He holds a Graduate Certificate in Clinical Investigations and is a certified NABH assessor for Clinical Trial Ethics Committees. This expertise in research ethics is complemented by his ACME certification in medical education and his training in Emergency Obstetric Care (EmOC). Dr. Raithatha is a prolific author with 29 journal publications and four textbook chapters."
    },
    {
      name: "Dr. Bhakti Bajpai",
      designation: "Controller, Academics, Bhaikaka University",
      image: dr_bhakti,
      description:
        "Dr. Bhakti Bajpai is a distinguished academic leader with 26 years of experience in biotechnology, underpinned by a Ph.D. in the field. Her potential to contribute to public health is rooted in her extensive research and proven institutional leadership. Having served as Head of Department at ARIBAS for 16 years and as Principal (I/c), she possesses deep expertise in managing advanced scientific programs and faculty. Her research impact is demonstrated by 18 Web of Science-indexed publications, two major UGC projects, and the supervision of three Ph.D. students. Dr. Bajpai also chairs the Board of Studies (Biological Sciences) at CVM University."
    },
    {
      name: "Dr. Minal Patel",
      designation:
        "Professor & Head, Department of Physiology, Pramukhswami Medical College, Bhaikaka University",
      image: dr_minal,
      description:
        "Dr. Minal Patel serves as the Professor and Head of the Department of Physiology. She is a distinguished academician with MBBS, M.Sc., Ph.D. and MD degrees in Medical Physiology. Her primary contribution to public health is through her extensive research on Non-Communicable Diseases (NCDs), including obesity, diabetes, and hypertension. A 'Star Faculty' awardee and Resource Faculty for the NMC Nodal Center, she is a leader in medical education. Dr. Patel has 23 years of experience, 27 publications, and previously served as the IQAC Coordinator."
    },
    {
      name: "Dr. Rakesh Patel",
      designation: "Quality Assurance Medical Officer, Dist- Anand",
      image: dr_rakesh,
      description:
        "Dr. Rakesh Patel is a public health specialist, holding an MD in Community Medicine and a Certificate in Industrial Health. He brings over nine years of experience in the public sector, currently serving as a Quality Assurance Medical Officer for the Government of Gujarat. This key role leverages his expertise in healthcare management, quality systems, and epidemiology. His work is supported by field experience in emergency services and research on geriatric cognitive health and vaccine logistics management."
    },
    {
      name: "Dr. Rajesh Patel",
      designation: "Epidemic Medical Officer",
      image: dr_rajesh,
      description:
        "Dr. Rajeshkumar Patel is a highly experienced public health leader with an MBBS from Pramukh Swami Medical College (1990 batch). His career includes more than two decades of grassroots-level service at Primary Health Centres, including Demai, Sundalpura, and PHC Bakrol (19 years). His deep field experience now guides his work as the Epidemic Medical Officer, In-charge District Malaria Officer, and In-charge Municipal Health Officer for Anand."
    },
    {
      name: "Dr. Hemshree Parmar",
      designation:
        "Associate Professor, Department of Community Medicine, Pramukhswami Medical College, Bhaikaka University",
      image: dr_hemshree,
      description:
        "Dr. Hemshree Parmar is an Associate Professor with an MD in Community Medicine and specializes in field-level public health interventions. She serves as Co-Nodal Faculty for key state programs, including PHCMP and PLA for teenage pregnancy. Her work also addresses anemia. She manages the Urban Health Training Center (UHTC) and coordinates the Family Adoption Programme, linking medical education with community welfare."
    },
    {
      name: "Dr. Kallol Roy",
      designation:
        "Assistant Professor, Amrita Patel Centre for Public Health, Bhaikaka University",
      image: dr_kallol,
      description:
        "Dr. Kallol Roy is a results-driven public health professional trained in Medical Physiology and holds a Ph.D. in Community Medicine from KMC Manipal. He is Assistant Professor and academic coordinator - MPH. He is Principal Investigator of the WE-CAN multi-centric project and Program In Charge of a large community-based NCD program across three Gujarat districts. He recently completed his PG Diploma in Environment & Occupational Health."
    },
    {
      name: "Dr. Swati Roy",
      designation:
        "Assistant Professor, Amrita Patel Centre for Public Health, Bhaikaka University",
      image: dr_swati,
      description:
        "Dr. Swati Roy specializes in epidemiology, biostatistics, and research ethics governance. She teaches core public health competencies and serves as Member Secretary of the Institutional Ethics Committee, ensuring regulatory compliance for human subjects research. Her work includes epidemiological research on chronic diseases, including a landmark rural neurological study. Her interests include implementation research, SBCC, and geriatric health. She holds an MPH from Manipal University and is currently a Ph.D. Scholar at Bhaikaka University."
    },
    {
      name: "Dr. Priya Mistri",
      designation:
        "Research Associate, Amrita Patel Centre for Public Health, Bhaikaka University",
      image: dr_priya,
      description:
        "Dr. Priya Mistri is a dedicated public health professional with an MPH and a background in Physiotherapy. As Research Associate, she manages the multi-centric WE-CAN project on cervical cancer awareness and women’s empowerment. She specializes in project management, stakeholder engagement, and data-driven monitoring. Her research on Maternal and Child Health (MCH) service utilization demonstrates her commitment to improving community health programs."
    },
    {
      name: "Ms. Nasreen Bha",
      designation:
        "Assistant Professor, Amrita Patel Centre for Public Health, Bhaikaka University",
      image: ms_nasreen,
      description:
        "Ms. Nasreen Bha holds an MPH and a graduation in Nutrition, positioning her as a specialist in public health nutrition. She has experience evaluating Nutrition Rehabilitation Centers (CMTCs) and contributes actively to nutrition-based community health initiatives."
    },
    {
      name: "Dr. Mrina Patel",
      designation:
        "Faculty, Department of Dentistry, Shree Krishna Hospital, Bhaikaka University",
      image: dr_mrina,
      description:
        "Dr. Mrina Patel is a Dental Consultant at Shree Krishna Hospital and a Tutor at Pramukhswami Medical College. With over a decade of clinical experience, she focuses on raising healthcare quality standards. She holds advanced qualifications in healthcare administration (MBA in Hospital and Health System Management) and clinical research (M.Sc.). Her multidisciplinary background strengthens her work in staff mentoring, health systems management, and research on disaster preparedness and oral health awareness."
    }
  ];

  return (
    <>
      <Header />
      <Innerbanner title="Internal Quality Assurance Cell" image={advisoryBanner} />

      <div className="advisoryCouncilSec sectionPadding">
        <div className="container">
          <div className="row">
            {BordsOfStudies.map((member, index) => (
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
                      src={nextIcon}
                      alt="open modal"
                      width={64}
                      height={64}
                      className="img-fluid nextimage"
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
