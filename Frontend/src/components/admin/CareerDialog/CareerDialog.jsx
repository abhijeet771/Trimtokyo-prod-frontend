import React, { useEffect, useState } from "react";
import { MdClose, MdWork, MdSave } from "react-icons/md";
import "./CareerDialog.scss";

const INITIAL_FORM = { title: "", department: "",  employmentType: "Full-time",  workplaceType: "On-site",
  location: "",  salaryMin: "",  salaryMax: "",  description: "",  responsibilities: "",  requirements: "",  applicationDeadline: "",
  status: "Draft",
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const CareerDialog = ({ onClose, onSuccess, initialData = null,}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!initialData) {
      setForm(INITIAL_FORM);
      return;
    }

    setForm({ ...INITIAL_FORM, ...initialData,
      salaryMin: initialData.salaryMin == null ? "" : String(initialData.salaryMin),
      salaryMax: initialData.salaryMax == null ? "" : String(initialData.salaryMax),
      responsibilities: Array.isArray(initialData.responsibilities) ? initialData.responsibilities.join("\n") : initialData.responsibilities || "",
      requirements: Array.isArray(initialData.requirements) ? initialData.requirements.join("\n") : initialData.requirements || "",
      applicationDeadline: toDateInputValue( initialData.applicationDeadline ),
    });
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({  ...previous,  [name]: value,}));
    setErrors((previous) => ({ ...previous, [name]: "",}));
    setApiError("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Job title is required.";
    }

    if (!form.department.trim()) {
      nextErrors.department = "Department is required.";
    }

    if (!form.location.trim()) {
      nextErrors.location = "Location is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Job description is required.";
    } else if (form.description.trim().length < 10) {
      nextErrors.description =
        "Description must contain at least 10 characters.";
    }

    if (
      form.salaryMin !== "" &&
      (!Number.isFinite(Number(form.salaryMin)) ||
        Number(form.salaryMin) < 0)
    ) {
      nextErrors.salaryMin = "Enter a valid non-negative minimum salary.";
    }

    if (  form.salaryMax !== "" && (!Number.isFinite(Number(form.salaryMax)) || Number(form.salaryMax) < 0)
    ) {
      nextErrors.salaryMax = "Enter a valid non-negative maximum salary.";
    }

    if ( form.salaryMin !== "" && form.salaryMax !== "" && Number(form.salaryMin) > Number(form.salaryMax) ) {
      nextErrors.salaryMax =
        "Maximum salary must be greater than or equal to minimum salary.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting || !validateForm()) return;

    setSubmitting(true);
    setApiError("");

    const jobData = {
      title: form.title.trim(),
      department: form.department.trim(),
      status: form.status,
      employmentType: form.employmentType,
      workplaceType: form.workplaceType,
      location: form.location.trim(),
      salaryMin: form.salaryMin === "" ? null : Number(form.salaryMin),
      salaryMax: form.salaryMax === "" ? null : Number(form.salaryMax),
      description: form.description.trim(),
      responsibilities: form.responsibilities.split("\n").map((item) => item.trim()).filter(Boolean),
      requirements: form.requirements.split("\n").map((item) => item.trim()).filter(Boolean),
      applicationDeadline: form.applicationDeadline || null,
    };

    try {
      if (typeof onSuccess !== "function") {
        throw new Error("Career form submission handler is not configured.");
      }
      await onSuccess(jobData);
    } catch (error) {
      setApiError(
        error.response?.data?.message || error.message || "Unable to save this job. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget && !submitting) {
      onClose?.();
    }
  };

  return (
    <div className="career-dialog__overlay" onMouseDown={handleOverlayMouseDown}>
      <section
        className="career-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="career-dialog-title"
      >
        <header className="career-dialog__header">
          <div className="career-dialog__title-group">
            <div className="career-dialog__icon">
              <MdWork aria-hidden="true" />
            </div>

            <div>
              <h2 id="career-dialog-title">
                {initialData ? "Edit Job Opening" : "Add New Job"}
              </h2>
              <p>Add the details candidates need to apply.</p>
            </div>
          </div>

          <button
            type="button"
            className="career-dialog__close"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={submitting}
          >
            <MdClose />
          </button>
        </header>

        <form
          className="career-dialog__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="career-dialog__body">
            {apiError && (
              <div className="career-dialog__error" role="alert">
                {apiError}
              </div>
            )}

            <div className="career-dialog__section-heading">
              Job Information
            </div>

            <div className="career-dialog__grid">
              <div className="career-dialog__field career-dialog__field--full">
                <label htmlFor="career-title">
                  Job Title <span>*</span>
                </label>
                <input
                  id="career-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  aria-invalid={Boolean(errors.title)}
                  required
                />
                {errors.title && (
                  <small className="career-dialog__error">
                    {errors.title}
                  </small>
                )}
              </div>

              <div className="career-dialog__field">
                <label htmlFor="career-department">
                  Department <span>*</span>
                </label>
                <input
                  id="career-department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Technology"
                  aria-invalid={Boolean(errors.department)}
                  required
                />
                {errors.department && (
                  <small className="career-dialog__error">
                    {errors.department}
                  </small>
                )}
              </div>

              <div className="career-dialog__field">
                <label htmlFor="career-status">Posting Status</label>
                <select
                  id="career-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="career-dialog__field">
                <label htmlFor="career-employment">Employment Type</label>
                <select
                  id="career-employment"
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div className="career-dialog__field">
                <label htmlFor="career-workplace">Workplace Type</label>
                <select
                  id="career-workplace"
                  name="workplaceType"
                  value={form.workplaceType}
                  onChange={handleChange}
                >
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="career-dialog__field career-dialog__field--full">
                <label htmlFor="career-location">
                  Location <span>*</span>
                </label>
                <input
                  id="career-location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Ranchi, Jharkhand or Remote"
                  aria-invalid={Boolean(errors.location)}
                  required
                />
                {errors.location && (
                  <small className="career-dialog__error">
                    {errors.location}
                  </small>
                )}
              </div>
            </div>

            <div className="career-dialog__section-heading">
              Compensation
            </div>

            <div className="career-dialog__grid">
              <div className="career-dialog__field">
                <label htmlFor="career-salary-min">
                  Minimum Annual Salary (₹)
                </label>
                <input
                  id="career-salary-min"
                  type="number"
                  name="salaryMin"
                  min="0"
                  value={form.salaryMin}
                  onChange={handleChange}
                  placeholder="e.g. 300000"
                  aria-invalid={Boolean(errors.salaryMin)}
                />
                {errors.salaryMin && (
                  <small className="career-dialog__error">
                    {errors.salaryMin}
                  </small>
                )}
              </div>

              <div className="career-dialog__field">
                <label htmlFor="career-salary-max">
                  Maximum Annual Salary (₹)
                </label>
                <input
                  id="career-salary-max"
                  type="number"
                  name="salaryMax"
                  min="0"
                  value={form.salaryMax}
                  onChange={handleChange}
                  placeholder="e.g. 600000"
                  aria-invalid={Boolean(errors.salaryMax)}
                />
                {errors.salaryMax && (
                  <small className="career-dialog__error">
                    {errors.salaryMax}
                  </small>
                )}
              </div>
            </div>

            <div className="career-dialog__section-heading">
              Job Description
            </div>

            <div className="career-dialog__grid">
              <div className="career-dialog__field career-dialog__field--full">
                <label htmlFor="career-description">
                  Description <span>*</span>
                </label>
                <textarea
                  id="career-description"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the role and what the candidate will do..."
                  aria-invalid={Boolean(errors.description)}
                  required
                />
                {errors.description && (
                  <small className="career-dialog__error">
                    {errors.description}
                  </small>
                )}
              </div>

              <div className="career-dialog__field career-dialog__field--full">
                <label htmlFor="career-responsibilities">
                  Responsibilities
                </label>
                <textarea
                  id="career-responsibilities"
                  name="responsibilities"
                  rows={3}
                  value={form.responsibilities}
                  onChange={handleChange}
                  placeholder="Enter one responsibility per line"
                />
                <small className="career-dialog__hint">
                  Enter each responsibility on a separate line.
                </small>
              </div>

              <div className="career-dialog__field career-dialog__field--full">
                <label htmlFor="career-requirements">Requirements</label>
                <textarea
                  id="career-requirements"
                  name="requirements"
                  rows={3}
                  value={form.requirements}
                  onChange={handleChange}
                  placeholder="Enter one requirement per line"
                />
                <small className="career-dialog__hint">
                  Enter each qualification or skill on a separate line.
                </small>
              </div>

              <div className="career-dialog__field career-dialog__field--full">
                <label htmlFor="career-deadline">Application Deadline</label>
                <input
                  id="career-deadline"
                  type="date"
                  name="applicationDeadline"
                  value={form.applicationDeadline}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <footer className="career-dialog__footer">
            <button type="button" className="career-dialog__cancel" onClick={onClose} disabled={submitting}>
              Cancel
            </button>

            <button type="submit"  className="career-dialog__submit" disabled={submitting}>
              <MdSave aria-hidden="true" />
              {submitting  ? "Saving..."  : initialData  ? "Save Changes" : "Create Job"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default CareerDialog;
