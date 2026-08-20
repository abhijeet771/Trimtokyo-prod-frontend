import React, { useState, useEffect } from "react";

import SplashScreen from "../sections/SplashSection/SplashScreen";
import HeaderSection from "../sections/HeaderSection/HeaderSection";
import ReelSection from "../sections/ReelSection/ReelSection";
import SoloBarbersSection from "../sections/SoloBarbersSection/SoloBarbersSection";
import Hero from "../components/organisms/Hero/Hero";
import Services from "../components/organisms/Services/Services";
import Testimonial from "../components/organisms/Testimonial/Testimonial";
import MainFooter from "../components/organisms/MainFooter/MainFooter";

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
          <Hero/>
          <ReelSection/>
          <Services />
          <SoloBarbersSection />
          <Testimonial/>
          <MainFooter />
        </>
      )}
    </>
  );
};

export default HomePage;