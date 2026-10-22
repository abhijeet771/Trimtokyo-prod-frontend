
import React, { useEffect, useState } from "react";
import {  X,  AlertTriangle,  LoaderCircle,} from "lucide-react";

import "./EventDialog.scss";

const EMPTY_FORM = {  name: "",  description: "",  status: "ACTIVE",};

export default function EventDialog({
  mode = "add",
  eventData = null,
  isOpen = false,
  onClose,
  onSave,
  onConfirmDelete,
  saving = false,
  deleting = false,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const isEdit = mode === "edit";
  const isDelete = mode === "delete";
  const isBusy = saving || deleting;

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && eventData) {
      setFormData({
        name: eventData.name || "",
        description: eventData.description || "",
        status: (
          eventData.status || "ACTIVE"
        ).toUpperCase(),
      });
    } else {
      setFormData({ ...EMPTY_FORM });
    }

    setFormError("");
  }, [isOpen, isEdit, eventData, mode]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isBusy) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isBusy, onClose]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isBusy) return;

    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name) {
      setFormError("Event name is required.");
      return;
    }

    if (name.length > 150) {
      setFormError(
        "Event name cannot exceed 150 characters."
      );
      return;
    }

    if (!description) {
      setFormError("Event description is required.");
      return;
    }

    if (description.length > 1000) {
      setFormError(
        "Description cannot exceed 1000 characters."
      );
      return;
    }

    if (!["ACTIVE", "INACTIVE"].includes(formData.status)) {
      setFormError("Please select a valid event status.");
      return;
    }

    try {
      await onSave?.({
        name,
        description,
        status: formData.status,
      });
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save event category."
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (isBusy || !eventData?._id) {
      if (!eventData?._id) {
        setFormError("Event category ID is missing.");
      }
      return;
    }

    try {
      await onConfirmDelete?.(eventData);
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete event category."
      );
    }
  };

  const handleBackdropClick = (event) => {
    if (
      event.target === event.currentTarget &&
      !isBusy
    ) {
      onClose?.();
    }
  };

  if (isDelete) {
    return (
      <div
        className="event-dialog__overlay event-dialog__overlay--delete"
        onMouseDown={handleBackdropClick}
      >
        <section
          className="event-dialog event-dialog--delete"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="event-delete-title"
          aria-describedby="event-delete-description"
        >
          <button
            type="button"
            className="event-dialog__close"
            onClick={onClose}
            disabled={isBusy}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          <div className="event-dialog__delete-icon">
            <AlertTriangle size={25} />
          </div>

          <h3 id="event-delete-title">
            Delete Event Category
          </h3>

          <p id="event-delete-description">
            Are you sure you want to delete{" "}
            <strong>
              {eventData?.name || "this event category"}
            </strong>
            ? This action cannot be undone.
          </p>

          {formError && (
            <p className="event-dialog__error" role="alert">
              {formError}
            </p>
          )}

          <div className="event-dialog__footer">
            <button
              type="button"
              className="event-dialog__button event-dialog__button--secondary"
              onClick={onClose}
              disabled={isBusy}
            >
              Cancel
            </button>

            <button
              type="button"
              className="event-dialog__button event-dialog__button--delete"
              onClick={handleConfirmDelete}
              disabled={isBusy}
            >
              {deleting && (
                <LoaderCircle
                  size={16}
                  className="event-dialog__spinner"
                />
              )}
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div
      className="event-dialog__overlay"
      onMouseDown={handleBackdropClick}
    >
      <section
        className="event-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-form-title"
      >
        <div className="event-dialog__header">
          <div>
            <h3 id="event-form-title">
              {isEdit
                ? "Edit Event Category"
                : "Add Event Category"}
            </h3>

            <p>
              {isEdit
                ? "Update the event category details."
                : "Create a category for event bookings."}
            </p>
          </div>

          <button
            type="button"
            className="event-dialog__close"
            onClick={onClose}
            disabled={isBusy}
            aria-label="Close dialog"
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="event-dialog__body">
            <div className="event-dialog__field">
              <label htmlFor="event-dialog-name">
                Event Name <span>*</span>
              </label>

              <input
                id="event-dialog-name"
                name="name"
                type="text"
                placeholder="e.g. Marriage"
                value={formData.name}
                onChange={handleChange}
                maxLength={150}
                autoFocus
                required
                disabled={isBusy}
              />
            </div>

            <div className="event-dialog__field">
              <label htmlFor="event-dialog-description">
                Description <span>*</span>
              </label>

              <textarea
                id="event-dialog-description"
                name="description"
                placeholder="Enter a description of the event..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                required
                disabled={isBusy}
              />
            </div>

            <div className="event-dialog__field">
              <label htmlFor="event-dialog-status">
                Status <span>*</span>
              </label>

              <select
                id="event-dialog-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={isBusy}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {formError && (
              <p className="event-dialog__error" role="alert">
                {formError}
              </p>
            )}
          </div>

          <div className="event-dialog__footer">
            <button
              type="button"
              className="event-dialog__button event-dialog__button--secondary"
              onClick={onClose}
              disabled={isBusy}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="event-dialog__button event-dialog__button--primary"
              disabled={isBusy}
            >
              {saving && (
                <LoaderCircle
                  size={16}
                  className="event-dialog__spinner"
                />
              )}
              {saving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Save Event"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
