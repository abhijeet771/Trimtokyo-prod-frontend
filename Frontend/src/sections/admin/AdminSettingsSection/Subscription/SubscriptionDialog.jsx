
import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import "./SubscriptionDialog.scss";

const initialForm = {
  name: "",
  description: "",
  durationMonths: 1,
  price: "",
  originalPrice: "",
  currency: "INR",
  benefits: [],
  theme: "blue",
  isPopular: false,
  displayOrder: 0,
  isActive: true,
};

export default function SubscriptionDialog({
  isOpen,
  mode = "add",
  subscriptionData,
  onClose,
  onSave,
  onConfirmDelete,
  saving = false,
  deleting = false,
}) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const busy = saving || deleting;
  const deleteMode = mode === "delete";

  useEffect(() => {
    if (!isOpen) return;

    setError("");

    if (!subscriptionData || mode === "add") {
      setForm({ ...initialForm, benefits: [] });
      return;
    }

    setForm({
      ...initialForm,
      ...subscriptionData,
      benefits: (subscriptionData.benefits || []).map((benefit, index) => ({
        label: benefit.label || "",
        type: benefit.type || "feature",
        isIncluded: benefit.isIncluded ?? true,
        displayOrder: benefit.displayOrder ?? index,
      })),
    });
  }, [isOpen, mode, subscriptionData]);

  if (!isOpen) return null;

  const change = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError("");
  };

  const updateBenefit = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      benefits: previous.benefits.map((benefit, i) =>
        i === index ? { ...benefit, [field]: value } : benefit
      ),
    }));
  };

  const addBenefit = () => {
    setForm((previous) => ({
      ...previous,
      benefits: [
        ...previous.benefits,
        {
          label: "",
          type: "feature",
          isIncluded: true,
          displayOrder: previous.benefits.length,
        },
      ],
    }));
  };

  const removeBenefit = (index) => {
    setForm((previous) => ({
      ...previous,
      benefits: previous.benefits
        .filter((_, i) => i !== index)
        .map((benefit, i) => ({ ...benefit, displayOrder: i })),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;

    const price = Number(form.price);
    const originalPrice = Number(form.originalPrice);
    const duration = Number(form.durationMonths);
    const order = Number(form.displayOrder);

    if (!form.name.trim()) return setError("Plan name is required.");
    if (!form.description.trim()) return setError("Description is required.");
    if (!Number.isInteger(duration) || duration < 1) {
      return setError("Duration must be at least 1 whole month.");
    }
    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      return setError("Enter a valid selling price.");
    }
    if (
      form.originalPrice === "" ||
      !Number.isFinite(originalPrice) ||
      originalPrice < price
    ) {
      return setError("Original price must be at least the selling price.");
    }
    if (form.displayOrder === "" || !Number.isInteger(order) || order < 0) {
      return setError("Display order must be 0 or greater.");
    }
    if (form.benefits.some((benefit) => !benefit.label.trim())) {
      return setError("Complete or remove each empty benefit.");
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      durationMonths: duration,
      price,
      originalPrice,
      displayOrder: order,
      currency: form.currency.trim().toUpperCase() || "INR",
      benefits: form.benefits.map((benefit, index) => ({
        ...benefit,
        label: benefit.label.trim(),
        displayOrder: index,
      })),
    };

    try {
      setError("");
      await onSave(payload);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Unable to save plan."
      );
    }
  };

  const handleDelete = async () => {
    if (busy || !subscriptionData) return;

    try {
      setError("");
      await onConfirmDelete(subscriptionData);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete plan."
      );
    }
  };

  return (
    <div
      className="subscription-dialog-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div
        className="subscription-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-dialog-title"
      >
        <div className="subscription-dialog__header">
          <div>
            <h2 id="subscription-dialog-title">
              {deleteMode
                ? "Delete Subscription"
                : mode === "edit"
                  ? "Edit Subscription"
                  : "Add Subscription"}
            </h2>
            <p>
              {deleteMode
                ? "This will permanently delete this plan."
                : "Enter the subscription plan details below."}
            </p>
          </div>

          <button
            type="button"
            className="subscription-dialog__close"
            onClick={onClose}
            disabled={busy}
            aria-label="Close dialog"
          >
            <X size={19} />
          </button>
        </div>

        {error && <p className="subscription-dialog__error">{error}</p>}

        {deleteMode ? (
          <div className="subscription-dialog__delete">
            <p>
              Are you sure you want to delete{" "}
              <strong>{subscriptionData?.name}</strong>?
            </p>
            <div className="subscription-dialog__footer">
              <button
                type="button"
                className="subscription-dialog__button subscription-dialog__button--secondary"
                onClick={onClose}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                type="button"
                className="subscription-dialog__button subscription-dialog__button--danger"
                onClick={handleDelete}
                disabled={busy}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="subscription-dialog__body">
              <div className="subscription-dialog__grid">
                <label>
                  Plan Name *
                  <input
                    value={form.name}
                    onChange={(e) => change("name", e.target.value)}
                    maxLength={100}
                    required
                  />
                </label>

                <label>
                  Duration (months) *
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.durationMonths}
                    onChange={(e) => change("durationMonths", e.target.value)}
                    required
                  />
                </label>

                <label className="subscription-dialog__full">
                  Description *
                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={(e) => change("description", e.target.value)}
                    required
                  />
                </label>

                <label>
                  Currency
                  <select
                    value={form.currency}
                    onChange={(e) => change("currency", e.target.value)}
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </label>

                <label>
                  Selling Price *
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => change("price", e.target.value)}
                    required
                  />
                </label>

                <label>
                  Original Price *
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) => change("originalPrice", e.target.value)}
                    required
                  />
                </label>

                <label>
                  Display Order
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.displayOrder}
                    onChange={(e) => change("displayOrder", e.target.value)}
                  />
                </label>

                <label>
                  Theme
                  <select
                    value={form.theme}
                    onChange={(e) => change("theme", e.target.value)}
                  >
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                  </select>
                </label>
              </div>

              <div className="subscription-dialog__benefits-heading">
                <h3>Benefits</h3>
                <button type="button" onClick={addBenefit}>
                  <Plus size={15} /> Add Benefit
                </button>
              </div>

              {form.benefits.map((benefit, index) => (
                <div className="subscription-dialog__benefit" key={index}>
                  <input
                    aria-label="Benefit label"
                    placeholder="Benefit description"
                    value={benefit.label}
                    onChange={(e) =>
                      updateBenefit(index, "label", e.target.value)
                    }
                  />

                  <select
                    aria-label="Benefit type"
                    value={benefit.type}
                    onChange={(e) =>
                      updateBenefit(index, "type", e.target.value)
                    }
                  >
                    <option value="feature">Feature</option>
                    <option value="service">Service</option>
                    <option value="discount">Discount</option>
                    <option value="other">Other</option>
                  </select>

                  <label className="subscription-dialog__included">
                    <input
                      type="checkbox"
                      checked={Boolean(benefit.isIncluded)}
                      onChange={(e) =>
                        updateBenefit(index, "isIncluded", e.target.checked)
                      }
                    />
                    Included
                  </label>

                  <button
                    type="button"
                    className="subscription-dialog__remove"
                    onClick={() => removeBenefit(index)}
                    aria-label="Remove benefit"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <div className="subscription-dialog__options">
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(form.isPopular)}
                    onChange={(e) => change("isPopular", e.target.checked)}
                  />
                  Mark as popular
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(form.isActive)}
                    onChange={(e) => change("isActive", e.target.checked)}
                  />
                  Active plan
                </label>
              </div>
            </div>

            <div className="subscription-dialog__footer">
              <button
                type="button"
                className="subscription-dialog__button subscription-dialog__button--secondary"
                onClick={onClose}
                disabled={busy}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="subscription-dialog__button subscription-dialog__button--primary"
                disabled={busy}
              >
                {saving
                  ? "Saving..."
                  : mode === "edit"
                    ? "Save Changes"
                    : "Create Plan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
