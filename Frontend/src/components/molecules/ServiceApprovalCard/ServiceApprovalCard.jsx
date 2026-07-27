import React from "react";
import "./ServiceApprovalCard.scss";

// Admin service approval card

const ServiceApprovalCard = ({
  service,
  onApprove,
  onReject,
}) => {
  if (!service) return null;

  const barber =
    service.barberProfileId;

  return (
    <div className="service-approval-card">
      {/* SERVICE IMAGE */}

      {service.imageUrl ? (
        <img
          src={service.imageUrl}
          alt={service.title}
          className="service-image"
        />
      ) : (
        <div className="service-image placeholder">
          No Image
        </div>
      )}

      <h4>{service.title}</h4>

      <p>
        <strong>Price:</strong> ₹
        {service.price}
      </p>

      <p>
        <strong>Duration:</strong>{" "}
        {service.duration} mins
      </p>

      {/* GENDER DISPLAY */}

      <p>
        <strong>Gender:</strong>{" "}
        {service.gender === "male" &&
          "👨 Male"}

        {service.gender ===
          "female" && "👩 Female"}

        {service.gender === "other" &&
          "⚧ Other"}

        {!service.gender && "N/A"}
      </p>

      {/* DESCRIPTION */}

      {service.description && (
        <p className="description">
          <strong>Description:</strong>{" "}
          {service.description}
        </p>
      )}

      <p>
        <strong>Barber Shop:</strong>{" "}
        {barber?.shopName || "N/A"}
      </p>

      <p>
        <strong>City:</strong>{" "}
        {barber?.city || "N/A"}
      </p>

      <div
        className={`status ${service.status?.toLowerCase()}`}
      >
        {service.status}
      </div>

      <div className="actions">
        <button
          className="approve-btn"
          onClick={() =>
            onApprove(service._id)
          }
        >
          Approve
        </button>

        <button
          className="reject-btn"
          onClick={() =>
            onReject(service._id)
          }
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default ServiceApprovalCard;