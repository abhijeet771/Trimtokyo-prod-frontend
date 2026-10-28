import React from "react";

import HeaderSection from "../sections/HomePage/HeaderSection/HeaderSection";
import BarberCreateSection from "../sections/BecomeBarber/BarberCreateSection";
import BarberApplicationSection from "../sections/BecomeBarber/BarberApplicationSection";
import MainFooter from "../components/website/MainFooter/MainFooter";

import "./BecomeBarber.scss";

const BecomeBarber = () => {
  const handleBarberApplication = async (formData) => {
    // Connect your barber application API here.
    // Example:
    // await barberService.createApplication(formData);
    console.log("Barber application:", formData);
  };

  return (
    <main className="become-barber-page">
      <HeaderSection/>
      <BarberCreateSection/>
      <BarberApplicationSection onSubmit={handleBarberApplication}/>
      <MainFooter/>
    </main>
  );
};

export default BecomeBarber;
