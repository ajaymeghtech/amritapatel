"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "@/app/styles/scss/main.scss";

export default function ComingSoon() {
    return (
        <>
            <Header />
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
