import React from "react";
import { Navigate, Route, Routes, useLocation,} from "react-router-dom";

import BarberHeaderSection from "../sections/BarberHeaderSection/BarberHeaderSection";
import BarberOverviewSection from "../sections/BarberOverviewSection/BarberOverviewSection";
import BarberSidebar from "../components/organisms/BarberSidebar/BarberSidebar";

import BarberProfileSection from "../sections/BarberProfileSection/BarberProfileSection";
import BarberServiceSection from "../sections/BarberServiceSection/BarberServiceSection";
import BarberOrderSection from "../sections/BarberOrderSection/BarberOrderSection";
import BarberCmsSection from "../sections/BarberCmsSection/BarberCmsSection";
import BarberSettingSection from "../sections/BarberSettingSection/BarberSettingSection";
import BarberSlotSection from "../sections/BarberSlotSection/BarberSlotSection";

// Earnings
import BarberEarningsOverview from "../sections/BarberEarningsOverview/BarberEarningsOverview";
import BarberPaymentsOverview from "../sections/BarberPaymentsOverview/BarberPaymentsOverview";
import BarberPaymentsTable from "../sections/BarberPaymentsTable/BarberPaymentsTable";

// Support
import BarberSupportSection from "../sections/BarberSupportSection/BarberSupportSection";
import BarberAnalyticsSection from "../sections/BarberAnalyticsSection/BarberAnalyticsSection";
import BarberStaffSection from "../sections/BarberStaffSection/BarberStaffSection";

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

            {/* Website / CMS */}
            <Route
              path="website"
              element={<BarberCmsSection />}
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
              element={<ComingSoon title="Expenditure" />}
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