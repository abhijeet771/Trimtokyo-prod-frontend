import { useEffect, useState } from "react";
import {
  X,
  Receipt,
  CalendarDays,
  Plus,
} from "lucide-react";

import "./GeneralDialog.scss";

const INITIAL_FORM = {
  expenseName: "",
  category: "",
  expenseDate: new Date().toISOString().split("T")[0],
  amount: "",
  status: "Paid",
  description: "",
};

const GENERAL_CATEGORIES = [
  "Cleaning Supplies",
  "Stationery",
  "Transportation",
  "Refreshments",
  "Packaging",
  "Miscellaneous",
];

const PAYMENT_STATUSES = [
  "Paid",
  "Pending",
  "Partial",
];

const GeneralDialog = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...INITIAL_FORM,
        ...(initialData || {}),
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const amount = Number(formData.amount);

    if (!formData.expenseName.trim()) return;
    if (!formData.category) return;
    if (!formData.expenseDate) return;
    if (!Number.isFinite(amount) || amount <= 0) return;
    if (!formData.status) return;

    const generalData = {
      expenseName: formData.expenseName.trim(),
      category: formData.category,
      expenseDate: formData.expenseDate,
      amount,
      status: formData.status,
      description: formData.description.trim(),
    };

    onSave?.(generalData);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="general-dialog__overlay"
      onMouseDown={handleOverlayClick}
    >
      <section
        className="general-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="general-dialog-title"
      >

        {/* HEADER */}
        <div className="general-dialog__header">

          <div className="general-dialog__heading">

            <div className="general-dialog__icon">
              <Receipt size={23} />
            </div>

            <div>
              <h2 id="general-dialog-title">
                {initialData
                  ? "Edit General Expense"
                  : "Add General Expense"}
              </h2>

              <p>
                Record your miscellaneous business expenses.
              </p>
            </div>

          </div>

          <button
            type="button"
            className="general-dialog__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={21} />
          </button>

        </div>

        {/* FORM */}
        <form
          className="general-dialog__form"
          onSubmit={handleSubmit}
        >

          <div className="general-dialog__body">

            {/* EXPENSE NAME + CATEGORY */}
            <div className="general-dialog__row">

              <div className="general-dialog__field">
                <label htmlFor="general-expense-name">
                  Expense Name <span>*</span>
                </label>

                <input
                  id="general-expense-name"
                  type="text"
                  name="expenseName"
                  placeholder="e.g. Cleaning Supplies"
                  value={formData.expenseName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="general-dialog__field">
                <label htmlFor="general-category">
                  Category <span>*</span>
                </label>

                <select
                  id="general-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>

                  {GENERAL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* DATE + AMOUNT */}
            <div className="general-dialog__row">

              <div className="general-dialog__field">
                <label htmlFor="general-expense-date">
                  Expense Date <span>*</span>
                </label>

                <div className="general-dialog__input-icon">
                  <input
                    id="general-expense-date"
                    type="date"
                    name="expenseDate"
                    value={formData.expenseDate}
                    onChange={handleChange}
                    required
                  />

                  <CalendarDays size={17} />
                </div>
              </div>

              <div className="general-dialog__field">
                <label htmlFor="general-amount">
                  Amount (₹) <span>*</span>
                </label>

                <input
                  id="general-amount"
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* PAYMENT STATUS */}
            <div className="general-dialog__field">
              <label htmlFor="general-status">
                Payment Status <span>*</span>
              </label>

              <select
                id="general-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="general-dialog__field">
              <label htmlFor="general-description">
                Description / Notes
                <span className="optional">(Optional)</span>
              </label>

              <textarea
                id="general-description"
                name="description"
                rows={4}
                placeholder="Add additional details about this expense..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* FOOTER */}
          <div className="general-dialog__footer">

            <button
              type="button"
              className="general-dialog__cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="general-dialog__submit"
            >
              <Plus size={18} />

              {initialData ? "Save Changes" : "Add Expense"}
            </button>

          </div>

        </form>

      </section>
    </div>
  );
};

export default GeneralDialog;