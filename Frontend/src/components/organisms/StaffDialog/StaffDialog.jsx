
import { useEffect, useState } from "react";
import { X, UserRound, LoaderCircle } from "lucide-react";

import useBarberStaff from "../../../hooks/barber/useBarberStaff";
import "./StaffDialog.scss";

const INITIAL_FORM = {
  fullName: "",
  phone: "",
  email: "",
  profileImage: "",
  role: "RECEPTIONIST",
  employmentType: "FULL_TIME",
  joiningDate: new Date().toISOString().split("T")[0],
  status: "ACTIVE",
  address: "",
  userId: "",
};

const ROLE_OPTIONS = [
  { value: "RECEPTIONIST", label: "Receptionist" },
  { value: "MANAGER", label: "Manager" },
  { value: "ASSISTANT", label: "Assistant" },
  { value: "BARBER", label: "Barber" },
  { value: "CLEANER", label: "Cleaner" },
  { value: "OTHER", label: "Other" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

export default function StaffDialog({
  isOpen,
  onClose,
  staff = null,
  onSuccess,
}) {
  const {
    createBarberStaff,
    updateBarberStaff,
    creating,
    updating,
    error,
    clearError,
  } = useBarberStaff();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState("");

  const isEditing = Boolean(staff);
  const isSaving = creating || updating;

  useEffect(() => {
    if (!isOpen) return;

    setFormData(
      staff
        ? {
            fullName: staff.fullName || "",
            phone: staff.phone || "",
            email: staff.email || "",
            profileImage: staff.profileImage || "",
            role: staff.role || "RECEPTIONIST",
            employmentType: staff.employmentType || "FULL_TIME",
            joiningDate: staff.joiningDate
              ? new Date(staff.joiningDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            status: staff.status || "ACTIVE",
            address: staff.address || "",
            userId:
              typeof staff.userId === "object"
                ? staff.userId?._id || ""
                : staff.userId || "",
          }
        : {
            ...INITIAL_FORM,
            joiningDate: new Date().toISOString().split("T")[0],
          }
    );

    setValidationError("");
    clearError();
  }, [isOpen, staff, clearError]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSaving) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (validationError) setValidationError("");
    if (error) clearError();
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return "Please enter the staff member's full name.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      return "Enter a valid 10-digit Indian mobile number.";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      return "Enter a valid email address.";
    }

    if (!formData.role) {
      return "Please select a staff role.";
    }

    if (!formData.joiningDate) {
      return "Please select the joining date.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      profileImage: formData.profileImage.trim(),
      role: formData.role,
      employmentType: formData.employmentType,
      joiningDate: formData.joiningDate,
      status: formData.status,
      address: formData.address.trim(),
      userId: formData.userId.trim() || null,
    };

    const result = isEditing
      ? await updateBarberStaff(staff._id || staff.id, payload)
      : await createBarberStaff(payload);

    if (!result.success) return;

    onSuccess?.(result.data);
    onClose?.();
  };

  return (
    <div
      className="staff-dialog-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose?.();
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
          <div className="staff-dialog__heading">
            <div className="staff-dialog__icon">
              <UserRound size={22} />
            </div>

            <div>
              <h2 id="staff-dialog-title">
                {isEditing ? "Edit Staff Member" : "Add Staff Member"}
              </h2>
              <p>
                {isEditing
                  ? "Update the staff member's details."
                  : "Add a new member to your salon team."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="staff-dialog__close"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="staff-dialog__body">
            {(validationError || error) && (
              <div className="staff-dialog__error" role="alert">
                {validationError || error}
              </div>
            )}

            <div className="staff-dialog__section-title">
              Personal Information
            </div>

            <div className="staff-dialog__grid">
              <div className="staff-dialog__field">
                <label htmlFor="staff-fullName">
                  Full Name <span>*</span>
                </label>
                <input
                  id="staff-fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  maxLength={100}
                  required
                />
              </div>

              <div className="staff-dialog__field">
                <label htmlFor="staff-phone">
                  Phone Number <span>*</span>
                </label>
                <input
                  id="staff-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                />
              </div>

              <div className="staff-dialog__field">
                <label htmlFor="staff-email">Email Address</label>
                <input
                  id="staff-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="staff@example.com"
                />
              </div>

              <div className="staff-dialog__field">
                <label htmlFor="staff-profileImage">
                  Profile Image URL
                </label>
                <input
                  id="staff-profileImage"
                  name="profileImage"
                  type="url"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="staff-dialog__field staff-dialog__field--full">
                <label htmlFor="staff-address">Address</label>
                <textarea
                  id="staff-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter staff address"
                  rows={2}
                />
              </div>

              <div className="staff-dialog__field staff-dialog__field--full">
                <label htmlFor="staff-userId">
                  Auth User ID <span className="optional">(Optional)</span>
                </label>
                <input
                  id="staff-userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="Link an existing Auth user ID"
                />
                <small>
                  Leave blank if this staff member does not have a login.
                </small>
              </div>
            </div>

            <div className="staff-dialog__section-title">
              Employment Details
            </div>

            <div className="staff-dialog__grid">
              <div className="staff-dialog__field">
                <label htmlFor="staff-role">
                  Role <span>*</span>
                </label>
                <select
                  id="staff-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="staff-dialog__field">
                <label htmlFor="staff-employmentType">
                  Employment Type
                </label>
                <select
                  id="staff-employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                >
                  {EMPLOYMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="staff-dialog__field">
                <label htmlFor="staff-joiningDate">
                  Joining Date <span>*</span>
                </label>
                <input
                  id="staff-joiningDate"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="staff-dialog__field">
                <label htmlFor="staff-status">Status</label>
                <select
                  id="staff-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <footer className="staff-dialog__footer">
            <button
              type="button"
              className="staff-dialog__button staff-dialog__button--secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="staff-dialog__button staff-dialog__button--primary"
              disabled={isSaving}
            >
              {isSaving && (
                <LoaderCircle className="staff-dialog__spinner" size={17} />
              )}
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Staff"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
