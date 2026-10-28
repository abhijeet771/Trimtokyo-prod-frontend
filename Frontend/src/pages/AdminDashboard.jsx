import React, { useEffect, useState } from "react";
import AdminSidebar from "../sections/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../sections/admin/AdminTopbar/AdminTopbar";
import AdminContentSection from "../sections/admin/AdminContentSection/AdminContentSection";
import useDisplay from "../hooks/admin/useDisplay";
import "./AdminDashboard.scss";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { settings } = useDisplay();

  useEffect(() => {
    if (settings?.defaultSidebarOpen !== undefined) {
      setSidebarOpen(settings.defaultSidebarOpen);
    }
  }, [settings?.defaultSidebarOpen]);

  const zoomPercentage = Math.min(
    100,
    Math.max(50, Number(settings?.zoomPercentage ?? 100))
  );

  const dashboardStyle = {
    "--dashboard-scale": zoomPercentage / 100,
  };

  return (
    <div
      className={`admin-dashboard ${
        sidebarOpen ? "admin-dashboard--sidebar-open"
          : "admin-dashboard--sidebar-closed"
      }`}
      style={dashboardStyle}
    >
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

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