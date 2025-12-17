"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import advisoryBanner from "@/app/assets/images/banner/advisory_innerbanner.png";

import { fetchCMSByKey } from "@/app/services/cmsService";

export default function BoardOfStudies() {
    const [cmsData, setCmsData] = useState(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        async function loadData() {
            const res = await fetchCMSByKey("board_of_studies");
            setCmsData(res);
        }
        loadData();
    }, []);

    console.log("CMS Data:", cmsData,`${API_BASE_URL}${cmsData?.banner_image}`);

    return (
        <>
            <Header />
            <Innerbanner title="Board Of Studies"  image={advisoryBanner} />
            <div className="sectionPadding">
                <div className="container">
                    {cmsData?.content ? (
                        <div dangerouslySetInnerHTML={{ __html: cmsData.content }} />
                    ) : (
                        <p>Loading...</p>
                    )}

                    {/* <div class="table-responsive">
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
                    </div> */}
                </div>
            </div>

            <Footer />
        </>
    );
}



