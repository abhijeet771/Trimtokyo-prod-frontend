import React, { useState } from "react";
import AdminHeaderSection from "../sections/AdminHeaderSection/AdminHeaderSection";
import AdminTabSection from "../sections/AdminTabSection/AdminTabSection";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="admin-dashboard">
      <AdminHeaderSection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <AdminTabSection activeTab={activeTab} />
    </div>
  );
};

export default AdminDashboard;