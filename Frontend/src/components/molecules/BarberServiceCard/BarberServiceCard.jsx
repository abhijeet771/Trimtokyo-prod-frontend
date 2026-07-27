import React from "react";
import "./BarberServiceCard.scss";

// Display single barber service
const BarberServiceCard = ({
  service,
}) => {
  if (!service) return null;

  const status =
    service.status?.toLowerCase() ||
    "pending";

  return (
    <div className="barber-service-card">
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

      <h4>
        {service.title ||
          "Untitled Service"}
      </h4>

      <p>
        <strong>Price:</strong> ₹
        {service.price ?? 0}
      </p>

      <p>
        <strong>Duration:</strong>{" "}
        {service.duration ?? 0} mins
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
        <strong>Status:</strong>{" "}
        <span
          className={`status ${status}`}
        >
          {service.status}
        </span>
      </p>
    </div>
  );
};

export default BarberServiceCard;