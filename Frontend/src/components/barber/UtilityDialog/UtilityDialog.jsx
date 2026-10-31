import { useEffect, useState } from "react";
import {  X,  Zap,  CalendarDays,  UploadCloud,  Plus,  FileText,} from "lucide-react";

import "./UtilityDialog.scss";

const INITIAL_FORM = {
  billName: "",
  category: "",
  billDate: new Date().toISOString().split("T")[0],
  billNumber: "",
  amount: "",
  paymentMethod: "",
  status: "Paid",
  dueDate: "",
  description: "",
  receipt: null,
};

const UTILITY_CATEGORIES = [ "Electricity", "Water", "Internet", "Telephone", "Gas", "Other",];
const PAYMENT_METHODS = [  "Cash",  "UPI",  "Card",  "Bank Transfer","Cheque",  "Other",];
const PAYMENT_STATUSES = [  "Paid",  "Pending",  "Partial",];

const UtilityDialog = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM);
    }
  }, [isOpen]);

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

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

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

    if (!formData.billName.trim()) return;
    if (!formData.category) return;
    if (!formData.billDate) return;
    if (!Number.isFinite(amount) || amount <= 0) return;
    if (!formData.paymentMethod) return;
    if (!formData.status) return;

    if (
      formData.dueDate &&
      formData.dueDate < formData.billDate
    ) {
      alert("Due date cannot be earlier than bill date.");
      return;
    }

    const utilityData = {
      billName: formData.billName.trim(),
      category: formData.category,
      billDate: formData.billDate,
      billNumber: formData.billNumber.trim() || undefined,
      amount,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      dueDate: formData.dueDate || undefined,
      description: formData.description.trim() || undefined,
      receipt: formData.receipt || undefined,
    };

    onSave?.(utilityData);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="utility-dialog__overlay" onMouseDown={handleOverlayClick} >
      <section
        className="utility-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="utility-dialog-title"
      >

        {/* HEADER */}
        <div className="utility-dialog__header">
          <div className="utility-dialog__heading">
            <div className="utility-dialog__icon">
              <Zap size={23} />
            </div>

            <div>
              <h2 id="utility-dialog-title">
                Add Utility Expense
              </h2>

              <p>
                Add a new utility bill expense.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="utility-dialog__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={21} />
          </button>
        </div>

        {/* FORM */}
        <form className="utility-dialog__form" onSubmit={handleSubmit}>
          <div className="utility-dialog__body">

            {/* BILL NAME + CATEGORY */}
            <div className="utility-dialog__row">

              <div className="utility-dialog__field">
                <label htmlFor="utility-bill-name">
                  Bill Name <span>*</span>
                </label>

                <input
                  id="utility-bill-name"
                  type="text"
                  name="billName"
                  placeholder="e.g. Electricity Bill"
                  value={formData.billName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="utility-dialog__field">
                <label htmlFor="utility-category">
                  Category <span>*</span>
                </label>

                <select
                  id="utility-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>

                  {UTILITY_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* BILL DATE + BILL NUMBER */}
            <div className="utility-dialog__row">

              <div className="utility-dialog__field">
                <label htmlFor="utility-bill-date">
                  Bill Date <span>*</span>
                </label>

                <div className="utility-dialog__input-icon">
                  <input
                    id="utility-bill-date"
                    type="date"
                    name="billDate"
                    value={formData.billDate}
                    onChange={handleChange}
                    required
                  />
                  <CalendarDays size={17} />
                </div>
              </div>

              <div className="utility-dialog__field">
                <label htmlFor="utility-bill-number">
                  Bill Number
                  <span className="optional">(Optional)</span>
                </label>

                <input
                  id="utility-bill-number"
                  type="text"
                  name="billNumber"
                  placeholder="Enter bill number"
                  value={formData.billNumber}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* AMOUNT + PAYMENT METHOD */}
            <div className="utility-dialog__row">

              <div className="utility-dialog__field">
                <label htmlFor="utility-amount">
                  Amount (₹) <span>*</span>
                </label>

                <input
                  id="utility-amount"
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

              <div className="utility-dialog__field">
                <label htmlFor="utility-payment-method">
                  Payment Method <span>*</span>
                </label>

                <select id="utility-payment-method"
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

            </div>

            {/* STATUS + DUE DATE */}
            <div className="utility-dialog__row">

              <div className="utility-dialog__field">
                <label htmlFor="utility-status">
                  Payment Status <span>*</span>
                </label>

                <select id="utility-status"
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

              <div className="utility-dialog__field">
                <label htmlFor="utility-due-date">
                  Due Date
                  <span className="optional">(Optional)</span>
                </label>

                <div className="utility-dialog__input-icon">
                  <input
                    id="utility-due-date"
                    type="date"
                    name="dueDate"
                    min={formData.billDate}
                    value={formData.dueDate}
                    onChange={handleChange}
                  />

                  <CalendarDays size={17} />
                </div>
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="utility-dialog__field">
              <label htmlFor="utility-description">
                Description
                <span className="optional">(Optional)</span>
              </label>

              <textarea
                id="utility-description"
                name="description"
                rows={3}
                placeholder="Add any additional details..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* RECEIPT UPLOAD */}
            <div className="utility-dialog__field">
              <label>
                Bill / Receipt
                <span className="optional">(Optional)</span>
              </label>

              <label className={`utility-dialog__upload ${ formData.receipt ? "has-file" : ""}`}
                htmlFor="utility-receipt"
              >
                <input
                  id="utility-receipt"
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

                      <span>
                        Click to change file
                      </span>
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
          <div className="utility-dialog__footer">
            <button type="button" className="utility-dialog__cancel" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="utility-dialog__submit">
              <Plus size={18} />
              Add Expense
            </button>
          </div>

        </form>
      </section>
    </div>
  );
};

export default UtilityDialog;