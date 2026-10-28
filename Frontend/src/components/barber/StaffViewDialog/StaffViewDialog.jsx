
import { X, UserRound, Mail, Phone, MapPin, CalendarDays, BriefcaseBusiness, ShieldCheck, UserCircle } from "lucide-react";
import "./StaffViewDialog.scss";

const ROLE_LABELS = {
  RECEPTIONIST: "Receptionist",
  MANAGER: "Manager",
  ASSISTANT: "Assistant",
  BARBER: "Barber",
  CLEANER: "Cleaner",
  OTHER: "Other",
};

const EMPLOYMENT_LABELS = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
};

const formatDate = (value) => {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not provided";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "S";

const getStatusClass = (status) => {
  switch (status) {
    case "ACTIVE":
      return "is-active";
    case "INACTIVE":
      return "is-inactive";
    case "SUSPENDED":
      return "is-suspended";
    default:
      return "is-unknown";
  }
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status.charAt(0) + status.slice(1).toLowerCase();
};

export default function StaffViewDialog({
  isOpen,
  onClose,
  staff,
  onEdit,
}) {
  if (!isOpen || !staff) return null;

  const roleLabel =
    ROLE_LABELS[staff.role] ||
    (staff.role
      ? staff.role.charAt(0).toUpperCase() +
        staff.role.slice(1).toLowerCase()
      : "Not assigned");

  const employmentLabel =
    EMPLOYMENT_LABELS[staff.employmentType] || "Not provided";

  const userId =
    typeof staff.userId === "object"
      ? staff.userId?._id
      : staff.userId;

  return (
    <div
      className="staff-view-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        className="staff-view-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-view-title"
      >
        <header className="staff-view-dialog__header">
          <div>
            <span className="staff-view-dialog__eyebrow">
              STAFF PROFILE
            </span>
            <h2 id="staff-view-title">Staff Details</h2>
          </div>

          <button
            type="button"
            className="staff-view-dialog__close"
            onClick={onClose}
            aria-label="Close staff details"
          >
            <X size={20} />
          </button>
        </header>

        <div className="staff-view-dialog__body">
          <div className="staff-view-dialog__profile">
            <div className="staff-view-dialog__avatar">
              {staff.profileImage ? (
                <img
                  src={staff.profileImage}
                  alt={staff.fullName || "Staff member"}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span>{getInitials(staff.fullName)}</span>
              )}
            </div>

            <div className="staff-view-dialog__identity">
              <h3>{staff.fullName || "Unnamed staff member"}</h3>
              <p>{roleLabel}</p>
              <span
                className={`staff-view-dialog__status ${getStatusClass(
                  staff.status
                )}`}
              >
                <span className="staff-view-dialog__status-dot" />
                {formatStatus(staff.status)}
              </span>
            </div>
          </div>

          <section className="staff-view-dialog__section">
            <h4>Contact Information</h4>

            <div className="staff-view-dialog__details-grid">
              <div className="staff-view-dialog__detail">
                <span className="staff-view-dialog__detail-icon">
                  <Phone size={17} />
                </span>
                <div>
                  <label>Phone Number</label>
                  <p>{staff.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="staff-view-dialog__detail">
                <span className="staff-view-dialog__detail-icon">
                  <Mail size={17} />
                </span>
                <div>
                  <label>Email Address</label>
                  <p className="staff-view-dialog__break">
                    {staff.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="staff-view-dialog__detail staff-view-dialog__detail--full">
                <span className="staff-view-dialog__detail-icon">
                  <MapPin size={17} />
                </span>
                <div>
                  <label>Address</label>
                  <p>{staff.address || "Not provided"}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="staff-view-dialog__section">
            <h4>Employment Information</h4>

            <div className="staff-view-dialog__details-grid">
              <div className="staff-view-dialog__detail">
                <span className="staff-view-dialog__detail-icon">
                  <BriefcaseBusiness size={17} />
                </span>
                <div>
                  <label>Role</label>
                  <p>{roleLabel}</p>
                </div>
              </div>

              <div className="staff-view-dialog__detail">
                <span className="staff-view-dialog__detail-icon">
                  <UserCircle size={17} />
                </span>
                <div>
                  <label>Employment Type</label>
                  <p>{employmentLabel}</p>
                </div>
              </div>

              <div className="staff-view-dialog__detail">
                <span className="staff-view-dialog__detail-icon">
                  <CalendarDays size={17} />
                </span>
                <div>
                  <label>Joining Date</label>
                  <p>{formatDate(staff.joiningDate)}</p>
                </div>
              </div>

              <div className="staff-view-dialog__detail">
                <span className="staff-view-dialog__detail-icon">
                  <ShieldCheck size={17} />
                </span>
                <div>
                  <label>Staff Status</label>
                  <p>{formatStatus(staff.status)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="staff-view-dialog__section">
            <h4>Account Information</h4>

            <div className="staff-view-dialog__details-grid">
              <div className="staff-view-dialog__detail staff-view-dialog__detail--full">
                <span className="staff-view-dialog__detail-icon">
                  <UserRound size={17} />
                </span>
                <div>
                  <label>Linked Auth User ID</label>
                  <p className="staff-view-dialog__break">
                    {userId || "No login account linked"}
                  </p>
                </div>
              </div>

              <div className="staff-view-dialog__detail">
                <div>
                  <label>Created At</label>
                  <p>{formatDate(staff.createdAt)}</p>
                </div>
              </div>

              <div className="staff-view-dialog__detail">
                <div>
                  <label>Last Updated</label>
                  <p>{formatDate(staff.updatedAt)}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="staff-view-dialog__footer">
          <button
            type="button"
            className="staff-view-dialog__button staff-view-dialog__button--secondary"
            onClick={onClose}
          >
            Close
          </button>

          {onEdit && (
            <button
              type="button"
              className="staff-view-dialog__button staff-view-dialog__button--primary"
              onClick={() => onEdit(staff)}
            >
              Edit Staff
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}
