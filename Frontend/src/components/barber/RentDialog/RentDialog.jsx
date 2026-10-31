import { useEffect, useState } from "react";
import {  X,  Building2,  CalendarDays,  UploadCloud,  Plus,  FileText,} from "lucide-react";

import "./RentDialog.scss";

const INITIAL_FORM = {  expenseName: "", category: "",
  expenseDate: new Date().toISOString().split("T")[0],
  amount: "",  paymentMethod: "",  status: "Paid",
  dueDate: "",  referenceNumber: "",  description: "",  receipt: null,
};

const RENT_CATEGORIES = [ "Rent", "AC Maintenance", "Electrical Repair", "Plumbing", "Furniture Repair", "Painting",
  "Cleaning & Maintenance", "Other", ];

const PAYMENT_METHODS = [ "Cash", "UPI", "Card", "Bank Transfer", "Cheque", "Other", ];

const PAYMENT_STATUSES = [ "Paid", "Pending", "Partial",];

const RentDialog = ({ isOpen,
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
        receipt: null,
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

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [ "image/jpeg", "image/png", "application/pdf",];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG or PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must not exceed 5MB.");
      event.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      receipt: file,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const amount = Number(formData.amount);

    if (!formData.expenseName.trim()) return;
    if (!formData.category) return;
    if (!formData.expenseDate) return;
    if (!Number.isFinite(amount) || amount <= 0) return;
    if (!formData.paymentMethod) return;
    if (!formData.status) return;

    if (
      formData.dueDate &&
      formData.dueDate < formData.expenseDate
    ) {
      alert("Due date cannot be earlier than expense date.");
      return;
    }

    const rentData = {
      expenseName: formData.expenseName.trim(),
      category: formData.category,
      expenseDate: formData.expenseDate,
      amount,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      dueDate: formData.dueDate || "",
      referenceNumber:
        formData.referenceNumber.trim() || "",
      description: formData.description.trim() || "",
      receipt: formData.receipt || undefined,
    };

    onSave?.(rentData);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="rent-dialog__overlay"
      onMouseDown={handleOverlayClick}
    >
      <section
        className="rent-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rent-dialog-title"
      >

        {/* HEADER */}
        <div className="rent-dialog__header">
          <div className="rent-dialog__heading">
            <div className="rent-dialog__icon">
              <Building2 size={23} />
            </div>

            <div>
              <h2 id="rent-dialog-title">
                {initialData
                  ? "Edit Rent & Maintenance Expense"
                  : "Add Rent & Maintenance Expense"}
              </h2>

              <p>
                Add a new rent or maintenance expense.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rent-dialog__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={21} />
          </button>
        </div>

        {/* FORM */}
        <form
          className="rent-dialog__form"
          onSubmit={handleSubmit}
        >
          <div className="rent-dialog__body">

            {/* EXPENSE NAME + CATEGORY */}
            <div className="rent-dialog__row">

              <div className="rent-dialog__field">
                <label htmlFor="rent-expense-name">
                  Expense Name <span>*</span>
                </label>

                <input
                  id="rent-expense-name"
                  type="text"
                  name="expenseName"
                  placeholder="e.g. Shop Rent, AC Maintenance"
                  value={formData.expenseName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="rent-dialog__field">
                <label htmlFor="rent-category">
                  Category <span>*</span>
                </label>

                <select
                  id="rent-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>

                  {RENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* DATE + AMOUNT */}
            <div className="rent-dialog__row">

              <div className="rent-dialog__field">
                <label htmlFor="rent-expense-date">
                  Expense Date <span>*</span>
                </label>

                <div className="rent-dialog__input-icon">
                  <input
                    id="rent-expense-date"
                    type="date"
                    name="expenseDate"
                    value={formData.expenseDate}
                    onChange={handleChange}
                    required
                  />
                  <CalendarDays size={17} />
                </div>
              </div>

              <div className="rent-dialog__field">
                <label htmlFor="rent-amount">
                  Amount (₹) <span>*</span>
                </label>

                <input
                  id="rent-amount"
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

            {/* PAYMENT METHOD + STATUS */}
            <div className="rent-dialog__row">

              <div className="rent-dialog__field">
                <label htmlFor="rent-payment-method">
                  Payment Method <span>*</span>
                </label>

                <select
                  id="rent-payment-method"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select payment method
                  </option>

                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rent-dialog__field">
                <label htmlFor="rent-status">
                  Payment Status <span>*</span>
                </label>

                <select
                  id="rent-status"
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

            </div>

            {/* DUE DATE + REFERENCE */}
            <div className="rent-dialog__row">

              <div className="rent-dialog__field">
                <label htmlFor="rent-due-date">
                  Due Date
                  <span className="optional">(Optional)</span>
                </label>

                <div className="rent-dialog__input-icon">
                  <input
                    id="rent-due-date"
                    type="date"
                    name="dueDate"
                    min={formData.expenseDate}
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                  <CalendarDays size={17} />
                </div>
              </div>

              <div className="rent-dialog__field">
                <label htmlFor="rent-reference">
                  Reference Number
                  <span className="optional">(Optional)</span>
                </label>

                <input
                  id="rent-reference"
                  type="text"
                  name="referenceNumber"
                  placeholder="Enter reference number"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="rent-dialog__field">
              <label htmlFor="rent-description">
                Description
                <span className="optional">(Optional)</span>
              </label>

              <textarea
                id="rent-description"
                name="description"
                rows={3}
                placeholder="Add any additional details..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* RECEIPT UPLOAD */}
            <div className="rent-dialog__field">
              <label>
                Bill / Receipt
                <span className="optional">(Optional)</span>
              </label>

              <label
                className={`rent-dialog__upload ${
                  formData.receipt ? "has-file" : ""
                }`}
                htmlFor="rent-receipt"
              >
                <input
                  id="rent-receipt"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />

                {formData.receipt ? (
                  <>
                    <FileText size={27} />

                    <div>
                      <strong>
                        {formData.receipt.name}
                      </strong>
                      <span>Click to change file</span>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud size={29} />

                    <div>
                      <strong>
                        Click to upload
                        <span> or drag and drop</span>
                      </strong>

                      <small>
                        JPG, PNG or PDF (Max 5MB)
                      </small>
                    </div>
                  </>
                )}
              </label>
            </div>

          </div>

          {/* FOOTER */}
          <div className="rent-dialog__footer">
            <button type="button"
              className="rent-dialog__cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rent-dialog__submit"
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

export default RentDialog;