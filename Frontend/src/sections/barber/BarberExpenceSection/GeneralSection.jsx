import { useMemo, useState } from "react";

import { Receipt, IndianRupee, FileText, Hourglass, Plus,
  ChevronLeft, ChevronRight, Eye, Pencil, Trash2, CalendarDays,
} from "lucide-react";

import "./GeneralSection.scss";

import GeneralDialog from "../../../components/barber/GeneralDialog/GeneralDialog";

import { GENERAL_DATA, GENERAL_ITEMS_PER_PAGE,} from "../../../constants/general";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const GeneralSection = () => {
  const [expenses, setExpenses] = useState(GENERAL_DATA);
  const [currentPage, setCurrentPage] = useState(1);

  const [showDialog, setShowDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewingExpense, setViewingExpense] = useState(null);

  // KPI CALCULATIONS

  const totalExpense = useMemo(
    () =>
      expenses.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      ),
    [expenses]
  );

  const totalRecords = expenses.length;

  const pendingAmount = useMemo(
    () =>
      expenses
        .filter((item) => item.status !== "Paid")
        .reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        ),
    [expenses]
  );

  // PAGINATION

  const totalPages = Math.ceil(
    expenses.length / GENERAL_ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * GENERAL_ITEMS_PER_PAGE;

  const currentItems = expenses.slice(
    startIndex,
    startIndex + GENERAL_ITEMS_PER_PAGE
  );

  // ADD EXPENSE

  const handleAddClick = () => {
    setEditingExpense(null);
    setShowDialog(true);
  };

  // EDIT EXPENSE

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setShowDialog(true);
  };

  // SAVE / UPDATE

  const handleSaveExpense = (data) => {
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingExpense.id
            ? {
                ...item,
                ...data,
              }
            : item
        )
      );
    } else {
      const newExpense = {
        ...data,
        id: `GEN${Date.now()}`,
      };

      setExpenses((prev) => [newExpense, ...prev]);
      setCurrentPage(1);
    }

    setShowDialog(false);
    setEditingExpense(null);
  };

  // DELETE EXPENSE

  const handleDelete = (expense) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${expense.expenseName}"?`
    );

    if (!confirmed) return;

    const remaining = expenses.length - 1;

    setExpenses((prev) =>
      prev.filter((item) => item.id !== expense.id)
    );

    const newTotalPages = Math.ceil(
      remaining / GENERAL_ITEMS_PER_PAGE
    );

    setCurrentPage((prev) =>
      Math.min(prev, Math.max(newTotalPages, 1))
    );

    if (viewingExpense?.id === expense.id) {
      setViewingExpense(null);
    }
  };

  // CLOSE DIALOG

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingExpense(null);
  };

  // PAGINATION ACTIONS

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  };

  // STATUS CLASS

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "paid";
      case "Pending":
        return "pending";
      case "Partial":
        return "partial";
      default:
        return "pending";
    }
  };

  return (
    <section className="general-section">

      {/* HEADER */}
      <div className="general-section__header">

        <div className="general-section__heading">

          <div className="general-section__heading-icon">
            <Receipt size={25} />
          </div>

          <div>
            <h2>General Expenses</h2>

            <p>
              Track miscellaneous expenses and other
              day-to-day business costs.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="general-section__add-btn"
          onClick={handleAddClick}
        >
          <Plus size={18} />
          Add Expense
        </button>

      </div>

      {/* KPI CARDS */}
      <div className="general-section__kpis">

        {/* TOTAL EXPENSE */}
        <div className="general-kpi general-kpi--green">

          <div className="general-kpi__icon">
            <IndianRupee size={23} />
          </div>

          <div className="general-kpi__content">
            <span>Total General Expenses</span>

            <h3>{formatCurrency(totalExpense)}</h3>

            <p>All recorded expenses</p>
          </div>

        </div>

        {/* TOTAL RECORDS */}
        <div className="general-kpi general-kpi--blue">

          <div className="general-kpi__icon">
            <FileText size={23} />
          </div>

          <div className="general-kpi__content">
            <span>Total Records</span>

            <h3>{totalRecords}</h3>

            <p>All expense records</p>
          </div>

        </div>

        {/* PENDING AMOUNT */}
        <div className="general-kpi general-kpi--orange">

          <div className="general-kpi__icon">
            <Hourglass size={23} />
          </div>

          <div className="general-kpi__content">
            <span>Pending Amount</span>

            <h3>{formatCurrency(pendingAmount)}</h3>

            <p>Unpaid and partially paid bills</p>
          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="general-section__table-card">

        <div className="general-section__table-header">

          <div>
            <h3>General Expense Records</h3>

            <p>
              Manage your miscellaneous business expenses.
            </p>
          </div>

          <span className="general-section__record-count">
            {totalRecords} Records
          </span>

        </div>

        <div className="general-section__table-wrapper">

          <table className="general-section__table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Expense Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {currentItems.length > 0 ? (
                currentItems.map((item) => (

                  <tr key={item.id}>

                    <td>
                      <div className="general-section__date">
                        <CalendarDays size={15} />
                        {formatDate(item.expenseDate)}
                      </div>
                    </td>

                    <td>
                      <strong className="general-section__expense-name">
                        {item.expenseName}
                      </strong>
                    </td>

                    <td>
                      <span className="general-section__category">
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <strong className="general-section__amount">
                        {formatCurrency(item.amount)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`general-section__status general-section__status--${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>

                      <div className="general-section__actions">

                        {/* VIEW */}
                        <button
                          type="button"
                          className="general-section__action general-section__action--view"
                          onClick={() => setViewingExpense(item)}
                          title="View details"
                          aria-label={`View ${item.expenseName}`}
                        >
                          <Eye size={17} />
                        </button>

                        {/* EDIT */}
                        <button
                          type="button"
                          className="general-section__action general-section__action--edit"
                          onClick={() => handleEditClick(item)}
                          title="Edit expense"
                          aria-label={`Edit ${item.expenseName}`}
                        >
                          <Pencil size={17} />
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          className="general-section__action general-section__action--delete"
                          onClick={() => handleDelete(item)}
                          title="Delete expense"
                          aria-label={`Delete ${item.expenseName}`}
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))
              ) : (

                <tr>
                  <td
                    colSpan="6"
                    className="general-section__empty-state"
                  >
                    No general expenses found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        <div className="general-section__pagination">

          <span>
            Showing{" "}
            {expenses.length === 0 ? 0 : startIndex + 1}
            {" - "}
            {Math.min(
              startIndex + GENERAL_ITEMS_PER_PAGE,
              expenses.length
            )}
            {" "}of {expenses.length} records
          </span>

          <div className="general-section__pagination-controls">

            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                type="button"
                key={page}
                className={
                  currentPage === page ? "active" : ""
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>

            ))}

            <button
              type="button"
              onClick={handleNext}
              disabled={
                currentPage === totalPages || totalPages === 0
              }
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

      </div>

      {/* ADD / EDIT DIALOG */}
      <GeneralDialog
        isOpen={showDialog}
        initialData={editingExpense}
        onClose={handleCloseDialog}
        onSave={handleSaveExpense}
      />

      {/* VIEW DETAILS DIALOG */}
      {viewingExpense && (

        <div
          className="general-section__view-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewingExpense(null);
            }
          }}
        >

          <div
            className="general-section__view-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="general-view-title"
          >

            <div className="general-section__view-header">

              <h3 id="general-view-title">
                Expense Details
              </h3>

              <button
                type="button"
                onClick={() => setViewingExpense(null)}
                aria-label="Close details"
              >
                ×
              </button>

            </div>

            <div className="general-section__view-grid">

              {[
                ["Expense Name", viewingExpense.expenseName],
                ["Category", viewingExpense.category],
                ["Expense Date", formatDate(viewingExpense.expenseDate)],
                ["Amount", formatCurrency(viewingExpense.amount)],
                ["Payment Status", viewingExpense.status],
                ["Description", viewingExpense.description || "—"],
              ].map(([label, value]) => (

                <div
                  className="general-section__view-field"
                  key={label}
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>

              ))}

            </div>

            <div className="general-section__view-footer">

              <button
                type="button"
                onClick={() => setViewingExpense(null)}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
};

export default GeneralSection;
