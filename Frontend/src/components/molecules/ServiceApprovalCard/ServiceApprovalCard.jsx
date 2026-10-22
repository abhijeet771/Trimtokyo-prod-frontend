import React from "react";
import {  Scissors,  Clock3,  IndianRupee,  MapPin,  Store,  CheckCircle2,  XCircle,  Users,  Sparkles,} from "lucide-react";

import "./ServiceApprovalCard.scss";

const ServiceApprovalCard = ({
  service,
  onApprove,
  onReject,
}) => {
  if (!service) return null;

  const barber = service.barberProfileId;
  const status = service.status?.toUpperCase() || "PENDING";
  const isPending = status === "PENDING";

  const title = service.title || "Untitled Service";
  const price = Number(service.price);
  const duration = Number(service.duration);

  const formattedPrice = Number.isFinite(price)
    ? price.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })
    : "Not specified";

  const formattedDuration =
    Number.isFinite(duration) && duration > 0
      ? `${duration} mins`
      : "Not specified";

  const genderLabels = {
    male: "Male",
    female: "Female",
    other: "Other",
  };

  const gender = genderLabels[service.gender?.toLowerCase()] || "Not specified";

  return (
    <article className="service-approval-card">
      <div className="service-approval-card__image-wrapper">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={title}
            className="service-approval-card__image"
            loading="lazy"
          />
        ) : (
          <div className="service-approval-card__placeholder">
            <Scissors size={38} />
            <span>Service image unavailable</span>
          </div>
        )}

        <span
          className={`service-approval-card__status service-approval-card__status--${status.toLowerCase()}`}
        >
          {isPending ? <Clock3 size={14} /> : <CheckCircle2 size={14} />}
          {status}
        </span>

        <span className="service-approval-card__category">
          <Sparkles size={13} />
          Service
        </span>
      </div>

      <div className="service-approval-card__body">
        <div className="service-approval-card__heading">
          <div>
            <span className="service-approval-card__eyebrow">
              SERVICE REVIEW
            </span>
            <h3>{title}</h3>
          </div>
        </div>

        <div className="service-approval-card__highlights">
          <div className="service-approval-card__highlight service-approval-card__highlight--orange">
            <span className="service-approval-card__highlight-icon">
              <IndianRupee size={17} />
            </span>
            <span>
              <small>Price</small>
              <strong>
                {formattedPrice === "Not specified"
                  ? formattedPrice
                  : `₹${formattedPrice}`}
              </strong>
            </span>
          </div>

          <div className="service-approval-card__highlight service-approval-card__highlight--purple">
            <span className="service-approval-card__highlight-icon">
              <Clock3 size={17} />
            </span>
            <span>
              <small>Duration</small>
              <strong>{formattedDuration}</strong>
            </span>
          </div>
        </div>

        {service.description ? (
          <p className="service-approval-card__description">
            {service.description}
          </p>
        ) : (
          <p className="service-approval-card__description service-approval-card__description--muted">
            No service description provided.
          </p>
        )}

        <div className="service-approval-card__gender">
          <Users size={16} />
          <span>For</span>
          <strong>{gender}</strong>
        </div>

        <div className="service-approval-card__details">
          <div className="service-approval-card__detail">
            <span className="service-approval-card__detail-icon service-approval-card__detail-icon--blue">
              <Store size={16} />
            </span>
            <span className="service-approval-card__detail-label">
              Barber Shop
            </span>
            <strong>
              {barber?.shopName || "Shop unavailable"}
            </strong>
          </div>

          <div className="service-approval-card__detail">
            <span className="service-approval-card__detail-icon service-approval-card__detail-icon--green">
              <MapPin size={16} />
            </span>
            <span className="service-approval-card__detail-label">
              City
            </span>
            <strong>{barber?.city || "Not specified"}</strong>
          </div>
        </div>

        {isPending ? (
          <div className="service-approval-card__actions">
            <button
              type="button"
              className="service-approval-card__button service-approval-card__button--approve"
              onClick={() => onApprove?.(service._id)}
              disabled={!onApprove}
            >
              <CheckCircle2 size={17} />
              Approve
            </button>

            <button
              type="button"
              className="service-approval-card__button service-approval-card__button--reject"
              onClick={() => onReject?.(service._id)}
              disabled={!onReject}
            >
              <XCircle size={17} />
              Reject
            </button>
          </div>
        ) : (
          <div className="service-approval-card__reviewed">
            <CheckCircle2 size={16} />
            This service has been reviewed.
          </div>
        )}
      </div>
    </article>
  );
};

export default ServiceApprovalCard;