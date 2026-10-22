
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  IndianRupee,
  X,
  Wallet,
  UserRound,
  Clock,
} from "lucide-react";

import useBarberSalaryCycle from "../../../hooks/barber/useBarberSalaryCycle";
import { getBarberStaff } from "../../../services/barberStaff.service";

import "./BarberSalaryCycleDialog.scss";

const INITIAL_FORM = {
  staffId: "",
  salaryType: "FIXED",
  salaryAmount: "",
  cycleStartDate: "",
  cycleEndDate: "",
  workingDays: "0",
  bonus: "0",
  deductions: "0",
  commissionAmount: "0",
  netSalary: "",
  paymentStatus: "PENDING",
  paymentDate: "",
  paymentMethod: "",
  transactionReference: "",
  notes: "",
};

const toDateInput = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export default function BarberSalaryCycleDialog({
  isOpen,
  onClose,
  salaryCycle = null,
  onSuccess,
}) {
  const {
    createSalaryCycle,
    updateSalaryCycle,
    creating,
    updating,
    error,
    clearError,
  } = useBarberSalaryCycle();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [staff, setStaff] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffError, setStaffError] = useState("");
  const [formError, setFormError] = useState("");

  const isEditing = Boolean(salaryCycle?._id);
  const isSaving = creating || updating;

  useEffect(() => {
    if (!isOpen) return;

    setFormError("");
    setStaffError("");
    clearError();

    if (salaryCycle) {
      setFormData({
        staffId:
          typeof salaryCycle.staffId === "object"
            ? salaryCycle.staffId?._id || ""
            : salaryCycle.staffId || "",
        salaryType: salaryCycle.salaryType || "FIXED",
        salaryAmount: String(salaryCycle.salaryAmount ?? ""),
        cycleStartDate: toDateInput(salaryCycle.cycleStartDate),
        cycleEndDate: toDateInput(salaryCycle.cycleEndDate),
        workingDays: String(salaryCycle.workingDays ?? 0),
        bonus: String(salaryCycle.bonus ?? 0),
        deductions: String(salaryCycle.deductions ?? 0),
        commissionAmount: String(salaryCycle.commissionAmount ?? 0),
        netSalary: String(salaryCycle.netSalary ?? ""),
        paymentStatus: salaryCycle.paymentStatus || "PENDING",
        paymentDate: toDateInput(salaryCycle.paymentDate),
        paymentMethod: salaryCycle.paymentMethod || "",
        transactionReference: salaryCycle.transactionReference || "",
        notes: salaryCycle.notes || "",
      });
    } else {
      setFormData({ ...INITIAL_FORM });
    }
  }, [isOpen, salaryCycle, clearError]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const loadStaff = async () => {
      setLoadingStaff(true);
      setStaffError("");

      try {
        const response = await getBarberStaff({
          page: 1,
          limit: 100,
          status: "ACTIVE",
        });

        const result = response?.data?.data;
        const staffList = Array.isArray(result) ? result : [];

        if (!cancelled) {
          setStaff(staffList);

          // Keep the selected staff available when editing an inactive record.
          const selectedStaffId =
            typeof salaryCycle?.staffId === "object"
              ? salaryCycle?.staffId?._id
              : salaryCycle?.staffId;

          if (
            selectedStaffId &&
            !staffList.some((item) => item._id === selectedStaffId) &&
            typeof salaryCycle?.staffId === "object"
          ) {
            setStaff((previous) => [
              ...previous,
              salaryCycle.staffId,
            ]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setStaffError(
            err?.response?.data?.message ||
              "Unable to load staff members."
          );
        }
      } finally {
        if (!cancelled) setLoadingStaff(false);
      }
    };

    loadStaff();

    return () => {
      cancelled = true;
    };
  }, [isOpen, salaryCycle]);

  const calculatedNetSalary = useMemo(() => {
    return (
      toNumber(formData.salaryAmount) +
      toNumber(formData.bonus) +
      toNumber(formData.commissionAmount) -
      toNumber(formData.deductions)
    );
  }, [
    formData.salaryAmount,
    formData.bonus,
    formData.commissionAmount,
    formData.deductions,
  ]);

  useEffect(() => {
    setFormData((previous) => ({
      ...previous,
      netSalary: String(Math.max(0, calculatedNetSalary)),
    }));
  }, [calculatedNetSalary]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
    clearError();
  };

  const handleStatusChange = (event) => {
    const paymentStatus = event.target.value;

    setFormData((previous) => ({
      ...previous,
      paymentStatus,
      paymentDate:
        paymentStatus === "PENDING" ? "" : previous.paymentDate,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!formData.staffId) {
      setFormError("Please select a staff member.");
      return;
    }

    if (!formData.cycleStartDate || !formData.cycleEndDate) {
      setFormError("Please select both salary-cycle dates.");
      return;
    }

    if (
      new Date(formData.cycleStartDate) >
      new Date(formData.cycleEndDate)
    ) {
      setFormError("Cycle start date cannot be after the end date.");
      return;
    }

    const numericFields = [
      ["Salary amount", formData.salaryAmount],
      ["Working days", formData.workingDays],
      ["Bonus", formData.bonus],
      ["Deductions", formData.deductions],
      ["Commission amount", formData.commissionAmount],
    ];

    for (const [label, value] of numericFields) {
      if (value === "" || !Number.isFinite(Number(value)) || Number(value) < 0) {
        setFormError(`${label} must be a valid non-negative number.`);
        return;
      }
    }

    if (
      formData.paymentStatus !== "PENDING" &&
      !formData.paymentDate
    ) {
      setFormError("Please select the payment date.");
      return;
    }

    if (
      formData.paymentStatus !== "PENDING" &&
      !formData.paymentMethod
    ) {
      setFormError("Please select the payment method.");
      return;
    }

    const payload = {
      staffId: formData.staffId,
      salaryType: formData.salaryType,
      salaryAmount: toNumber(formData.salaryAmount),
      cycleStartDate: formData.cycleStartDate,
      cycleEndDate: formData.cycleEndDate,
      workingDays: toNumber(formData.workingDays),
      bonus: toNumber(formData.bonus),
      deductions: toNumber(formData.deductions),
      commissionAmount: toNumber(formData.commissionAmount),
      netSalary: Math.max(0, calculatedNetSalary),
      paymentStatus: formData.paymentStatus,
      paymentDate: formData.paymentDate || null,
      paymentMethod: formData.paymentMethod || undefined,
      transactionReference: formData.transactionReference.trim(),
      notes: formData.notes.trim(),
    };

    try {
      const result = isEditing
        ? await updateSalaryCycle(salaryCycle._id, payload)
        : await createSalaryCycle(payload);

      if (result) {
        onSuccess?.(result);
        onClose?.();
      }
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save the salary cycle."
      );
    }
  };

  return (
    <div
      className="salary-cycle-dialog__overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose?.();
        }
      }}
    >
      <section
        className="salary-cycle-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="salary-cycle-dialog-title"
      >
        <header className="salary-cycle-dialog__header">
          <div className="salary-cycle-dialog__heading-icon">
            <Wallet size={21} />
          </div>

          <div className="salary-cycle-dialog__heading">
            <h2 id="salary-cycle-dialog-title">
              {isEditing ? "Edit Salary Cycle" : "Create Salary Cycle"}
            </h2>
            <p>
              {isEditing
                ? "Update salary and payment information."
                : "Record a staff member's salary for a pay period."}
            </p>
          </div>

          <button
            type="button"
            className="salary-cycle-dialog__close"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </header>

        <form
          className="salary-cycle-dialog__form"
          onSubmit={handleSubmit}
        >
          <div className="salary-cycle-dialog__body">
            {(formError || error || staffError) && (
              <div className="salary-cycle-dialog__error" role="alert">
                {formError || error || staffError}
              </div>
            )}

            <div className="salary-cycle-dialog__section-title">
              <UserRound size={17} />
              <h3>Staff & Salary Details</h3>
            </div>

            <div className="salary-cycle-dialog__field">
              <label htmlFor="salary-staff">Staff member *</label>
              <select
                id="salary-staff"
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                required
                disabled={loadingStaff || isSaving}
              >
                <option value="">
                  {loadingStaff ? "Loading staff..." : "Select staff member"}
                </option>
                {staff.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.fullName} {member.role ? `— ${member.role}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="salary-cycle-dialog__grid">
              <div className="salary-cycle-dialog__field">
                <label htmlFor="salary-type">Salary type *</label>
                <select
                  id="salary-type"
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                >
                  <option value="FIXED">Fixed</option>
                  <option value="HOURLY">Hourly</option>
                  <option value="COMMISSION">Commission</option>
                </select>
              </div>

              <div className="salary-cycle-dialog__field">
                <label htmlFor="salary-amount">
                  Base amount for this cycle (₹) *
                </label>
                <input
                  id="salary-amount"
                  type="number"
                  name="salaryAmount"
                  value={formData.salaryAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  disabled={isSaving}
                  placeholder="15000"
                />
              </div>
            </div>

            <p className="salary-cycle-dialog__hint">
              For hourly or commission-based staff, enter the base amount
              earned during this cycle. Add any extra commission separately.
            </p>

            <div className="salary-cycle-dialog__section-title">
              <CalendarDays size={17} />
              <h3>Salary Period</h3>
            </div>

            <div className="salary-cycle-dialog__grid">
              <div className="salary-cycle-dialog__field">
                <label htmlFor="cycle-start">Start date *</label>
                <input
                  id="cycle-start"
                  type="date"
                  name="cycleStartDate"
                  value={formData.cycleStartDate}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="salary-cycle-dialog__field">
                <label htmlFor="cycle-end">End date *</label>
                <input
                  id="cycle-end"
                  type="date"
                  name="cycleEndDate"
                  value={formData.cycleEndDate}
                  onChange={handleChange}
                  min={formData.cycleStartDate || undefined}
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="salary-cycle-dialog__field">
              <label htmlFor="working-days">Working days</label>
              <input
                id="working-days"
                type="number"
                name="workingDays"
                value={formData.workingDays}
                onChange={handleChange}
                min="0"
                step="1"
                disabled={isSaving}
              />
            </div>

            <div className="salary-cycle-dialog__section-title">
              <IndianRupee size={17} />
              <h3>Salary Breakdown</h3>
            </div>

            <div className="salary-cycle-dialog__grid salary-cycle-dialog__grid--two">
              <div className="salary-cycle-dialog__field">
                <label htmlFor="salary-bonus">Bonus (₹)</label>
                <input
                  id="salary-bonus"
                  type="number"
                  name="bonus"
                  value={formData.bonus}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={isSaving}
                />
              </div>

              <div className="salary-cycle-dialog__field">
                <label htmlFor="salary-deductions">Deductions (₹)</label>
                <input
                  id="salary-deductions"
                  type="number"
                  name="deductions"
                  value={formData.deductions}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={isSaving}
                />
              </div>

              <div className="salary-cycle-dialog__field">
                <label htmlFor="salary-commission">Commission (₹)</label>
                <input
                  id="salary-commission"
                  type="number"
                  name="commissionAmount"
                  value={formData.commissionAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={isSaving}
                />
              </div>

              <div className="salary-cycle-dialog__field">
                <label htmlFor="salary-net">Net salary (₹)</label>
                <input
                  id="salary-net"
                  type="number"
                  name="netSalary"
                  value={formData.netSalary}
                  readOnly
                  aria-readonly="true"
                />
              </div>
            </div>

            <div className="salary-cycle-dialog__net-preview">
              <span>Net salary payable</span>
              <strong>
                ₹
                {Math.max(0, calculatedNetSalary).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
              <small>
                Base amount + bonus + commission − deductions
              </small>
            </div>

            <div className="salary-cycle-dialog__section-title">
              <Clock size={17} />
              <h3>Payment Details</h3>
            </div>

            <div className="salary-cycle-dialog__grid">
              <div className="salary-cycle-dialog__field">
                <label htmlFor="payment-status">Payment status *</label>
                <select
                  id="payment-status"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleStatusChange}
                  required
                  disabled={isSaving}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PARTIALLY_PAID">Partially paid</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>

              <div className="salary-cycle-dialog__field">
                <label htmlFor="payment-date">Payment date</label>
                <input
                  id="payment-date"
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  required={formData.paymentStatus !== "PENDING"}
                  disabled={
                    isSaving || formData.paymentStatus === "PENDING"
                  }
                />
              </div>
            </div>

            <div className="salary-cycle-dialog__grid">
              <div className="salary-cycle-dialog__field">
                <label htmlFor="payment-method">Payment method</label>
                <select
                  id="payment-method"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required={formData.paymentStatus !== "PENDING"}
                  disabled={
                    isSaving || formData.paymentStatus === "PENDING"
                  }
                >
                  <option value="">Select method</option>
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">Bank transfer</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="salary-cycle-dialog__field">
                <label htmlFor="transaction-reference">
                  Transaction reference
                </label>
                <input
                  id="transaction-reference"
                  type="text"
                  name="transactionReference"
                  value={formData.transactionReference}
                  onChange={handleChange}
                  maxLength={150}
                  disabled={isSaving}
                  placeholder="UPI ID / transaction ID"
                />
              </div>
            </div>

            <div className="salary-cycle-dialog__field">
              <label htmlFor="salary-notes">Notes</label>
              <textarea
                id="salary-notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                maxLength={2000}
                disabled={isSaving}
                placeholder="Add any additional salary or payment notes..."
              />
            </div>
          </div>

          <footer className="salary-cycle-dialog__footer">
            <button
              type="button"
              className="salary-cycle-dialog__button salary-cycle-dialog__button--secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="salary-cycle-dialog__button salary-cycle-dialog__button--primary"
              disabled={isSaving || loadingStaff}
            >
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Salary Cycle"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
