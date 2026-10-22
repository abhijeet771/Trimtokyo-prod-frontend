import React from "react";
import HeaderSection from "../sections/HomePage/HeaderSection/HeaderSection";
import AboutHeroSection from "../sections/AboutPage/AboutHeroSection/AboutHeroSection";
import AboutRolesSection from "../sections/AboutPage/AboutRolesSection/AboutRolesSection";
import AboutWhyChooseSection from "../sections/AboutPage/AboutWhyChooseSection/AboutWhyChooseSection";
import FAQSection from "../sections/AboutPage/FAQSection/FAQSection";
import MainFooter from "../components/website/MainFooter/MainFooter";


const About = () => {
  return (
    <>
      <HeaderSection />
      <AboutHeroSection/>
      <AboutRolesSection/>
      <AboutWhyChooseSection/>
      <FAQSection/>
      <MainFooter/>  
    </>
  );
};

export default About;