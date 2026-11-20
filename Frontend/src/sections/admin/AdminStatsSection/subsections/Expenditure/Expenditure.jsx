
import React, { useMemo, useState } from "react";
import {
  Wallet,
  CalendarDays,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";

import useAdminExpense from "../../../../../hooks/admin/useAdminExpense";
import "./Expenditure.scss";

/* -------------------------------------------------------------------------- */
/*                                   CONSTANTS                                */
/* -------------------------------------------------------------------------- */

const CATEGORIES = [
  "Rent",
  "Salaries",
  "Utilities",
  "Marketing",
  "Supplies",
  "Maintenance",
  "Equipment",
  "Miscellaneous",
];

const PAYMENT_METHODS = [
  "Cash",
  "UPI",
  "Card",
  "Bank Transfer",
];

const RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
  { label: "Last 365 Days", value: "365" },
];

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const getLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "—";

  // Prevent date-only values from shifting to the previous day.
  const parsedDate =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T12:00:00`)
      : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDateInputValue = (date) => {
  if (!date) return getLocalDate();

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    return date.slice(0, 10);
  }

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? getLocalDate()
    : getLocalDate(parsedDate);
};

const INITIAL_FORM = {
  title: "",
  category: "Miscellaneous",
  amount: "",
  paymentMethod: "Cash",
  date: getLocalDate(),
  description: "",
};

/* -------------------------------------------------------------------------- */
/*                                EXPENDITURE                                 */
/* -------------------------------------------------------------------------- */

const Expenditure = () => {
  const {
    expenses = [],
    summary,
    filters,
    setFilters,
    loading,
    statsLoading,
    mutationLoading,
    error,
    statsError,
    handleCreateExpense,
    handleUpdateExpense,
    handleDeleteExpense: deleteExpenseAPI,
  } = useAdminExpense();

  const [dateRange, setDateRange] = useState("30");

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formData, setFormData] = useState(INITIAL_FORM);

  const [selectedExpense, setSelectedExpense] = useState(null);

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ------------------------------------------------------------------------ */
  /*                              DATE FILTER                                 */
  /* ------------------------------------------------------------------------ */

  const handleDateRangeChange = (value) => {
    setDateRange(value);

    const endDate = new Date();
    const startDate = new Date();

    startDate.setDate(
      startDate.getDate() - Number(value) + 1
    );

    setFilters({
      startDate: getLocalDate(startDate),
      endDate: getLocalDate(endDate),
    });
  };

  /* ------------------------------------------------------------------------ */
  /*                                  KPIs                                    */
  /* ------------------------------------------------------------------------ */

  const totalExpenditure = Number(
    summary?.totalExpenditure || 0
  );

  const totalTransactions = Number(
    summary?.totalTransactions || 0
  );

  const highestExpense = summary?.highestExpense;

  const expenseRatio = Number(
    summary?.expenseRatio || 0
  );

  const kpis = useMemo(
    () => [
      {
        id: "total",
        title: "Total Expenditure",
        value: formatCurrency(totalExpenditure),
        icon: Wallet,
        color: "green",
        description: "Total spending in selected period",
      },
      {
        id: "transactions",
        title: "Total Transactions",
        value: totalTransactions.toLocaleString("en-IN"),
        icon: CalendarDays,
        color: "blue",
        description: "Recorded expense transactions",
      },
      {
        id: "highest",
        title: "Highest Expense",
        value: highestExpense?.title || "—",
        amount: highestExpense
          ? formatCurrency(highestExpense.amount)
          : "No expenses",
        icon: Wallet,
        color: "purple",
        description: "Highest individual expense",
      },
      {
        id: "ratio",
        title: "Expense Ratio",
        value: `${expenseRatio.toFixed(1)}%`,
        icon: Wallet,
        color: "orange",
        description: "Expenditure compared to revenue",
      },
    ],
    [
      totalExpenditure,
      totalTransactions,
      highestExpense,
      expenseRatio,
    ]
  );

  /* ------------------------------------------------------------------------ */
  /*                               ADD EXPENSE                                */
  /* ------------------------------------------------------------------------ */

  const handleAddExpense = () => {
    setFormMode("create");
    setFormData({
      ...INITIAL_FORM,
      date: getLocalDate(),
    });

    setSelectedExpense(null);
    setFormError("");
    setSuccessMessage("");
    setShowForm(true);
  };

  /* ------------------------------------------------------------------------ */
  /*                               EDIT EXPENSE                               */
  /* ------------------------------------------------------------------------ */

  const handleEditExpense = (expense) => {
    setFormMode("edit");

    setFormData({
      title: expense.title || "",
      category: expense.category || "Miscellaneous",
      amount: expense.amount ?? "",
      paymentMethod: expense.paymentMethod || "Cash",
      date: getDateInputValue(expense.date),
      description: expense.description || "",
    });

    setSelectedExpense(expense);
    setFormError("");
    setSuccessMessage("");
    setShowForm(true);
  };

  /* ------------------------------------------------------------------------ */
  /*                               VIEW EXPENSE                               */
  /* ------------------------------------------------------------------------ */

  const handleViewExpense = (expense) => {
    setShowForm(false);
    setSelectedExpense(expense);
    setFormError("");
    setSuccessMessage("");
  };

  /* ------------------------------------------------------------------------ */
  /*                              CLOSE PANEL                                */
  /* ------------------------------------------------------------------------ */

  const handleClosePanel = () => {
    setShowForm(false);
    setSelectedExpense(null);
    setFormError("");
  };

  /* ------------------------------------------------------------------------ */
  /*                              FORM CHANGE                                */
  /* ------------------------------------------------------------------------ */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ------------------------------------------------------------------------ */
  /*                           CREATE / UPDATE                               */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");
    setSuccessMessage("");

    if (!formData.title.trim()) {
      setFormError("Please enter an expense title.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setFormError("Please enter a valid expense amount.");
      return;
    }

    if (!formData.date) {
      setFormError("Please select an expense date.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      date: formData.date,
      description: formData.description.trim(),
    };

    try {
      if (formMode === "edit" && selectedExpense?._id) {
        await handleUpdateExpense(
          selectedExpense._id,
          payload
        );

        setSuccessMessage("Expense updated successfully.");
      } else {
        await handleCreateExpense(payload);

        setSuccessMessage("Expense created successfully.");
      }

      setShowForm(false);
      setSelectedExpense(null);
      setFormData(INITIAL_FORM);
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong."
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              DELETE EXPENSE                              */
  /* ------------------------------------------------------------------------ */

  const handleDeleteExpense = async (expense) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${expense.title}"?`
    );

    if (!confirmed) return;

    setSuccessMessage("");
    setFormError("");

    try {
      await deleteExpenseAPI(expense._id);

      if (selectedExpense?._id === expense._id) {
        setSelectedExpense(null);
      }

      setSuccessMessage("Expense deleted successfully.");
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
        err.message ||
        "Unable to delete expense."
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                    UI                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <section className="expenditure-stats">

      {/* HEADER */}
      <div className="expenditure-stats__header">
        <div>
          <span className="expenditure-stats__eyebrow">
            ANALYTICS & REPORTS
          </span>

          <h2>Expenditure</h2>

          <p>
            Track and manage business expenses with detailed analytics.
          </p>
        </div>

        <div className="expenditure-stats__header-actions">
          <select
            value={dateRange}
            onChange={(event) =>
              handleDateRangeChange(event.target.value)
            }
            aria-label="Select expenditure date range"
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="expenditure-stats__add-btn"
            onClick={handleAddExpense}
          >
            <Plus size={18} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="expenditure-stats__success">
          {successMessage}
        </div>
      )}

      {/* API ERROR */}
      {error && (
        <div className="expenditure-stats__error">
          {error}
        </div>
      )}

      {statsError && (
        <div className="expenditure-stats__error">
          Statistics: {statsError}
        </div>
      )}

      {/* KPI CARDS */}
      <div className="expenditure-stats__kpis">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <article
              key={kpi.id}
              className={`expenditure-stats__kpi expenditure-stats__kpi--${kpi.color}`}
            >
              <div className="expenditure-stats__kpi-top">
                <div className="expenditure-stats__kpi-icon">
                  <Icon size={23} strokeWidth={1.9} />
                </div>

                <span>{kpi.title}</span>
              </div>

              <h3>
                {statsLoading ? "..." : kpi.value}
              </h3>

              {kpi.amount && (
                <strong className="expenditure-stats__kpi-amount">
                  {statsLoading ? "..." : kpi.amount}
                </strong>
              )}

              <p>{kpi.description}</p>
            </article>
          );
        })}
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <article className="expenditure-stats__form-card">
          <div className="expenditure-stats__panel-header">
            <div>
              <h3>
                {formMode === "edit"
                  ? "Edit Expense"
                  : "Add New Expense"}
              </h3>

              <p>Enter the expense information below.</p>
            </div>

            <button
              type="button"
              onClick={handleClosePanel}
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form
            className="expenditure-stats__form"
            onSubmit={handleSubmit}
          >
            <div className="expenditure-stats__form-grid">

              <label>
                Expense Title *
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Monthly shop rent"
                  required
                />
              </label>

              <label>
                Amount (₹) *
                <input
                  type="number"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  required
                />
              </label>

              <label>
                Category *
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Payment Method *
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Expense Date *
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="expenditure-stats__full-width">
                Description

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add additional details..."
                  rows={3}
                />
              </label>

            </div>

            {formError && (
              <p className="expenditure-stats__error">
                {formError}
              </p>
            )}

            <div className="expenditure-stats__form-actions">
              <button
                type="button"
                onClick={handleClosePanel}
                disabled={mutationLoading}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={mutationLoading}
              >
                <Save size={17} />

                {mutationLoading
                  ? "Saving..."
                  : formMode === "edit"
                    ? "Update Expense"
                    : "Save Expense"}
              </button>
            </div>
          </form>
        </article>
      )}

      {/* VIEW EXPENSE DETAILS */}
      {selectedExpense && !showForm && (
        <article className="expenditure-stats__details-card">
          <div className="expenditure-stats__panel-header">
            <div>
              <h3>Expense Details</h3>
              <p>Complete information for this transaction.</p>
            </div>

            <button
              type="button"
              onClick={handleClosePanel}
              aria-label="Close details"
            >
              <X size={20} />
            </button>
          </div>

          <div className="expenditure-stats__details-grid">
            <div>
              <span>Expense Title</span>
              <strong>{selectedExpense.title}</strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>
                {formatCurrency(selectedExpense.amount)}
              </strong>
            </div>

            <div>
              <span>Category</span>
              <strong>{selectedExpense.category}</strong>
            </div>

            <div>
              <span>Payment Method</span>
              <strong>{selectedExpense.paymentMethod}</strong>
            </div>

            <div>
              <span>Date</span>
              <strong>{formatDate(selectedExpense.date)}</strong>
            </div>

            <div className="expenditure-stats__full-width">
              <span>Description</span>

              <strong>
                {selectedExpense.description ||
                  "No description provided."}
              </strong>
            </div>
          </div>

          <div className="expenditure-stats__form-actions">
            <button
              type="button"
              onClick={() => handleEditExpense(selectedExpense)}
            >
              <Pencil size={16} />
              Edit Expense
            </button>

            <button
              type="button"
              onClick={handleClosePanel}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        </article>
      )}

      {/* EXPENDITURE TABLE */}
      <article className="expenditure-stats__table-card">
        <div className="expenditure-stats__table-header">
          <div>
            <h3>Recent Expenditures</h3>
            <p>
              Latest expense transactions for the selected period
            </p>
          </div>
        </div>

        <div className="expenditure-stats__table-wrapper">
          <table className="expenditure-stats__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Topic / Category</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="expenditure-stats__empty"
                  >
                    Loading expenses...
                  </td>
                </tr>
              ) : expenses.length > 0 ? (
                expenses.map((expense, index) => (
                  <tr key={expense._id}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="expenditure-stats__expense-name">
                        <span>{expense.title}</span>
                        <small>{expense.category}</small>
                      </div>
                    </td>

                    <td>
                      <strong className="expenditure-stats__amount">
                        {formatCurrency(expense.amount)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`expenditure-stats__payment expenditure-stats__payment--${(
                          expense.paymentMethod || ""
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {expense.paymentMethod}
                      </span>
                    </td>

                    <td>{formatDate(expense.date)}</td>

                    <td>
                      <div className="expenditure-stats__actions">
                        <button
                          type="button"
                          className="expenditure-stats__action expenditure-stats__action--view"
                          title="View expense"
                          aria-label={`View ${expense.title}`}
                          onClick={() =>
                            handleViewExpense(expense)
                          }
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          type="button"
                          className="expenditure-stats__action expenditure-stats__action--edit"
                          title="Edit expense"
                          aria-label={`Edit ${expense.title}`}
                          onClick={() =>
                            handleEditExpense(expense)
                          }
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          className="expenditure-stats__action expenditure-stats__action--delete"
                          title="Delete expense"
                          aria-label={`Delete ${expense.title}`}
                          onClick={() =>
                            handleDeleteExpense(expense)
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="expenditure-stats__empty"
                  >
                    No expenditure records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="expenditure-stats__table-footer">
          <span>
            Showing {expenses.length} transactions
          </span>

          <strong>
            Total: {formatCurrency(totalExpenditure)}
          </strong>
        </div>
      </article>
    </section>
  );
};

export default Expenditure;