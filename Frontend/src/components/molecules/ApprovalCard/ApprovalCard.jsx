import React from "react";
import {
  MapPin,
  Phone,
  UserRound,
  Eye,
  CheckCircle2,
  XCircle,
  Star,
  StarOff,
  Clock3,
  Store,
} from "lucide-react";

import { ADMIN_TEXT } from "../../../constants/admin";
import "./ApprovalCard.scss";

const ApprovalCard = ({
  barber,
  onApprove,
  onDecline,
  onToggleFeature,
}) => {
  if (!barber) return null;

  const status = barber.status?.toUpperCase() || "PENDING";
  const isApproved = status === "APPROVED";
  const isPending = status === "PENDING";
  const isRejected = status === "REJECTED";
  const isFeatured = Boolean(barber.isFeatured);

  const shopName = barber.shopName || "Unnamed Barber Shop";
  const ownerName = barber.userId?.name || "Owner not provided";
  const city = barber.city || "Location unavailable";
  const phone = barber.phone || "Phone unavailable";
  const description =
    barber.description || "No description has been provided for this shop.";

  const handleView = () => {
    // Add your barber details modal or navigation here.
    // The current component does not receive an existing view callback.
  };

  return (
    <article className="approval-card">
      <div className="approval-card__image-wrapper">
        {barber.profileImage ? (
          <img
            src={barber.profileImage}
            alt={`${shopName} profile`}
            className="approval-card__image"
            loading="lazy"
          />
        ) : (
          <div className="approval-card__image-placeholder">
            <Store size={42} />
            <span>No shop image</span>
          </div>
        )}

        <span className={`approval-card__status approval-card__status--${status.toLowerCase()}`}>
          {isPending && <Clock3 size={14} />}
          {isApproved && <CheckCircle2 size={14} />}
          {isRejected && <XCircle size={14} />}
          {status}
        </span>

        {isFeatured && (
          <span className="approval-card__featured-label">
            <Star size={13} fill="currentColor" />
            Featured
          </span>
        )}
      </div>

      <div className="approval-card__body">
        <div className="approval-card__title-row">
          <div className="approval-card__title-content">
            <span className="approval-card__eyebrow">
              BARBER PROFILE
            </span>

            <h3>{shopName}</h3>
          </div>

          <button
            type="button"
            className="approval-card__view-icon"
            onClick={handleView}
            aria-label={`View ${shopName} details`}
            title="View profile"
          >
            <Eye size={18} />
          </button>
        </div>

        <p className="approval-card__description">{description}</p>

        <div className="approval-card__details">
          <div className="approval-card__detail">
            <span className="approval-card__detail-icon approval-card__detail-icon--purple">
              <UserRound size={16} />
            </span>

            <span className="approval-card__detail-label">Owner</span>
            <span className="approval-card__detail-value">{ownerName}</span>
          </div>

          <div className="approval-card__detail">
            <span className="approval-card__detail-icon approval-card__detail-icon--blue">
              <MapPin size={16} />
            </span>

            <span className="approval-card__detail-label">City</span>
            <span className="approval-card__detail-value">{city}</span>
          </div>

          <div className="approval-card__detail">
            <span className="approval-card__detail-icon approval-card__detail-icon--green">
              <Phone size={16} />
            </span>

            <span className="approval-card__detail-label">Phone</span>
            <span className="approval-card__detail-value">{phone}</span>
          </div>
        </div>

        {isApproved && (
          <div className={`approval-card__feature-state ${isFeatured ? "is-featured" : ""}`}>
            <Star size={16} fill={isFeatured ? "currentColor" : "none"} />
            <span>
              {isFeatured
                ? "Shown on homepage"
                : "Not featured on homepage"}
            </span>
          </div>
        )}

        <div className="approval-card__actions">
          {isPending && (
            <>
              <button
                type="button"
                className="approval-card__button approval-card__button--approve"
                onClick={() => onApprove?.(barber._id)}
              >
                <CheckCircle2 size={17} />
                {ADMIN_TEXT.buttons.approve}
              </button>

              <button
                type="button"
                className="approval-card__button approval-card__button--decline"
                onClick={() => onDecline?.(barber._id)}
              >
                <XCircle size={17} />
                {ADMIN_TEXT.buttons.decline}
              </button>
            </>
          )}

          {isApproved && (
            <button
              type="button"
              className={`approval-card__button ${
                isFeatured
                  ? "approval-card__button--unfeature"
                  : "approval-card__button--feature"
              }`}
              onClick={() =>
                onToggleFeature?.(barber._id, !isFeatured)
              }
              disabled={!onToggleFeature}
            >
              {isFeatured ? (
                <StarOff size={17} />
              ) : (
                <Star size={17} />
              )}

              {isFeatured ? "Remove Feature" : "Feature Homepage"}
            </button>
          )}

          {isRejected && (
            <div className="approval-card__rejected-note">
              <XCircle size={16} />
              This profile has been rejected.
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ApprovalCard;