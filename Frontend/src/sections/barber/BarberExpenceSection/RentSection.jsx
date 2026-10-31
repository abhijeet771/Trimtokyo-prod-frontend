import { useMemo, useState } from "react";

import {
  Building2,
  IndianRupee,
  FileText,
  Wrench,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";

import "./RentSection.scss";

import RentDialog from "../../../components/barber/RentDialog/RentDialog";

import {  RENT_DATA,  RENT_ITEMS_PER_PAGE,} from "../../../constants/rent";

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

const RentSection = () => {
  const [expenses, setExpenses] = useState(RENT_DATA);
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

  const maintenanceCost = useMemo(
    () =>
      expenses
        .filter((item) => item.category !== "Rent")
        .reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        ),
    [expenses]
  );

  // PAGINATION

  const totalPages = Math.ceil(
    expenses.length / RENT_ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * RENT_ITEMS_PER_PAGE;

  const currentItems = expenses.slice(
    startIndex,
    startIndex + RENT_ITEMS_PER_PAGE
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

  // SAVE / UPDATE EXPENSE

  const handleSaveExpense = (data) => {
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingExpense.id
            ? {
                ...item,
                ...data,
                receipt: data.receipt ?? item.receipt,
              }
            : item
        )
      );
    } else {
      const newExpense = {
        ...data,
        id: `RNT${Date.now()}`,
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
      remaining / RENT_ITEMS_PER_PAGE
    );

    setCurrentPage((prev) =>
      Math.min(prev, Math.max(newTotalPages, 1))
    );

    if (viewingExpense?.id === expense.id) {
      setViewingExpense(null);
    }
  };

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
    <section className="rent-section">

      {/* HEADER */}
      <div className="rent-section__header">

        <div className="rent-section__heading">

          <div className="rent-section__heading-icon">
            <Building2 size={25} />
          </div>

          <div>
            <h2>Rent & Maintenance</h2>

            <p>
              Track your shop rent, maintenance costs and
              property-related expenses.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="rent-section__add-btn"
          onClick={handleAddClick}
        >
          <Plus size={18} />
          Add Expense
        </button>

      </div>

      {/* KPI CARDS */}
      <div className="rent-section__kpis">

        {/* TOTAL EXPENSE */}
        <div className="rent-kpi rent-kpi--green">

          <div className="rent-kpi__icon">
            <IndianRupee size={23} />
          </div>

          <div className="rent-kpi__content">
            <span>Total Rent & Maintenance</span>

            <h3>{formatCurrency(totalExpense)}</h3>

            <p>All recorded expenses</p>
          </div>

        </div>

        {/* TOTAL RECORDS */}
        <div className="rent-kpi rent-kpi--blue">

          <div className="rent-kpi__icon">
            <FileText size={23} />
          </div>

          <div className="rent-kpi__content">
            <span>Total Records</span>

            <h3>{totalRecords}</h3>

            <p>All expense records</p>
          </div>

        </div>

        {/* MAINTENANCE COST */}
        <div className="rent-kpi rent-kpi--orange">

          <div className="rent-kpi__icon">
            <Wrench size={23} />
          </div>

          <div className="rent-kpi__content">
            <span>Maintenance Cost</span>

            <h3>{formatCurrency(maintenanceCost)}</h3>

            <p>Excluding shop rent</p>
          </div>

        </div>

      </div>

      {/* EXPENSE TABLE */}
      <div className="rent-section__table-card">

        <div className="rent-section__table-header">

          <div>
            <h3>Rent & Maintenance Records</h3>

            <p>
              Manage your rent and maintenance expenses.
            </p>
          </div>

          <span className="rent-section__record-count">
            {totalRecords} Records
          </span>

        </div>

        <div className="rent-section__table-wrapper">

          <table className="rent-section__table">

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
                      <div className="rent-section__date">
                        <CalendarDays size={15} />
                        {formatDate(item.expenseDate)}
                      </div>
                    </td>

                    <td>
                      <strong className="rent-section__expense-name">
                        {item.expenseName}
                      </strong>
                    </td>

                    <td>
                      <span className="rent-section__category">
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <strong className="rent-section__amount">
                        {formatCurrency(item.amount)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`rent-section__status rent-section__status--${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>

                      <div className="rent-section__actions">

                        {/* VIEW */}
                        <button
                          type="button"
                          className="rent-section__action rent-section__action--view"
                          onClick={() => setViewingExpense(item)}
                          title="View details"
                          aria-label={`View ${item.expenseName}`}
                        >
                          <Eye size={17} />
                        </button>

                        {/* EDIT */}
                        <button
                          type="button"
                          className="rent-section__action rent-section__action--edit"
                          onClick={() => handleEditClick(item)}
                          title="Edit expense"
                          aria-label={`Edit ${item.expenseName}`}
                        >
                          <Pencil size={17} />
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          className="rent-section__action rent-section__action--delete"
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
                    className="rent-section__empty-state"
                  >
                    No rent or maintenance expenses found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        <div className="rent-section__pagination">

          <span>
            Showing{" "}
            {expenses.length === 0 ? 0 : startIndex + 1}
            {" - "}
            {Math.min(
              startIndex + RENT_ITEMS_PER_PAGE,
              expenses.length
            )}
            {" "}of {expenses.length} records
          </span>

          <div className="rent-section__pagination-controls">

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
      <RentDialog
        isOpen={showDialog}
        initialData={editingExpense}
        onClose={handleCloseDialog}
        onSave={handleSaveExpense}
      />

      {/* VIEW DETAILS DIALOG */}
      {viewingExpense && (

        <div
          className="rent-section__view-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewingExpense(null);
            }
          }}
        >

          <div
            className="rent-section__view-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rent-view-title"
          >

            <div className="rent-section__view-header">

              <h3 id="rent-view-title">
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

            <div className="rent-section__view-grid">

              {[
                ["Expense Name", viewingExpense.expenseName],
                ["Category", viewingExpense.category],
                ["Expense Date", formatDate(viewingExpense.expenseDate)],
                ["Amount", formatCurrency(viewingExpense.amount)],
                ["Payment Method", viewingExpense.paymentMethod],
                ["Payment Status", viewingExpense.status],
                ["Due Date", formatDate(viewingExpense.dueDate)],
                ["Reference Number", viewingExpense.referenceNumber || "—"],
                ["Description", viewingExpense.description || "—"],
              ].map(([label, value]) => (

                <div
                  className="rent-section__view-field"
                  key={label}
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>

              ))}

            </div>

            {viewingExpense.receipt && (
              <p className="rent-section__receipt">
                Receipt:{" "}
                {viewingExpense.receipt.name || "Attached"}
              </p>
            )}

            <div className="rent-section__view-footer">

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

export default RentSection;
