import React, { useState, useEffect } from "react";
import SplashScreen from "../sections/SplashSection/SplashScreen";
import HeaderSection from "../sections/HeaderSection/HeaderSection";
import HeroSection from "../sections/HeroSection/HeroSection";
import ReelSection from "../sections/ReelSection/ReelSection";
import SoloBarbersSection from "../sections/SoloBarbersSection/SoloBarbersSection";
import ServiceSection from "../sections/ServiceSection/ServiceSection";
import TestimonialSection from "../sections/TestimonialSection/TestimonialSection";
import MainFooterSection from "../sections/MainFooterSection/MainFooterSection";
import WorkOfflineSection from "../sections/WorkOfflineSection/WorkOfflineSection";

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const alreadyShown = localStorage.getItem("splashShown");

    if (alreadyShown) {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}

      {!loading && (
        <>
          <HeaderSection />
          <HeroSection />
          <ReelSection/>
          <ServiceSection />
          <SoloBarbersSection />
          <WorkOfflineSection />
          <TestimonialSection />
          <MainFooterSection />
        </>
      )}
    </>
  );
};

export default HomePage;