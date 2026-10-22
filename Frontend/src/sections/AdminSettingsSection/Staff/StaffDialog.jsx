
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./StaffDialog.scss";

const DESIGNATIONS = [
  "Developer",
  "Sales",
  "Marketing",
  "Support",
];

const initialFormData = {
  name: "",
  designation: "",
  joinDate: "",
  salary: "",
  phoneNumber: "",
};

export default function StaffDialog({
  isOpen,
  mode = "add",
  staffData = null,
  onClose,
  onSave,
  onConfirmDelete,
  saving = false,
  deleting = false,
}) {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [errors, setErrors] = useState({});

  const isDelete = mode === "delete";
  const isEdit = mode === "edit";
  const isBusy = saving || deleting;

  useEffect(() => {
    if (!isOpen) return;

    if ((mode === "edit" || mode === "delete") && staffData) {
      setFormData({
        name: staffData.name ?? "",
        designation: staffData.designation ?? "",
        joinDate: staffData.joinDate
          ? new Date(staffData.joinDate).toISOString().slice(0, 10)
          : "",
        salary: staffData.salary ?? "",
        phoneNumber: staffData.phoneNumber ?? "",
      });
    } else {
      setFormData({ ...initialFormData });
    }

    setErrors({});
  }, [isOpen, mode, staffData]);

  if (!isOpen) return null;

  const handleChange = (event) => {
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

    const name = formData.name.trim();

    if (!name) {
      nextErrors.name = "Please enter the staff member's name.";
    } else if (name.length < 2) {
      nextErrors.name = "Name must contain at least 2 characters.";
    } else if (name.length > 100) {
      nextErrors.name = "Name cannot exceed 100 characters.";
    }

    if (!formData.designation.trim()) {
      nextErrors.designation = "Please select a designation.";
    }

    if (!formData.joinDate) {
      nextErrors.joinDate = "Please select a join date.";
    } else if (
      Number.isNaN(new Date(formData.joinDate).getTime())
    ) {
      nextErrors.joinDate = "Enter a valid joining date.";
    }

    if (
      formData.salary === "" ||
      !Number.isFinite(Number(formData.salary)) ||
      Number(formData.salary) < 0
    ) {
      nextErrors.salary = "Enter a valid, non-negative salary.";
    }

    const phone = formData.phoneNumber.trim();

    if (!phone) {
      nextErrors.phoneNumber = "Please enter a phone number.";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      nextErrors.phoneNumber =
        "Enter a valid 10-digit Indian mobile number.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isBusy || !validateForm()) return;

    try {
      await onSave?.({
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        joinDate: formData.joinDate,
        salary: Number(formData.salary),
        phoneNumber: formData.phoneNumber.trim(),
      });
    } catch {
      // The parent component handles API errors.
    }
  };

  const handleDelete = async () => {
    if (isBusy) return;

    try {
      await onConfirmDelete?.(staffData);
    } catch {
      // The parent component handles API errors.
    }
  };

  const title = isDelete
    ? "Delete Staff Member"
    : isEdit
      ? "Edit Staff Member"
      : "Add Staff Member";

  const handleClose = () => {
    if (isBusy) return;
    onClose?.();
  };

  return (
    <div
      className="staff-dialog__overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isBusy
        ) {
          handleClose();
        }
      }}
    >
      <section
        className="staff-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-dialog-title"
      >
        <header className="staff-dialog__header">
          <div>
            <h2 id="staff-dialog-title">{title}</h2>
            <p>
              {isDelete
                ? "This action cannot be undone."
                : "Enter the staff member's employment details."}
            </p>
          </div>

          <button
            type="button"
            className="staff-dialog__close"
            onClick={handleClose}
            disabled={isBusy}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </header>

        {isDelete ? (
          <div className="staff-dialog__delete-content">
            <div className="staff-dialog__delete-icon">
              <X size={24} />
            </div>

            <p>
              Are you sure you want to delete{" "}
              {staffData?.name || "this staff member"}
              {staffData?.designation
                ? ` (${staffData.designation})`
                : ""}
              ?
            </p>

            <div className="staff-dialog__footer">
              <button
                type="button"
                className="staff-dialog__button staff-dialog__button--secondary"
                onClick={handleClose}
                disabled={isBusy}
              >
                Cancel
              </button>

              <button
                type="button"
                className="staff-dialog__button staff-dialog__button--danger"
                onClick={handleDelete}
                disabled={isBusy}
              >
                {deleting ? "Deleting..." : "Delete Staff"}
              </button>
            </div>
          </div>
        ) : (
          <form
            className="staff-dialog__form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Staff name */}
            <div className="staff-dialog__field">
              <label htmlFor="staff-name">
                Full Name <span>*</span>
              </label>

              <input
                id="staff-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                placeholder="Enter staff member's name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "has-error" : ""}
                disabled={isBusy}
              />

              {errors.name && (
                <small className="staff-dialog__error">
                  {errors.name}
                </small>
              )}
            </div>

            {/* Designation */}
            <div className="staff-dialog__field">
              <label htmlFor="staff-designation">
                Designation <span>*</span>
              </label>

              <select
                id="staff-designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={errors.designation ? "has-error" : ""}
                disabled={isBusy}
              >
                <option value="">Select designation</option>

                {DESIGNATIONS.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>

              {errors.designation && (
                <small className="staff-dialog__error">
                  {errors.designation}
                </small>
              )}
            </div>

            {/* Joining date */}
            <div className="staff-dialog__field">
              <label htmlFor="staff-join-date">
                Join Date <span>*</span>
              </label>

              <input
                id="staff-join-date"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
                className={errors.joinDate ? "has-error" : ""}
                disabled={isBusy}
              />

              {errors.joinDate && (
                <small className="staff-dialog__error">
                  {errors.joinDate}
                </small>
              )}
            </div>

            {/* Salary */}
            <div className="staff-dialog__field">
              <label htmlFor="staff-salary">
                Salary <span>*</span>
              </label>

              <div className="staff-dialog__salary-input">
                <span>₹</span>

                <input
                  id="staff-salary"
                  name="salary"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className={errors.salary ? "has-error" : ""}
                  disabled={isBusy}
                />
              </div>

              {errors.salary && (
                <small className="staff-dialog__error">
                  {errors.salary}
                </small>
              )}
            </div>

            {/* Phone number */}
            <div className="staff-dialog__field">
              <label htmlFor="staff-phone">
                Phone Number <span>*</span>
              </label>

              <input
                id="staff-phone"
                name="phoneNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? "has-error" : ""}
                disabled={isBusy}
              />

              {errors.phoneNumber && (
                <small className="staff-dialog__error">
                  {errors.phoneNumber}
                </small>
              )}
            </div>

            <div className="staff-dialog__footer">
              <button
                type="button"
                className="staff-dialog__button staff-dialog__button--secondary"
                onClick={handleClose}
                disabled={isBusy}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="staff-dialog__button staff-dialog__button--primary"
                disabled={isBusy}
              >
                {saving
                  ? "Saving..."
                  : isEdit
                    ? "Save Changes"
                    : "Add Staff"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
