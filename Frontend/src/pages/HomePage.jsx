import React, { useState, useEffect } from "react";

import HeaderSection from "../sections/HomePage/HeaderSection/HeaderSection";
import SplashScreen from "../sections/HomePage/SplashSection/SplashScreen";
import OptionalSection from "../sections/HomePage/OptionalSection/OptionalSection";
import ExploreCategory from "../sections/HomePage/ExploreCategory/ExploreCategory";
import EventSection from "../sections/HomePage/EventSection/EventSection";
import SubscriptionSection from "../sections/HomePage/SubscriptionSection/SubscriptionSection";
import ReelSection from "../sections/HomePage/ReelSection/ReelSection";

import Hero from "../components/website/Hero/Hero";
import Services from "../components/website/Services/Services";
import Testimonial from "../components/website/Testimonial/Testimonial";
import MainFooter from "../components/website/MainFooter/MainFooter";

import "./HomePage.scss";

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const alreadyShown = localStorage.getItem("splashShown");

    if (alreadyShown) {
      setLoading(false);
    }
  }, []);

  const handleSplashFinish = () => {
    localStorage.setItem("splashShown", "true");
    setLoading(false);
  };

  return (
    <main className="home-page">
      {loading ? (
        <SplashScreen onFinish={handleSplashFinish} />) : (
        <>
          <HeaderSection />

          <div className="home-page__content">
            <Hero />
            <ExploreCategory />
            <OptionalSection />
            <Services />
            <EventSection />
            <ReelSection />
            <SubscriptionSection />
            <Testimonial />
          </div>
          <MainFooter />
        </>
      )}
    </main>
  );
};

export default HomePage;
