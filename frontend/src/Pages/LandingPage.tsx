import React from "react";
import "./LandingPage.css";
import { Header } from "../components/Header.js";
import { TopSection } from "../components/homepage/TopSection.jsx";
import { MiddleSection } from "../components/homepage/MiddleSection.js";
import { AboutSection } from "../components/homepage/AboutSection.js";
import { TestimonialsSection } from "../components/homepage/TestimonialsSection.js";
import { Footer } from "../components/Footer.js";

export default function LandingPage(): React.JSX.Element {
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
