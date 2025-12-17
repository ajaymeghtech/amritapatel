import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import Image from "next/image";
import overviewImage from '@/app/assets/images/about-image.jpg';
import visionMission from '@/app/assets/images/vision-mission.jpg';
import presidentImg from '@/app/assets/images/gauri_trivedi.jpg';
import abhay_dharamasi from '@/app/assets/images/abhay_dharamasi.jpg';



export default function AboutUsPage() {
  return (
    <>
        <Header />
        <Innerbanner />
          <div className="aboutSection sectionPadding">
              <div className="container">
                 <h2 className="sectionheading"> Overview </h2>
                 <div className="row">
                    <div className="col-md-8">
                        <p> The Charutar Arogya Mandal was formed in 1972 as a non-profit Trust and a Society to work in the area of health care and education. The Founder Chairman, Dr. H M Patel – the former Finance and Home Minister, an astute academician and a Philanthropist, led the Institution with a legacy that still prevails - “ Solace for the Suffering”. The dictum is very much the beginning and the conclusion of all endeavors we take up, driving our efforts in healthcare, education, research and community health.  The Trust’s main objective, as enshrined in its Constitution, is to make healthcare facilities accessible and affordable to the people of Gujarat.</p>
                        <p>In 2019, the Government of Gujarat conferred upon the status of a Private University and the BHAIKAKA UNIVERSITY commenced under the State Private University Act 2009. Charutar Arogya Mandal now acts as the supporting body to the University.</p>
                        <p> The University is named after an illustrious and accomplished academician, Shri Bhailalbhai Patel, fondly known as Bhaikaka was instrumental in setting up Vallabh Vidyanagar, the education hub of the rural Charutar region – the central belt from Ahmedabad to Baroda in the state – to be precise. </p>
                    </div>
                     <div className="col-md-4">
                       <div className="imgRadius"> 
                          <Image src={overviewImage} alt="about Innerbanner" width={600} height={400} className="img-fluid "  />
                        </div>
                     </div>
                 </div>
                 <p className="tagLine marBtm40"> Know Shri Bhailalbhai Patel – Bhaikaka </p>
                 <p>Born on 7 June 1888 at Sarsa in the Anand District of Gujarat state, Bhaikaka was a civil engineer from the University of Pune. He began his career in engineering as a Supervisor in Mehsana and gradually rose to become an Executive Engineer for Government. He sought an early retirement from there in 1940 and joined Ahmedabad Municipality where he worked till 1942. He was appointed as Chairman of Charotar Education Society in Anand, a few years before moving on to what we now know as the township of Vallabh Vidyanagar on 3 March 1946. Bhaikaka began to work on a plan together with Shri Bhikhabhai Patel, a dedicated and farsighted educationist, who shared Bhaikaka’s vision, and both of them dedicated themselves to the vision of the development of Vallabh Vidyanagar – an educational township. He played a pivotal role in setting up Sardar Patel University in 1968 and was also the first Vice Chancellor of this rural University.  He was awarded the degree of Doctor of Science (Honoris Causa) by the university he founded at its special convocation on 12 November 1959. He was elected to the Gujarat Legislative Assembly in 1962 and as Leader of the Opposition in it. Bhaikaka breathed his last in Ahmedabad on 31 March 1970 after a brief illness but was cremated in Vallabh Vidyanagar as per his expressed wish during his lifetime.</p>
              </div>
          </div>

          <div className="visionSection sectionPadding">
              <div className="visionImage"><Image src={visionMission} alt="about Innerbanner" width={600} height={400} className="img-fluid "  /></div>
              <div className="container"> 
                <div className="row">
                    <div className="col-md-7">
                      <div className="marBtm40">
                        <h2 className="sectionheading"> Vision </h2>
                        <p> Bhaikaka University will be the most preferred destination for transformative educators, and also students who will become change leaders to make a significant impact in the society.</p>
                      </div>
                      <div> 
                        <h2 className="sectionheading"> Mission </h2>
                        <p> Bhaikaka University will </p>
                        <ul className="bulletList">
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

          <div className="leadership sectionPadding">
              <div className="container">
                  <h2 className="sectionheading"> Leadership </h2> 
                  <div className="leadershipContent bgBlue">
                      <div className="row">
                          <div className="col-md-3">
                            <div className="imgRadius marBtm40"><Image src={presidentImg} alt="about" width={350} height={400} className="img-fluid"  /></div>
                          </div>
                          <div className="col-md-9">
                              <p className="leaderDesignation"> Dr. Gauri Trivedi <span> President </span> </p>
                              <p> Dr. Gauri Trivedi, an eminent figure of distinguished stature, serves as an Advisor to Sanskardham and holds pivotal positions as a Board Member in several esteemed companies, including Adani Total Gas, The Sandesh Group, and Nikhil Adhesives. Her illustrious career spans over 22 years as an Indian Administrative Service (IAS) officer, marking a journey of extraordinary leadership and profound contributions.</p>
                              <p> Dr. Trivedi’s scholastic prowess is exemplified by her academic accomplishments, including a Doctor of Philosophy (PhD) from the Institute for Social and Economic Change (ISEC) in Bengaluru and the Institute of Development Studies (IDS) in Mysuru. Furthermore, she holds an M.A. in Political Science from Jawaharlal Nehru University (JNU) in Delhi, M. Phil in Soviet Studies from JNU, and Post Graduate Program in Public Policy and Management (PGPPM) from the prestigious Indian Institute of Management (IIM) Bangalore, signifying her unwavering dedication to intellectual enrichment.</p>
                          </div>
                        </div>
                       
                        <p>Throughout her remarkable career, Dr. Trivedi has demonstrated her expertise in diverse domains, including public policy, government administration, strategic planning, and industrial development and management. Her corporate acumen is evident through her tenure as the Managing Director and Director on the boards of several Central Public Sector Undertakings (CPSUs), a testament to her multifaceted leadership and strategic insight.</p>
                        <p> Dr. Gauri Trivedi’s distinguished career as an IAS officer, culminating in posts such as Secretary to Government, Revenue Department, and Secretary to the Governor of Karnataka, bears testament to her commitment to public service. Her corporate experience as Vice President of Reliance Retail and her directorship at the Sardar Patel Institute of Public Administration (SPIPA-SIRD), Ahmedabad, further underscore her multifaceted administration. </p>
                        <p> In conclusion, Dr. Gauri Trivedi’s journey from public service as an IAS officer to her multifaceted leadership roles in the corporate world and academia exemplifies her enduring commitment to excellence and knowledge dissemination. Her extraordinary contributions to governance, public policy, and education serve as an enduring testament to her remarkable legacy.</p>
                  </div>

                  <div className="leadershipContent bgDarkBlue">
                      <div className="row">
                          <div className="col-md-3">
                            <div className="imgRadius marBtm40"><Image src={abhay_dharamasi} alt="about" width={350} height={400} className="img-fluid"  /></div>
                          </div>
                          <div className="col-md-9">
                              <p className="leaderDesignation"> Dr. Abhay Dharamsi  <span> Provost </span> </p>
                              <p> Located on a lush 100-acre campus in Karamsad, Dist Anand, Gujarat, Bhaikaka University boasts state-of-the-art infrastructure and a 1000 bed multi-disciplinary super-specialty hospital conducive to advanced teaching, learning, and research. The university offers programs in Nursing, Physiotherapy, Allied Health Sciences, alongside its Medical programs, setting benchmarks in excellence to surpass targets continually. </p>
                              <p> A strong believer and practitioner of the dictum “Knowledge is Power”, Bhaikaka University has been on the path of delivering high-quality education to the students by inculcating ethical and moral values, nurturing leadership qualities, fostering research culture and cultivating innovative skills. The university is driven by a commitment to quality and excellence, positioning itself as a one of the most respected university, underscored by its significant accomplishments. The university strive to excel in patient care, teaching, research and extension activities, while seeking collaboration opportunities with esteemed global universities. </p>
                          </div>
                        </div>
                        <p> It is both an honour and privilege to be part of Bhaikaka University.  We remain committed to grow and succeed in our mission of providing equitable access to modern healthcare resources and quality education. As we continue to grow, our university harbours a dream of becoming a globally renowned and admired university in future. </p>
                  </div>

              </div>
          </div>
        <Footer />
    </>
  );
}

