import React, { useState } from "react";

import AdminSidebar from "../sections/AdminSidebar/AdminSidebar";
import AdminTopbar from "../sections/AdminTopbar/AdminTopbar";
import AdminContentSection from "../sections/AdminContentSection/AdminContentSection";

import "./AdminDashboard.scss";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="admin-dashboard">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab}/>

      <div className="admin-dashboard__main">
        <AdminTopbar activeTab={activeTab} />
        <main className="admin-dashboard__content">
          <AdminContentSection activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;