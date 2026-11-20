
import React, { useMemo, useState } from "react";
import {
  Wallet,
  CalendarDays,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import "./Expenditure.scss";

const INITIAL_EXPENSES = [
  {
    id: 1,
    title: "Rent",
    category: "Rent",
    amount: 100000,
    paymentMethod: "Bank Transfer",
    date: "2026-11-01",
  },
  {
    id: 2,
    title: "Salaries",
    category: "Salaries",
    amount: 70000,
    paymentMethod: "UPI",
    date: "2026-11-03",
  },
  {
    id: 3,
    title: "Utilities (Electricity)",
    category: "Utilities",
    amount: 18500,
    paymentMethod: "Card",
    date: "2026-11-05",
  },
  {
    id: 4,
    title: "Marketing (Ads)",
    category: "Marketing",
    amount: 28000,
    paymentMethod: "UPI",
    date: "2026-11-10",
  },
  {
    id: 5,
    title: "Supplies & Inventory",
    category: "Supplies",
    amount: 21000,
    paymentMethod: "Cash",
    date: "2026-11-12",
  },
  {
    id: 6,
    title: "Maintenance",
    category: "Maintenance",
    amount: 12450,
    paymentMethod: "Card",
    date: "2026-11-15",
  },
];

const RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
  { label: "Last 1 Year", value: "365" },
];

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Expenditure = () => {
  const [expenses] = useState(INITIAL_EXPENSES);
  const [dateRange, setDateRange] = useState("30");

  const filteredExpenses = useMemo(() => {
    const days = Number(dateRange);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - days + 1);

    return expenses.filter((expense) => {
      const expenseDate = new Date(`${expense.date}T00:00:00`);

      return expenseDate >= startDate && expenseDate <= endDate;
    });
  }, [expenses, dateRange]);

  const totalExpenditure = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const totalTransactions = filteredExpenses.length;

  const highestExpense = filteredExpenses.reduce(
    (highest, expense) =>
      Number(expense.amount) > Number(highest?.amount || 0)
        ? expense
        : highest,
    null
  );

  // Replace with actual revenue analytics API data.
  const referenceRevenue = 770000;

  const expenseRatio =
    referenceRevenue > 0
      ? (totalExpenditure / referenceRevenue) * 100
      : 0;

  const kpis = [
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
  ];

  const handleAddExpense = () => {
    // Connect this to your Add Expense page or form later.
  };

  const handleViewExpense = (expense) => {
    // Connect to expense details page later.
    console.log("View expense:", expense.id);
  };

  const handleEditExpense = (expense) => {
    // Connect to expense edit page later.
    console.log("Edit expense:", expense.id);
  };

  const handleDeleteExpense = (expense) => {
    // Connect to delete API and confirmation flow later.
    console.log("Delete expense:", expense.id);
  };

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
            onChange={(event) => setDateRange(event.target.value)}
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

              <h3>{kpi.value}</h3>

              {kpi.amount && (
                <strong className="expenditure-stats__kpi-amount">
                  {kpi.amount}
                </strong>
              )}

              <p>{kpi.description}</p>
            </article>
          );
        })}
      </div>

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
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, index) => (
                  <tr key={expense.id}>
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
                        className={`expenditure-stats__payment expenditure-stats__payment--${expense.paymentMethod
                          .toLowerCase()
                          .replace(" ", "-")}`}
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
                          onClick={() => handleViewExpense(expense)}
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          type="button"
                          className="expenditure-stats__action expenditure-stats__action--edit"
                          title="Edit expense"
                          aria-label={`Edit ${expense.title}`}
                          onClick={() => handleEditExpense(expense)}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          className="expenditure-stats__action expenditure-stats__action--delete"
                          title="Delete expense"
                          aria-label={`Delete ${expense.title}`}
                          onClick={() => handleDeleteExpense(expense)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="expenditure-stats__empty">
                    No expenditure records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="expenditure-stats__table-footer">
          <span>
            Showing {filteredExpenses.length} transactions
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
