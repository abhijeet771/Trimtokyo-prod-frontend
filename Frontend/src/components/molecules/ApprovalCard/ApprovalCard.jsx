import React from "react";
import { ADMIN_TEXT } from "../../../constants/admin";
import "./ApprovalCard.scss";

// Admin barber approval/manage card
const ApprovalCard = ({  barber,  onApprove,  onDecline,  onToggleFeature,}) => {
  if (!barber) return null;

  return (
    <div className="approval-card">

      {barber.profileImage && (
        <img  src={barber.profileImage}  alt={barber.shopName}  className="barber-image"/>
      )}

      <h4> {barber.shopName}</h4>
      <p> {barber.description}</p>
      <p> <strong>Owner:</strong>{" "}{barber.userId?.name || "N/A"}</p>
      <p> <strong>City:</strong>{" "} {barber.city}</p>
      <p> <strong>Phone:</strong>{" "} {barber.phone}</p>

      <div className={`status ${barber.status?.toLowerCase()}`}>
        {barber.status}
      </div>

      {barber.isFeatured && (
        <div className="featured-badge"> ⭐ Featured on Homepage  </div>
      )}

      <div className="actions">
        <button> {ADMIN_TEXT.buttons.view}  </button>

        <button  onClick={() =>onApprove(barber._id)}>
          {ADMIN_TEXT.buttons.approve}
        </button>

        <button  onClick={() =>  onDecline(barber._id) }>
          {ADMIN_TEXT.buttons.decline}
        </button>

        {barber.status === "APPROVED" && (
          <button className={   barber.isFeatured ? "remove-feature-btn" : "feature-btn"}
            onClick={() =>onToggleFeature( barber._id, !barber.isFeatured)}>
            {barber.isFeatured ? "Remove Feature" : "Feature Homepage"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ApprovalCard;