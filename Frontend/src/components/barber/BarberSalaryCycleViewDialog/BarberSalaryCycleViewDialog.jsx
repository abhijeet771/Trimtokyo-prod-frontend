
import {
  X,
  UserRound,
  CalendarDays,
  Wallet,
  IndianRupee,
  Clock,
  Pencil,
  ReceiptText,
} from "lucide-react";

import "./BarberSalaryCycleViewDialog.scss";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not recorded";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatEnum = (value) => {
  if (!value) return "Not specified";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStaff = (staffId) => {
  if (staffId && typeof staffId === "object") {
    return staffId;
  }

  return null;
};

export default function BarberSalaryCycleViewDialog({
  isOpen,
  onClose,
  salaryCycle,
  onEdit,
}) {
  if (!isOpen || !salaryCycle) return null;

  const staff = getStaff(salaryCycle.staffId);

  const statusClass = {
    PAID: "paid",
    PENDING: "pending",
    PARTIALLY_PAID: "partial",
  }[salaryCycle.paymentStatus] || "pending";

  const handleEdit = () => {
    onEdit?.(salaryCycle);
  };

  return (
    <div
      className="salary-cycle-view__overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        className="salary-cycle-view"
        role="dialog"
        aria-modal="true"
        aria-labelledby="salary-cycle-view-title"
      >
        <header className="salary-cycle-view__header">
          <div className="salary-cycle-view__icon">
            <Wallet size={22} />
          </div>

          <div className="salary-cycle-view__heading">
            <h2 id="salary-cycle-view-title">Salary Cycle Details</h2>
            <p>Review salary and payment information</p>
          </div>

          <button
            type="button"
            className="salary-cycle-view__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </header>

        <div className="salary-cycle-view__body">
          <section className="salary-cycle-view__summary">
            <div>
              <span className="salary-cycle-view__eyebrow">
                NET SALARY
              </span>

              <strong className="salary-cycle-view__amount">
                {formatCurrency(salaryCycle.netSalary)}
              </strong>

              <span className="salary-cycle-view__period">
                {formatDate(salaryCycle.cycleStartDate)}
                {" — "}
                {formatDate(salaryCycle.cycleEndDate)}
              </span>
            </div>

            <span
              className={`salary-cycle-view__status salary-cycle-view__status--${statusClass}`}
            >
              {formatEnum(salaryCycle.paymentStatus)}
            </span>
          </section>

          <section className="salary-cycle-view__section">
            <div className="salary-cycle-view__section-heading">
              <UserRound size={17} />
              <h3>Staff Information</h3>
            </div>

            <div className="salary-cycle-view__details-grid">
              <Detail
                label="Staff name"
                value={staff?.fullName || "Staff information unavailable"}
              />

              <Detail
                label="Role"
                value={staff?.role ? formatEnum(staff.role) : "Not available"}
              />

              <Detail
                label="Phone"
                value={staff?.phone || "Not available"}
              />

              <Detail
                label="Employment type"
                value={
                  staff?.employmentType
                    ? formatEnum(staff.employmentType)
                    : "Not available"
                }
              />
            </div>
          </section>

          <section className="salary-cycle-view__section">
            <div className="salary-cycle-view__section-heading">
              <CalendarDays size={17} />
              <h3>Salary Period</h3>
            </div>

            <div className="salary-cycle-view__details-grid">
              <Detail
                label="Cycle start date"
                value={formatDate(salaryCycle.cycleStartDate)}
              />

              <Detail
                label="Cycle end date"
                value={formatDate(salaryCycle.cycleEndDate)}
              />

              <Detail
                label="Salary type"
                value={formatEnum(salaryCycle.salaryType)}
              />

              <Detail
                label="Working days"
                value={salaryCycle.workingDays ?? 0}
              />
            </div>
          </section>

          <section className="salary-cycle-view__section">
            <div className="salary-cycle-view__section-heading">
              <IndianRupee size={17} />
              <h3>Salary Breakdown</h3>
            </div>

            <div className="salary-cycle-view__breakdown">
              <BreakdownRow
                label="Base salary / cycle amount"
                value={salaryCycle.salaryAmount}
              />

              <BreakdownRow
                label="Bonus"
                value={salaryCycle.bonus}
                positive
              />

              <BreakdownRow
                label="Commission"
                value={salaryCycle.commissionAmount}
                positive
              />

              <BreakdownRow
                label="Deductions"
                value={salaryCycle.deductions}
                negative
              />

              <div className="salary-cycle-view__breakdown-total">
                <span>Net salary</span>
                <strong>{formatCurrency(salaryCycle.netSalary)}</strong>
              </div>
            </div>
          </section>

          <section className="salary-cycle-view__section">
            <div className="salary-cycle-view__section-heading">
              <ReceiptText size={17} />
              <h3>Payment Information</h3>
            </div>

            <div className="salary-cycle-view__details-grid">
              <Detail
                label="Payment status"
                value={formatEnum(salaryCycle.paymentStatus)}
              />

              <Detail
                label="Payment date"
                value={formatDate(salaryCycle.paymentDate)}
              />

              <Detail
                label="Payment method"
                value={formatEnum(salaryCycle.paymentMethod)}
              />

              <Detail
                label="Transaction reference"
                value={salaryCycle.transactionReference || "Not recorded"}
              />
            </div>
          </section>

          {salaryCycle.notes && (
            <section className="salary-cycle-view__section">
              <div className="salary-cycle-view__section-heading">
                <Clock size={17} />
                <h3>Notes</h3>
              </div>

              <p className="salary-cycle-view__notes">
                {salaryCycle.notes}
              </p>
            </section>
          )}

          <section className="salary-cycle-view__metadata">
            <span>
              Created: {formatDate(salaryCycle.createdAt)}
            </span>

            <span>
              Last updated: {formatDate(salaryCycle.updatedAt)}
            </span>
          </section>
        </div>

        <footer className="salary-cycle-view__footer">
          <button
            type="button"
            className="salary-cycle-view__button salary-cycle-view__button--secondary"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="salary-cycle-view__button salary-cycle-view__button--primary"
            onClick={handleEdit}
          >
            <Pencil size={15} />
            Edit Salary Cycle
          </button>
        </footer>
      </section>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="salary-cycle-view__detail">
      <span>{label}</span>
      <strong>{value ?? "Not recorded"}</strong>
    </div>
  );
}

function BreakdownRow({ label, value, positive = false, negative = false }) {
  return (
    <div className="salary-cycle-view__breakdown-row">
      <span>{label}</span>

      <strong
        className={
          positive
            ? "salary-cycle-view__positive"
            : negative
              ? "salary-cycle-view__negative"
              : ""
        }
      >
        {negative ? "−" : positive ? "+" : ""}
        {formatCurrency(value)}
      </strong>
    </div>
  );
}
