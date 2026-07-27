import React from "react";
import useAdminServiceApprovals from "../../hooks/useAdminServiceApprovals";
import ServiceApprovalCard from "../../components/molecules/ServiceApprovalCard/ServiceApprovalCard";
import "./AdminServiceApprovalSection.scss";

// Admin service approval section
const AdminServiceApprovalSection = () => {
  const {
    services = [],
    loading,
    error,
    approve,
    reject,
  } = useAdminServiceApprovals();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-service-approval-section">
      <h3>Pending Service Approvals</h3>

      {error && <div className="error">{error}</div>}

      {services.length === 0 ? (
        <p className="empty">
          No pending service approvals.
        </p>
      ) : (
        <div className="service-list">
          {services.map((service) => (
            <ServiceApprovalCard
              key={service._id}
              service={service}
              onApprove={approve}
              onReject={reject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServiceApprovalSection;