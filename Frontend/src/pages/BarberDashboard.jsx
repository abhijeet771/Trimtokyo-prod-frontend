import React from "react";
import { Navigate, Route, Routes, useLocation,} from "react-router-dom";

import BarberHeaderSection from "../sections/barber/BarberHeaderSection/BarberHeaderSection";
import BarberOverviewSection from "../sections/barber/BarberOverviewSection/BarberOverviewSection";
import BarberSidebar from "../components/barber/BarberSidebar/BarberSidebar";

import BarberProfileSection from "../sections/barber/BarberProfileSection/BarberProfileSection";
import BarberServiceSection from "../sections/barber/BarberServiceSection/BarberServiceSection";
import BarberOrderSection from "../sections/barber/BarberOrderSection/BarberOrderSection";
import BarberSettingSection from "../sections/barber/BarberSettingSection/BarberSettingSection";
import BarberSlotSection from "../sections/barber/BarberSlotSection/BarberSlotSection";

// Earnings
import BarberEarningsOverview from "../sections/barber/BarberEarningsOverview/BarberEarningsOverview";
import BarberPaymentsOverview from "../sections/barber/BarberPaymentsOverview/BarberPaymentsOverview";
import BarberPaymentsTable from "../sections/barber/BarberPaymentsTable/BarberPaymentsTable";
import BarberExpenceSection from "../sections/barber/BarberExpenceSection/BarberExpenceSection";

// Support
import BarberSupportSection from "../sections/barber/BarberSupportSection/BarberSupportSection";
import BarberAnalyticsSection from "../sections/barber/BarberAnalyticsSection/BarberAnalyticsSection";
import BarberStaffSection from "../sections/barber/BarberStaffSection/BarberStaffSection";

import "./BarberDashboard.scss";

const ComingSoon = ({ title }) => (
  <section className="barber-dashboard__placeholder">
    <div className="barber-dashboard__placeholder-icon">✦</div>
    <h2>{title}</h2>
    <p>This section is under development.</p>
    <span>We're working on this feature.</span>
  </section>
);

const BarberDashboard = () => {
  const location = useLocation();

  return (
    <div className="barber-dashboard">
      <BarberHeaderSection />

      <div className="barber-dashboard__body">
        <BarberSidebar />

        <main className="barber-dashboard__content">
          <Routes>
            {/* Default dashboard route */}
            <Route
              index
              element={
                <Navigate
                  to="/barber/dashboard"
                  replace
                />
              }
            />

            {/* Dashboard */}
            <Route
              path="dashboard"
              element={<BarberOverviewSection />}
            />

            {/* Profile */}
            <Route
              path="profile"
              element={<BarberProfileSection />}
            />

            {/* Services */}
            <Route
              path="service"
              element={<BarberServiceSection />}
            />
            {/* Staff */}
            <Route
              path="staff"
              element={<BarberStaffSection />}
            />

            {/* Orders */}
            <Route
              path="orders"
              element={<BarberOrderSection />}
            />

            {/* Slots */}
            <Route
              path="slots"
              element={<BarberSlotSection />}
            />

            {/* Settings */}
            <Route
              path="settings"
              element={<BarberSettingSection />}
            />

           <Route
           path="analytics"
           element={<BarberAnalyticsSection />}
            />
            {/* Earnings overview */}
            <Route
              path="earnings"
              element={<BarberEarningsOverview />}
            />

            {/* Payments overview */}
            <Route
              path="earnings/payments/overview"
              element={<BarberPaymentsOverview />}
            />

            {/* Payments table */}
            <Route
              path="earnings/payments"
              element={<BarberPaymentsTable />}
            />

            {/* Expenditure */}
            <Route
              path="earnings/expenditure"
              element={<BarberExpenceSection />}
            />

            {/* Help & Support */}
            <Route
              path="support"
              element={<BarberSupportSection />}
            />

            {/* Unknown barber routes */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/barber/dashboard"
                  replace
                  state={{ from: location.pathname }}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default BarberDashboard;