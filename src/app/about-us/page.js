'use client';

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import overviewImage from '@/app/assets/images/about_innerbanner.png';
import aboutImage from '@/app/assets/images/about-image.jpg';
import visionMission from '@/app/assets/images/vision-mission.jpg';
import presidentImg from '@/app/assets/images/gauri_trivedi.jpg';
import aboutusBanner from '@/app/assets/images/banner/aboutus_banner.png';
import amrita_patel from '@/app/assets/images/amrita_patel.jpg';
import director from '@/app/assets/images/director.jpg';
import { fetchCMSByKey } from '@/app/services/cmsService';

export default function AboutUsPage() {
  const [OverviewData, setOverviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const data = await fetchCMSByKey('Overview');
        console.log('Fetched Data:', data);
        if (data) {
          setOverviewData(data);
        }
      } catch (error) {
        console.error('Error fetching accreditation data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // fetchOverviewData();
  }, []);

  // Resolve banner image URL
  const getBannerImage = () => {
    if (OverviewData?.banner_image) {
      // If API returns a relative path like "/uploads/..."
      if (OverviewData.banner_image.startsWith('http')) {
        return OverviewData.banner_image;
      }
      return `${API_BASE_URL}${OverviewData?.banner_image}`;
    }
    // Fallback (optional) – you can set a static default image here if needed
    return "/images/about_innerbanner.png";
  };

  console.log('Overview Data:', OverviewData);
  return (
    <>
      <Header />

      <Innerbanner
        title={OverviewData?.title || "About Us"} 
        image={aboutusBanner}
        // image={getBannerImage()}
      />

      {/* Main Content Area
      {isLoading ? (
        <section className="sectionPadding">
          <div className="container">
            <p>Loading content...</p>
          </div>
        </section>
      ) : OverviewData ? (
        <section className="sectionPadding">
          <div className="container">
            <div
              dangerouslySetInnerHTML={{ __html: OverviewData.content || "" }}
            />
          </div>
        </section>
      ) : (
        <section class="sectionPadding">
          <div class="container">
            <p>No content found for this page.</p>
          </div>
        </section>
      )} */}


      {/* <div>
        <div class="aboutSection sectionPadding">
          <div class="container">
            <h2 class="sectionheading"> Overview </h2>
            <div class="row">
              <div class="col-md-8">
                <p> The Charutar Arogya Mandal was formed in 1972 as a non-profit Trust and a Society to work in the area of health care and education. The Founder Chairman, Dr H M Patel – the former Finance and Home Minister, an astute academician and a Philanthropist, led the Institution with a legacy that still prevails - “ Solace for the Suffering”. The dictum is very much the beginning and the conclusion of all endeavors we take up, driving our efforts in healthcare, education, research and community health.  The Trust’s main objective, as enshrined in its Constitution, is to make healthcare facilities accessible and affordable to the people of Gujarat.</p>
                <p>In 2019, the Government of Gujarat conferred upon the status of a Private University and the BHAIKAKA UNIVERSITY commenced under the State Private University Act 2009. Charutar Arogya Mandal now acts as the supporting body to the University.</p>
                <p> The University is named after an illustrious and accomplished academician, Shri Bhailalbhai Patel, fondly known as Bhaikaka was instrumental in setting up Vallabh Vidyanagar, the education hub of the rural Charutar region – the central belt from Ahmedabad to Baroda in the state – to be precise. </p>
              </div>
              <div class="col-md-4">
                <div class="imgRadius">
                  <Image src="/images/about-image.jpg" alt="about Innerbanner" width={600} height={400} class="img-fluid " />
                </div>
              </div>
            </div>
            <p class="tagLine marBtm40"> Know Shri Bhailalbhai Patel – Bhaikaka </p>
            <p>Born on 7 June 1888 at Sarsa in the Anand District of Gujarat state, Bhaikaka was a civil engineer from the University of Pune. He began his career in engineering as a Supervisor in Mehsana and gradually rose to become an Executive Engineer for Government. He sought an early retirement from there in 1940 and joined Ahmedabad Municipality where he worked till 1942. He was appointed as Chairman of Charotar Education Society in Anand, a few years before moving on to what we now know as the township of Vallabh Vidyanagar on 3 March 1946. Bhaikaka began to work on a plan together with Shri Bhikhabhai Patel, a dedicated and farsighted educationist, who shared Bhaikaka’s vision, and both of them dedicated themselves to the vision of the development of Vallabh Vidyanagar – an educational township. He played a pivotal role in setting up Sardar Patel University in 1968 and was also the first Vice Chancellor of this rural University.  He was awarded the degree of Doctor of Science (Honoris Causa) by the university he founded at its special convocation on 12 November 1959. He was elected to the Gujarat Legislative Assembly in 1962 and as Leader of the Opposition in it. Bhaikaka breathed his last in Ahmedabad on 31 March 1970 after a brief illness but was cremated in Vallabh Vidyanagar as per his expressed wish during his lifetime.</p>
          </div>
        </div>

        <div className="container">
          <div class="visionSection sectionPadding">
            <div class="visionImage"><Image src="/images/vision-mission.jpg" alt="vision and mission" width={600} height={400} class="img-fluid" /></div>
            <div class="container">
              <div class="row">
                <div class="col-md-7">
                  <div class="marBtm40">
                    <h2 class="sectionheading"> Vision </h2>
                    <p> Bhaikaka University will be the most preferred destination for transformative educators, and also students who will become change leaders to make a significant impact in the society.</p>
                  </div>
                  <div>
                    <h2 class="sectionheading"> Mission </h2>
                    <p> Bhaikaka University will </p>
                    <ul class="bulletList">
                      <li> Provide the students with contextual and experiential learning so that they become professionals who will be critical thinkers, innovators, and insightful decision-makers </li>
                      <li> Develop organizational culture of collaboration and engage transformative learner-sensitive educators to promote excellence in education, research and services</li>
                      <li> Support collaborative, problem-solving interdisciplinary research influencing national policies and programmes </li>
                      <li> Offer accessible, rational, and affordable comprehensive healthcare services to diverse communities for wider societal support </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div class="leadership sectionPadding">
            <div class="container">
              <h2 class="sectionheading"> Leadership </h2>
              <div class="leadershipContent bgBlue">
                <div class="row">
                  <div class="col-md-12 col-lg-3">
                    <div class="imgRadius marBtm40"><Image src="/images/gauri_trivedi.jpg" alt="about" width={350} height={400} class="img-fluid" /></div>
                  </div>
                  <div class="col-md-12 col-lg-9">
                    <p class="leaderDesignation"> Dr. Gauri Trivedi <span> President </span> </p>
                    <p> Dr. Gauri Trivedi, an eminent figure of distinguished stature, serves as an Advisor to Sanskardham and holds pivotal positions as a Board Member in several esteemed companies, including Adani Total Gas, The Sandesh Group, and Nikhil Adhesives. Her illustrious career spans over 22 years as an Indian Administrative Service (IAS) officer, marking a journey of extraordinary leadership and profound contributions.</p>
                    <p> Dr. Trivedi’s scholastic prowess is exemplified by her academic accomplishments, including a Doctor of Philosophy (PhD) from the Institute for Social and Economic Change (ISEC) in Bengaluru and the Institute of Development Studies (IDS) in Mysuru. Furthermore, she holds an M.A. in Political Science from Jawaharlal Nehru University (JNU) in Delhi, M. Phil in Soviet Studies from JNU, and Post Graduate Program in Public Policy and Management (PGPPM) from the prestigious Indian Institute of Management (IIM) Bangalore, signifying her unwavering dedication to intellectual enrichment.</p>
                  </div>
                </div>

                <p>Throughout her remarkable career, Dr. Trivedi has demonstrated her expertise in diverse domains, including public policy, government administration, strategic planning, and industrial development and management. Her corporate acumen is evident through her tenure as the Managing Director and Director on the boards of several Central Public Sector Undertakings (CPSUs), a testament to her multifaceted leadership and strategic insight.</p>
                <p> Dr. Gauri Trivedi’s distinguished career as an IAS officer, culminating in posts such as Secretary to Government, Revenue Department, and Secretary to the Governor of Karnataka, bears testament to her commitment to public service. Her corporate experience as Vice President of Reliance Retail and her directorship at the Sardar Patel Institute of Public Administration (SPIPA-SIRD), Ahmedabad, further underscore her multifaceted administration. </p>
                <p> In conclusion, Dr. Gauri Trivedi’s journey from public service as an IAS officer to her multifaceted leadership roles in the corporate world and academia exemplifies her enduring commitment to excellence and knowledge dissemination. Her extraordinary contributions to governance, public policy, and education serve as an enduring testament to her remarkable legacy.</p>
              </div>

              <div class="leadershipContent bgDarkBlue">
                <div class="row">
                  <div class="col-md-12 col-lg-3">
                    <div class="imgRadius marBtm40"><Image src="/images/abhay_dharamasi.jpg" alt="about" width={350} height={400} class="img-fluid" /></div>
                  </div>
                  <div class="col-md-12 col-lg-9">
                    <p class="leaderDesignation"> Dr. Abhay Dharamsi  <span> Provost </span> </p>
                    <p> Located on a lush 100-acre campus in Karamsad, Dist Anand, Gujarat, Bhaikaka University boasts state-of-the-art infrastructure and a 1000 bed multi-disciplinary super-specialty hospital conducive to advanced teaching, learning, and research. The university offers programs in Nursing, Physiotherapy, Allied Health Sciences, alongside its Medical programs, setting benchmarks in excellence to surpass targets continually. </p>
                    <p> A strong believer and practitioner of the dictum “Knowledge is Power”, Bhaikaka University has been on the path of delivering high-quality education to the students by inculcating ethical and moral values, nurturing leadership qualities, fostering research culture and cultivating innovative skills. The university is driven by a commitment to quality and excellence, positioning itself as a one of the most respected university, underscored by its significant accomplishments. The university strive to excel in patient care, teaching, research and extension activities, while seeking collaboration opportunities with esteemed global universities. </p>
                  </div>
                </div>
                <p> It is both an honour and privilege to be part of Bhaikaka University.  We remain committed to grow and succeed in our mission of providing equitable access to modern healthcare resources and quality education. As we continue to grow, our university harbours a dream of becoming a globally renowned and admired university in future. </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="aboutinnerSec sectionPadding">
        <div className="container">
          <div className="sectionheading">AMRITA PATEL CENTRE FOR PUBLIC HEALTH (APCPH)</div>
          <div className="row">
            <div className="col-lg-8">
              <p >Amrita Patel Centre for Public Health is a venture to pay tributes to our former Chairman, Dr. Amrita Patel. Dr. Patel was the first lady executive of Amul, then the first woman Managing Director, and finally the Chairman of the National Dairy Development Board (NDDB).</p>
              <p >Her contribution to the dairy industry is a tale of trials and triumphs. She is also a passionate community health professional deeply concerned about the health of the rural poor. Her entire life has been spent in the service of the less privileged and empowering them, especially the women of India. All the organizations she has served have a main goal: improving the health, income, and welfare of India’s rural poor.</p>
              <p >A committed professional, a visionary, a dedicated environmentalist, and a prudent administrator with non-compromising ethics, she was deservedly conferred with the 'Padmabhushan' by the Government of India in 2001 for her contribution to the Indian Dairy industry and animal husbandry, and the 'Indira Gandhi Paryavaran Puraskar' by the Ministry of Environment & Forests for her significant contribution to the field of environment. She has been on the list of the top Businesswomen of the year (listed by Business Today) consistently for five years and topped the list in 2008. She was conferred with the prestigious Mahindra Samriddhi India Agri Lifetime Achievement Award - the Krishi Shiromani Samman - at a glittering function in Delhi on March 5, 2016.</p>
              <p >The Centre is envisioned to become a destination of learning and capacity building for public health professionals of all cadres.</p>

            </div>
            <div className="col-lg-4">
              <Image src={amrita_patel} alt="about Innerbanner" width={1920} height={600} className="img-fluid innerbannerImage" />

            </div>
          </div>
        </div>
      </div>
      <div className="visionMissionSec sectionPadding">
        <div className="container">
          <div className="visionSec padd100">
            <div className="visionTitle">
              <h2 className="sectionheading">Our Vision</h2>
            </div>
            <div className="visionDes">
              <p>APCPH will become a self-sustaining proactive center of excellence in public health, responsive to local health needs in a collaborative manner and its work cited, referred, and utilized both by scientific and local community.</p>
            </div>
          </div>
          <div className="visionSec">
            <div className="visionTitle">
              <h2 className="sectionheading">Our Mission</h2>
            </div>
            <div className="visionDes">
              <ul className="list">
                <li>To work proactively with the community for primary health care and public health emergency response.</li>
                <li>To offer community-based curriculum that prepares job-ready and confident public health experts for health systems and NGOs in developing countries.</li>
                <li>To attract international students, especially from South-East Asian and African countries.</li>
                <li>To offer short courses on leadership, management, and new research methods for health professionals.</li>
                <li>To develop courses for local youth to empower them in health matters.</li>
                <li>To build networking for post-course job placement support.</li>
                <li>To do problem-solving research on local health issues, focusing on community-based care for non-communicable diseases, nutrition, sanitation, and health management.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="directorMessage sectionPadding">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <Image src={director} alt="director" width={450} height={450} className="img-fluid innerbannerImage" />
              <p className="directordesignation name">Dr. Deepak B. Sharma (Director)</p>
              <p className="directordesignation">Amrita Patel Centre for Public Health, Bhaikaka University</p>
            </div>
            <div className="col-lg-9">
              <h2 className="sectionheading">Director Message</h2>
              <p>We are glad to offer two structured and meticulously designed post graduate programs for better delivery of  healthcare institutionally and, at the community level. Amrita Patel Centre for Public Health (APCPH) offers Masters in Public health (MPH) program both full-time and part time for working professionals. The second course is a Master in Hospital Administration (MHA). Additionally, there is a range of short-term courses aimed at building the capacity of healthcare professionals working across different cadres. </p>
              <p>Apart from this, the center also envisages holistic development of the students by various means. It offers a complete exposure to the field which includes a vast exposure to 150 villages across different blocks in Anand and Kheda districts of Gujarat. A 1000-Bed NABH-accredited tertiary level multi-specialty hospital attached to medical college, is one of the constituent Institutes of Bhaikaka University. The hospital with its state-of-the-art medical services and attached centers of oncology, bone marrow transplant, cardiology and critical care  offers hands on learning opportunities for students of Public Health and Hospital Administration.</p>
              <p>Learning opportunities also comes in a way by participating in various workshops, seminar and other residential courses which APCPH and other constituent institutes of Bhaikaka University is offering/arranging  time to time apart from other external sources as well. At the level of  organizing such events in APCPH , students do learn the management part and also learns about the teamwork. </p>
              <p>The university’s knowledge centre houses a plethora of books and literature, a perfect place to enrich knowledge, with the serene environment facilitating a harmony to acquire wisdom.
                A state-of-the-art Gym, spiritual centre like BLISS in the University campus and also Yoga sessions, offers a chance to learn these healthy practices, imbibe them for personal integrity and contribute to a larger cause.
                In a nutshell, the campus at Bhaikaka University is an ideal and complete environment to sustain, flourish and grow as a professional.</p>
              <p>Learning is a way of life here!</p>

              <p className="directorName">With Best wishes,<br />
                Director,<br />
                Dr. Deepak B. Sharma,<br />
                Amrita Patel Centre for Public Health</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


