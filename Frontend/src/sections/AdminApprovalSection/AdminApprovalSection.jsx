import React, {  useState,} from "react";
import useAdminApprovals from "../../hooks/useAdminApprovals";
import ApprovalCard from "../../components/molecules/ApprovalCard/ApprovalCard";
import ServiceApprovalCard from "../../components/molecules/ServiceApprovalCard/ServiceApprovalCard";

import "./AdminApprovalSection.scss";

// Admin barber approval section

const AdminApprovalSection = () => {
  const [activeTab, setActiveTab,] = useState("profile");

  const {
    approvals = [],
    pendingServices = [],
    loading,
    error,

    approveBarber,
    declineBarber,

    approveService,
    rejectService,

    toggleFeatureBarber,
  } = useAdminApprovals();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Pending approvals

  const pendingBarbers =
    approvals.filter(
      (barber) =>
        barber.status === "PENDING"
    );

  // Approved barbers

  const approvedBarbers =
    approvals.filter(
      (barber) =>
        barber.status === "APPROVED"
    );

  return (
    <div className="admin-approval-section">
      {/* TABS */}

      <div className="approval-tabs">
        <button
          className={
            activeTab === "profile"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("profile")
          }
        >
          Profile Approvals
        </button>

        <button
          className={
            activeTab === "service"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("service")
          }
        >
          Service Approvals
        </button>

        <button
          className={
            activeTab === "featured"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("featured")
          }
        >
          Featured Barbers
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* PROFILE APPROVALS */}

      {activeTab === "profile" && (
        <>
          <h3>
            Pending Approvals
          </h3>

          {pendingBarbers.length ===
          0 ? (
            <p className="empty">
              No pending barber
              approvals.
            </p>
          ) : (
            <div className="approval-list">
              {pendingBarbers.map(
                (barber) => (
                  <ApprovalCard
                    key={barber._id}
                    barber={barber}
                    onApprove={
                      approveBarber
                    }
                    onDecline={
                      declineBarber
                    }
                  />
                )
              )}
            </div>
          )}
        </>
      )}

      {/* SERVICE APPROVALS */}

      {activeTab === "service" && (
        <>
          <h3>
            Pending Service
            Approvals
          </h3>

          {pendingServices.length ===
          0 ? (
            <p className="empty">
              No pending service
              approvals.
            </p>
          ) : (
            <div className="approval-list">
              {pendingServices.map(
                (service) => (
                  <ServiceApprovalCard
                    key={service._id}
                    service={service}
                    onApprove={
                      approveService
                    }
                    onReject={
                      rejectService
                    }
                  />
                )
              )}
            </div>
          )}
        </>
      )}

      {/* FEATURED BARBERS */}

      {activeTab === "featured" && (
        <>
          <h3>
            Featured Homepage
            Barbers
          </h3>

          {approvedBarbers.length ===
          0 ? (
            <p className="empty">
              No approved barbers
              found.
            </p>
          ) : (
            <div className="approval-list">
              {approvedBarbers.map(
                (barber) => (
                  <ApprovalCard
                    key={barber._id}
                    barber={barber}
                    onApprove={
                      approveBarber
                    }
                    onDecline={
                      declineBarber
                    }
                    onToggleFeature={
                      toggleFeatureBarber
                    }
                  />
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminApprovalSection;