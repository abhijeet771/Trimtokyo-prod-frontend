import React from "react";

import HeaderSection from "../sections/HomePage/HeaderSection/HeaderSection";

import CareerHero from "../sections/CareerPage/CareerHero";
import CareerOpenPositions from "../sections/CareerPage/CareerOpenPositions";

import MainFooter from "../components/website/MainFooter/MainFooter"
import "./Career.scss";

const Career = () => {
  return (
    <main className="career-page-layout">
      <HeaderSection/>
      <CareerHero />
      <CareerOpenPositions />
      <MainFooter/>
    </main>
  );
};

export default Career;
