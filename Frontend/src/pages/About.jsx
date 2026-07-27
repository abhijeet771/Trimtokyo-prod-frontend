import React from "react";
import HeaderSection from "../sections/HeaderSection/HeaderSection";
import AboutHeroSection from "../sections/AboutHeroSection/AboutHeroSection";
import AboutRolesSection from "../sections/AboutRolesSection/AboutRolesSection";
import AboutWhyChooseSection from "../sections/AboutWhyChooseSection/AboutWhyChooseSection";
import FAQSection from "../sections/FAQSection/FAQSection";
import MainFooterSection from "../sections/MainFooterSection/MainFooterSection";


const About = () => {
  return (
    <>
      <HeaderSection />
      <AboutHeroSection/>
      <AboutRolesSection/>
      <AboutWhyChooseSection/>
      <FAQSection/>
      <MainFooterSection/>  
    </>
  );
};

export default About;