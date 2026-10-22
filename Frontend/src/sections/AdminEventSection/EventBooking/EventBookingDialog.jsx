
import React, { useEffect, useState } from "react";
import {
  X,
  CalendarDays,
  UserRound,
  MapPin,
  Phone,
  ClipboardList,
  Trash2,
  Save,
  Eye,
} from "lucide-react";

import "./EventBookingDialog.scss";

const INITIAL_FORM = {
  customerName: "",
  phoneNumber: "",
  email: "",
  eventType: "Marriage / Wedding",
  eventDate: "",
  eventTime: "",
  location: "",
  address: "",
  guests: "",
  status: "Pending",
  specialRequirements: "",
  notes: "",
};

const EVENT_TYPES = [
  "Marriage / Wedding",
  "Mundan",
  "Upanayanam",
  "Party",
  "Corporate",
  "Other",
];

const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function EventBookingDialog({
  isOpen,
  mode = "add",
  bookingData = null,
  onClose,
  onSave,
  onConfirmDelete,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const isView = mode === "view";
  const isDelete = mode === "delete";
  const isReadOnly = isView || isDelete;

  useEffect(() => {
    if (!isOpen) return;

    if (bookingData) {
      setFormData({
        ...INITIAL_FORM,
        ...bookingData,
        guests:
          bookingData.guests === null ||
          bookingData.guests === undefined
            ? ""
            : String(bookingData.guests),
      });
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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.customerName.trim()) {
      nextErrors.customerName = "Customer name is required.";
    }

    if (!formData.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Phone number is required.";
    } else if (!/^[+]?[\d\s()-]{7,20}$/.test(formData.phoneNumber.trim())) {
      nextErrors.phoneNumber = "Enter a valid phone number.";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.eventType) {
      nextErrors.eventType = "Select an event type.";
    }

    if (!formData.eventDate) {
      nextErrors.eventDate = "Event date is required.";
    }

    if (
      formData.guests !== "" &&
      (!Number.isInteger(Number(formData.guests)) ||
        Number(formData.guests) < 1)
    ) {
      nextErrors.guests = "Guest count must be at least 1.";
    }

    if (!formData.location.trim()) {
      nextErrors.location = "Event location is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isReadOnly) return;
    if (!validateForm()) return;

    onSave?.({
      ...formData,
      customerName: formData.customerName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      location: formData.location.trim(),
      address: formData.address.trim(),
      guests: formData.guests === "" ? "" : Number(formData.guests),
      specialRequirements: formData.specialRequirements.trim(),
      notes: formData.notes.trim(),
    });
  };

  const title = {
    add: "Add Event Booking",
    edit: "Edit Event Booking",
    view: "Event Booking Details",
    delete: "Delete Event Booking",
  }[mode] || "Event Booking";

  const handleDelete = () => {
    if (bookingData) onConfirmDelete?.(bookingData);
  };

  const renderField = ({
    label,
    name,
    type = "text",
    placeholder = "",
    required = false,
    options = null,
    fullWidth = false,
    min = undefined,
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
          <span className="event-booking-dialog__required"> *</span>
        )}
      </label>

      {options ? (
        <select
          id={`event-booking-${name}`}
          name={name}
          value={formData[name] ?? ""}
          onChange={updateField}
          disabled={isReadOnly}
          required={required && !isReadOnly}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
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
          disabled={isReadOnly}
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
          disabled={isReadOnly}
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
    <div
      className="event-booking-dialog__overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        className="event-booking-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-booking-dialog-title"
      >
        <header className="event-booking-dialog__header">
          <div className="event-booking-dialog__header-icon">
            {isView ? (
              <Eye size={21} />
            ) : isDelete ? (
              <Trash2 size={21} />
            ) : (
              <CalendarDays size={21} />
            )}
          </div>

          <div className="event-booking-dialog__heading">
            <h2 id="event-booking-dialog-title">{title}</h2>
            <p>
              {isView
                ? "Review the complete booking information."
                : isDelete
                  ? "Confirm removal of this booking."
                  : mode === "edit"
                    ? "Update the event booking details."
                    : "Enter the customer and event information."}
            </p>
          </div>

          <button
            type="button"
            className="event-booking-dialog__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </header>

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
              {bookingData?.bookingId
                ? ` (${bookingData.bookingId})`
                : ""}
              . This action cannot be undone.
            </p>
          </div>
        ) : (
          <form
            id="event-booking-form"
            className="event-booking-dialog__form"
            onSubmit={handleSubmit}
          >
            <div className="event-booking-dialog__section-heading">
              <UserRound size={17} />
              <h3>Customer Information</h3>
            </div>

            <div className="event-booking-dialog__grid">
              {renderField({
                label: "Customer Name",
                name: "customerName",
                placeholder: "Enter customer name",
                required: true,
              })}

              {renderField({
                label: "Phone Number",
                name: "phoneNumber",
                type: "tel",
                placeholder: "Enter phone number",
                required: true,
              })}

              {renderField({
                label: "Email Address",
                name: "email",
                type: "email",
                placeholder: "customer@example.com",
                fullWidth: true,
              })}
            </div>

            <div className="event-booking-dialog__section-heading">
              <CalendarDays size={17} />
              <h3>Event Information</h3>
            </div>

            <div className="event-booking-dialog__grid">
              {renderField({
                label: "Event Type",
                name: "eventType",
                options: EVENT_TYPES,
                required: true,
              })}

              {renderField({
                label: "Event Date",
                name: "eventDate",
                type: "date",
                required: true,
              })}

              {renderField({
                label: "Event Time",
                name: "eventTime",
                type: "text",
                placeholder: "e.g. 10:00 AM - 02:00 PM",
              })}

              {renderField({
                label: "Expected Guests",
                name: "guests",
                type: "number",
                placeholder: "Enter guest count",
                min: 1,
              })}

              {renderField({
                label: "Location / Venue",
                name: "location",
                placeholder: "Enter venue name or city",
                required: true,
                fullWidth: true,
              })}

              {renderField({
                label: "Full Address",
                name: "address",
                type: "textarea",
                placeholder: "Enter complete event address",
                fullWidth: true,
              })}

              {renderField({
                label: "Booking Status",
                name: "status",
                options: BOOKING_STATUSES,
                fullWidth: true,
              })}
            </div>

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
                name: "notes",
                type: "textarea",
                placeholder: "Add notes for the admin team",
                fullWidth: true,
              })}
            </div>

            {isView && bookingData?.createdAt && (
              <div className="event-booking-dialog__created-at">
                <span>Booking Created</span>
                <strong>
                  {new Date(bookingData.createdAt).toLocaleString("en-IN")}
                </strong>
              </div>
            )}
          </form>
        )}

        <footer className="event-booking-dialog__footer">
          {isDelete ? (
            <>
              <button
                type="button"
                className="event-booking-dialog__button event-booking-dialog__button--secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="button"
                className="event-booking-dialog__button event-booking-dialog__button--danger"
                onClick={handleDelete}
              >
                <Trash2 size={16} />
                Delete Booking
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
              >
                Cancel
              </button>

              <button
                type="submit"
                form="event-booking-form"
                className="event-booking-dialog__button event-booking-dialog__button--primary"
              >
                <Save size={16} />
                {mode === "edit" ? "Save Changes" : "Add Booking"}
              </button>
            </>
          )}
        </footer>
      </section>
    </div>
  );
}
