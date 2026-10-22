import React, { useEffect, useState } from "react";
import {  X,  LoaderCircle,  AlertTriangle,} from "lucide-react";

import "./SocialMediaDialog.scss";
const EMPTY_FORM = {  platform: "",handle: "",  followers: "0",  following: "0",posts: "0",  status: "ACTIVE",};
const PLATFORM_OPTIONS = [  "Instagram","Facebook",  "YouTube",  "TikTok","LinkedIn",  "X",  "Other",];

export default function SocialMediaDialog({  isOpen,mode = "add",  socialMediaData = null,  onClose,  onSave,  onConfirmDelete,
  saving = false,
  deleting = false,}) {
  const [formData, setFormData] = useState({    ...EMPTY_FORM,  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const isDelete = mode === "delete";
  const isEdit = mode === "edit";
  const isBusy = saving || deleting;

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && socialMediaData) {
      setFormData({
        platform: socialMediaData.platform ?? "",
        handle: socialMediaData.handle ?? "",
        followers: String(socialMediaData.followers ?? 0),
        following: String(socialMediaData.following ?? 0),
        posts: String(socialMediaData.posts ?? 0),
        status: (
          socialMediaData.status || "ACTIVE"
        ).toUpperCase(),
      });
    } else {
      setFormData({ ...EMPTY_FORM });
    }

    setErrors({});
    setSubmitError("");
  }, [isOpen, mode, isEdit, socialMediaData]);

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

    setErrors((previous) => ({      ...previous,      [name]: "",    }));

    setSubmitError("");
  };

  const validateForm = () => {
    const nextErrors = {};
    const platform = formData.platform.trim();
    const handle = formData.handle.trim();

    if (!platform) {
      nextErrors.platform = "Please select a platform.";
    } else if (platform.length > 100) {
      nextErrors.platform =
        "Platform name cannot exceed 100 characters.";
    }

    if (!handle) {
      nextErrors.handle = "Please enter the handle.";
    } else if (handle.length > 150) {
      nextErrors.handle =  "Handle cannot exceed 150 characters.";
    }

    ["followers", "following", "posts"].forEach((field) => {
      const value = formData[field];

      if (value === "" || value === null || value === undefined) {
        nextErrors[field] = "This field is required.";
      } else if (
        !Number.isFinite(Number(value)) ||
        Number(value) < 0 ||
        !Number.isInteger(Number(value))
      ) {
        nextErrors[field] =
          "Enter a valid non-negative whole number.";
      }
    });

    if (!["ACTIVE", "INACTIVE"].includes(formData.status)) {
      nextErrors.status = "Please select a valid status.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isBusy || !validateForm()) return;

    setSubmitError("");

    const payload = {
      platform: formData.platform.trim(),
      handle: formData.handle.trim(),
      followers: Number(formData.followers),
      following: Number(formData.following),
      posts: Number(formData.posts),
      status: formData.status,
    };

    try {
      await onSave?.(payload);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save social media account."
      );
    }
  };

  const handleDelete = async () => {
    if (isBusy) return;

    if (!socialMediaData?._id) {
      setSubmitError("Social media account ID is missing.");
      return;
    }

    setSubmitError("");

    try {
      await onConfirmDelete?.(socialMediaData);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete social media account."
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

  const title = isDelete    ? "Delete Social Media Account"  : isEdit   ? "Edit Social Media Account"      : "Add Social Media Account";

  return (
    <div className="social-media-dialog__overlay" onMouseDown={handleBackdropClick}>
      <section className={`social-media-dialog ${isDelete ? "social-media-dialog--delete" : ""}`}
        role={isDelete ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby="social-media-dialog-title"
      >
        <header className="social-media-dialog__header">
          <div>
            <h2 id="social-media-dialog-title">{title}</h2>

            <p>
              {isDelete ? "Review this account before confirming deletion." : "Manage the account details and audience metrics."}
            </p>
          </div>

          <button
            type="button"
            className="social-media-dialog__close"
            onClick={onClose}
            disabled={isBusy}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </header>

        {isDelete ? (
          <div className="social-media-dialog__delete-content">
            <div className="social-media-dialog__delete-icon">
              <AlertTriangle size={24} />
            </div>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {socialMediaData?.platform || "this account"}
                {socialMediaData?.handle? ` (${socialMediaData.handle})`: ""}
              </strong>
              ? This action cannot be undone.
            </p>

            {submitError && (
              <p className="social-media-dialog__error" role="alert">
                {submitError}
              </p>
            )}

            <div className="social-media-dialog__footer">
              <button type="button"
                className="social-media-dialog__button social-media-dialog__button--secondary"
                onClick={onClose}
                disabled={isBusy}>
                Cancel
              </button>

              <button type="button"
                className="social-media-dialog__button social-media-dialog__button--danger"
                onClick={handleDelete}
                disabled={isBusy}
              >
                {deleting && (
                  <LoaderCircle
                    size={16}
                    className="social-media-dialog__spinner"
                  />
                )}
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        ) : (
          <form className="social-media-dialog__form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="social-media-dialog__field">
              <label htmlFor="social-platform">
                Platform Name <span>*</span>
              </label>

              <select id="social-platform" name="platform"
                value={formData.platform}
                onChange={handleChange}
                className={errors.platform ? "has-error" : ""}
                disabled={isBusy}
              >
                <option value="">Select platform</option>

                {PLATFORM_OPTIONS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>

              {errors.platform && (
                <small className="social-media-dialog__error" role="alert">
                  {errors.platform}
                </small>
              )}
            </div>

            <div className="social-media-dialog__field">
              <label htmlFor="social-handle">
                Handle / Username <span>*</span>
              </label>

              <input
                id="social-handle"
                name="handle"
                type="text"
                placeholder="@trimtokyo"
                value={formData.handle}
                onChange={handleChange}
                maxLength={150}
                className={errors.handle ? "has-error" : ""}
                disabled={isBusy}
              />

              {errors.handle && (
                <small className="social-media-dialog__error"role="alert">
                  {errors.handle}
                </small>
              )}
            </div>

            <div className="social-media-dialog__metrics">
              {[
                {
                  name: "followers",
                  label: "Followers",
                  id: "social-followers",
                },
                {
                  name: "following",
                  label: "Following",
                  id: "social-following",
                },
                {
                  name: "posts",
                  label: "Posts",
                  id: "social-posts",
                },
              ].map((field) => (
                <div
                  className="social-media-dialog__field"
                  key={field.name}
                >
                  <label htmlFor={field.id}>
                    {field.label} <span>*</span>
                  </label>

                  <input
                    id={field.id}
                    name={field.name}
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder="0"
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={
                      errors[field.name] ? "has-error" : ""
                    }
                    disabled={isBusy}
                  />

                  {errors[field.name] && (
                    <small
                      className="social-media-dialog__error"
                      role="alert"
                    >
                      {errors[field.name]}
                    </small>
                  )}
                </div>
              ))}
            </div>

            <div className="social-media-dialog__field">
              <label htmlFor="social-status">
                Status <span>*</span>
              </label>

              <select
                id="social-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={errors.status ? "has-error" : ""}
                disabled={isBusy}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              {errors.status && (
                <small
                  className="social-media-dialog__error"
                  role="alert"
                >
                  {errors.status}
                </small>
              )}
            </div>

            {submitError && (
              <p
                className="social-media-dialog__error"
                role="alert"
              >
                {submitError}
              </p>
            )}

            <div className="social-media-dialog__footer">
              <button type="button" className="social-media-dialog__button social-media-dialog__button--secondary"
                onClick={onClose}
                disabled={isBusy}>
                Cancel
              </button>

              <button
                type="submit"
                className="social-media-dialog__button social-media-dialog__button--primary"
                disabled={isBusy}
              >
                {saving && (
                  <LoaderCircle
                    size={16}
                    className="social-media-dialog__spinner"
                  />
                )}
                {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Account"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
