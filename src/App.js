import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Frontend
import AppFrontend from "./AppFrontend";
// Admin
import AppAdmin from "./admin/AppAdmin";
import ContactUsPage from "./app/contact-us/page";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Frontend routes */}
        <Route path="/*" element={<AppFrontend />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />

        {/* Admin routes */}
        <Route path="/admin/*" element={<AppAdmin />} />
       
      </Routes>
    </Router>
  );
}
