import React from "react";
import {
  Outlet,
  useLocation,
} from "react-router-dom";

import BarberHeaderSection from "../sections/BarberHeaderSection/BarberHeaderSection";
import BarberKpisSection from "../sections/BarberKpisSection/BarberKpisSection";
import BarberSidebar from "../components/organisms/BarberSidebar/BarberSidebar";

import "./BarberDashboard.scss";

const BarberDashboard = () => {
  const { pathname } = useLocation();

  return (
    <div className="barber-dashboard">
      <BarberHeaderSection />

      <div className="barber-dashboard__body">
        <BarberSidebar />

        <main className="barber-dashboard__content">
          {pathname ===
            "/barber/dashboard" && (
            <BarberKpisSection />
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BarberDashboard;