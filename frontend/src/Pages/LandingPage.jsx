import React from "react";
import "./LandingPage.css";
import Header from "../components/Header.jsx";
import TopSection from "../components/homepage/TopSection.jsx";
import MiddleSection from "../components/homepage/MiddleSection.jsx";
import AboutSection from "../components/homepage/AboutSection.jsx";
import TestimonialsSection from "../components/homepage/TestimonialsSection.jsx";
import Footer from "../components/Footer.jsx";

export default function LandingPage() {
  return (
    <>
      <Header />
      <TopSection />
      <MiddleSection />
      <AboutSection />
      <TestimonialsSection />
      <Footer />
    </>
  );
}
