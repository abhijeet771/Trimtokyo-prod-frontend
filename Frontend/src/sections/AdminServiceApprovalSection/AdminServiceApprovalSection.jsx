import useAdminServiceApprovals from "../../hooks/admin/useAdminServiceApprovals";
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
    refresh,
  } = useAdminServiceApprovals();

  if (loading) {
    return (
      <div className="admin-service-approval-section">
        <h3>Pending Service Approvals</h3>
        <p>Loading pending services...</p>
      </div>
    );
  }

  return (
    <div className="admin-service-approval-section">
      <h3>Pending Service Approvals</h3>

      {error && (
        <div className="error" role="alert">
          <p>{error}</p>

          <button type="button" onClick={() => refresh().catch(() => {})}>
            Retry
          </button>
        </div>
      )}

      {!error && services.length === 0 ? (
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
