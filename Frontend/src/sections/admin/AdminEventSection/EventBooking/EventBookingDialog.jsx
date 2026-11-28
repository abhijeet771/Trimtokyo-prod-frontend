import React, { useEffect, useState } from "react";
import {  X,  CalendarDays,  UserRound,  ClipboardList, Trash2,  Save,  Eye,} from "lucide-react";

import "./EventBookingDialog.scss";

const INITIAL_FORM = { customerName: "",
  phone: "", email: "",
  eventCategory: "",
  eventDate: "",
  eventTime: "",
  venueName: "",
  fullAddress: "",
  expectedGuests: "",
  specialRequirements: "",
  internalNotes: "",
};

const BOOKING_STATUSES = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDateInputValue = (value) => {
  if (!value) return "";

  // Preserve the date portion from ISO API responses.
  if (typeof value === "string" && value.includes("T")) {
    return value.split("T")[0];
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getBookingFormData = (bookingData) => ({
  customerName: bookingData.customerName || "",
  phone: bookingData.phone || "",
  email: bookingData.email || "",

  eventCategory: typeof bookingData.eventCategory === "object" ? bookingData.eventCategory?._id || "" : bookingData.eventCategory || "",

  eventDate: getDateInputValue(bookingData.eventDate),
  eventTime: bookingData.eventTime || "",
  venueName: bookingData.venueName || "",
  fullAddress: bookingData.fullAddress || "",

  expectedGuests:
    bookingData.expectedGuests === null ||
    bookingData.expectedGuests === undefined ? "" : String(bookingData.expectedGuests),

  specialRequirements: bookingData.specialRequirements || "",
  internalNotes: bookingData.internalNotes || "",
});

export default function EventBookingDialog({
  isOpen,
  mode = "add",
  bookingData = null,
  categories = [],
  categoriesLoading = false,
  isSaving = false,
  onClose,
  onSave,
  onConfirmDelete,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const isView = mode === "view";
  const isDelete = mode === "delete";
  const isReadOnly = isView || isDelete;
  const isEdit = mode === "edit";

  const currentStatus = (
    bookingData?.status || "PENDING"
  ).toUpperCase();

  /* ============================================================
     INITIALIZE FORM
  ============================================================ */

  useEffect(() => {
    if (!isOpen) return;

    if (bookingData) {
      setFormData(getBookingFormData(bookingData));
    } else {
      setFormData(INITIAL_FORM);
    }

    setErrors({});
  }, [isOpen, bookingData, mode]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /* ============================================================
     UPDATE FIELD
  ============================================================ */

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value, }));
    setErrors((previous) => ({ ...previous, [name]: "",    }));
  };

  /* ============================================================
     FORM VALIDATION
  ============================================================ */

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.customerName.trim()) {
      nextErrors.customerName = "Customer name is required.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (
      !/^[+]?[\d\s()-]{7,20}$/.test(formData.phone.trim())
    ) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.eventCategory) {
      nextErrors.eventCategory = "Select an event type.";
    }

    if (!formData.eventDate) {
      nextErrors.eventDate = "Event date is required.";
    }

    if (!formData.eventTime.trim()) {
      nextErrors.eventTime = "Event time is required.";
    }

    if (
      formData.expectedGuests === "" ||
      !Number.isInteger(Number(formData.expectedGuests)) ||
      Number(formData.expectedGuests) < 1
    ) {
      nextErrors.expectedGuests =
        "Guest count must be at least 1.";
    }

    if (!formData.fullAddress.trim()) {
      nextErrors.fullAddress = "Full address is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  /* ============================================================
     SUBMIT FORM
  ============================================================ */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isReadOnly || isSaving) return;
    if (!validateForm()) return;

    // Payload matches eventBooking.model.js
    const payload = {
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      eventCategory: formData.eventCategory,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime.trim(),
      venueName: formData.venueName.trim(),
      fullAddress: formData.fullAddress.trim(),
      expectedGuests: Number(formData.expectedGuests),
      specialRequirements: formData.specialRequirements.trim(),
      internalNotes: formData.internalNotes.trim(),
    };

    try {
      await onSave?.(payload);
    } catch (error) {
      console.error("Event booking submission failed:", error);
    }
  };

  const handleDelete = () => {
    if (bookingData && !isSaving) {
      onConfirmDelete?.(bookingData);
    }
  };

  /* ============================================================
     DIALOG TITLE
  ============================================================ */

  const title = {
    add: "Add Event Booking",
    edit: "Edit Event Booking",
    view: "Event Booking Details",
    delete: "Delete Event Booking",
  }[mode] || "Event Booking";

  const renderField = ({ label, name, type = "text",
    placeholder = "", required = false, options = null,
    fullWidth = false, min = undefined, disabled = false,
  }) => (
    <div
      className={`event-booking-dialog__field ${
        fullWidth ? "event-booking-dialog__field--full" : ""
      }`}
      key={name}
    >
      <label htmlFor={`event-booking-${name}`}>
        {label}

        {required && !isReadOnly && (
          <span className="event-booking-dialog__required">
            {" "}*
          </span>
        )}
      </label>

      {options ? (
        <select
          id={`event-booking-${name}`}
          name={name}
          value={formData[name] ?? ""}
          onChange={updateField}
          disabled={isReadOnly || disabled}
          required={required && !isReadOnly}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={`event-booking-${name}`}
          name={name}
          value={formData[name] ?? ""}
          onChange={updateField}
          placeholder={placeholder}
          disabled={isReadOnly || disabled}
          rows={3}
        />
      ) : (
        <input
          id={`event-booking-${name}`}
          type={type}
          name={name}
          value={formData[name] ?? ""}
          onChange={updateField}
          placeholder={placeholder}
          disabled={isReadOnly || disabled}
          required={required && !isReadOnly}
          min={min}
        />
      )}

      {errors[name] && (
        <span className="event-booking-dialog__error">
          {errors[name]}
        </span>
      )}
    </div>
  );

  return (
    <div className="event-booking-dialog__overlay"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>
      <section className="event-booking-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-booking-dialog-title">

        <header className="event-booking-dialog__header">
          <div className="event-booking-dialog__header-icon">
            {isView ? ( <Eye size={21} /> ) : isDelete ? (
              <Trash2 size={21} /> ) : (<CalendarDays size={21} />
            )}
          </div>

          <div className="event-booking-dialog__heading">
            <h2 id="event-booking-dialog-title">
              {title}
            </h2>

            <p>
              {isView ? "Review the complete booking information."
                : isDelete ? "Confirm removal of this booking."
                  : isEdit ? "Update the event booking details."
                    : "Enter the customer and event information."}
            </p>
          </div>

          <button type="button" className="event-booking-dialog__close"
            onClick={onClose}
            aria-label="Close dialog">
            <X size={20} />
          </button>
        </header>

        {/* DELETE CONTENT */}

        {isDelete ? (
          <div className="event-booking-dialog__delete-content">
            <div className="event-booking-dialog__delete-icon">
              <Trash2 size={25} />
            </div>

            <h3>Delete this booking?</h3>

            <p>
              You are about to delete the booking for{" "}
              <strong>
                {bookingData?.customerName || "this customer"}
              </strong>
              {bookingData?._id ? ` (${bookingData._id})` : ""}
              . This action cannot be undone.
            </p>
          </div>
        ) : (
          /* BOOKING FORM */

          <form id="event-booking-form"
            className="event-booking-dialog__form" onSubmit={handleSubmit}>
            {/* CUSTOMER INFORMATION */}

            <div className="event-booking-dialog__section-heading">
              <UserRound size={17} />
              <h3>Customer Information</h3>
            </div>

            <div className="event-booking-dialog__grid">
              {renderField({ label: "Customer Name", name: "customerName", placeholder: "Enter customer name", required: true,})}

              {renderField({ label: "Phone Number", name: "phone", type: "tel", placeholder: "Enter phone number",required: true,})}

              {renderField({ label: "Email Address", name: "email", type: "email", placeholder: "customer@example.com",fullWidth: true,})}
            </div>

            {/* EVENT INFORMATION */}

            <div className="event-booking-dialog__section-heading">
              <CalendarDays size={17} />
              <h3>Event Information</h3>
            </div>

            <div className="event-booking-dialog__grid">
              {renderField({
                label: "Event Type",
                name: "eventCategory",
                required: true,
                fullWidth: false,
                disabled: categoriesLoading,
                options: [
                  { label: categoriesLoading ? "Loading event categories..." : "Select event type", value: "",},
                  ...categories.map((category) => ({ label: category.name, value: category._id,
                  })),
                ],
              })}

              {renderField({ label: "Event Date", name: "eventDate", type: "date", required: true, })}

              {renderField({ label: "Event Time", name: "eventTime", type: "text", placeholder: "e.g. 10:00 AM - 02:00 PM",required: true,})}

              {renderField({ label: "Expected Guests", name: "expectedGuests", type: "number", placeholder: "Enter guest count",required: true, min: 1, })}

              {renderField({ label: "Location / Venue", name: "venueName", placeholder: "Enter venue name or city", fullWidth: true, })}

              {renderField({ label: "Full Address", name: "fullAddress", type: "textarea", placeholder: "Enter complete event address", required: true, fullWidth: true, })}

              {/* STATUS IS MANAGED THROUGH THE PATCH API */}

              <div className="event-booking-dialog__field event-booking-dialog__field--full">
                <label>Booking Status</label>

                <select value={currentStatus} disabled>
                  {BOOKING_STATUSES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                {!isView && (
                  <small>
                    Booking status is managed separately.
                  </small>
                )}
              </div>
            </div>

            {/* ADDITIONAL DETAILS */}

            <div className="event-booking-dialog__section-heading">
              <ClipboardList size={17} />
              <h3>Additional Details</h3>
            </div>

            <div className="event-booking-dialog__grid">
              {renderField({
                label: "Special Requirements",
                name: "specialRequirements",
                type: "textarea",
                placeholder: "Enter requested services or requirements",
                fullWidth: true,
              })}

              {renderField({
                label: "Internal Notes",
                name: "internalNotes",
                type: "textarea",
                placeholder: "Add notes for the admin team",
                fullWidth: true,
              })}
            </div>

            {isView && bookingData?.createdAt && (
              <div className="event-booking-dialog__created-at">
                <span>Booking Created</span>

                <strong>
                  {new Date(
                    bookingData.createdAt
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            )}
          </form>
        )}

        {/* FOOTER */}

        <footer className="event-booking-dialog__footer">
          {isDelete ? (
            <>
              <button
                type="button"
                className="event-booking-dialog__button event-booking-dialog__button--secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="event-booking-dialog__button event-booking-dialog__button--danger"
                onClick={handleDelete}
                disabled={isSaving}
              >
                <Trash2 size={16} />
                {isSaving ? "Deleting..." : "Delete Booking"}
              </button>
            </>
          ) : isView ? (
            <button
              type="button"
              className="event-booking-dialog__button event-booking-dialog__button--primary"
              onClick={onClose}
            >
              Close
            </button>
          ) : (
            <>
              <button
                type="button"
                className="event-booking-dialog__button event-booking-dialog__button--secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </button>

              <button
                type="submit"
                form="event-booking-form"
                className="event-booking-dialog__button event-booking-dialog__button--primary"
                disabled={isSaving || categoriesLoading}
              >
                <Save size={16} />
                {isSaving ? "Saving...": isEdit ? "Save Changes" : "Add Booking"}
              </button>
            </>
          )}
        </footer>
      </section>
    </div>
  );
}