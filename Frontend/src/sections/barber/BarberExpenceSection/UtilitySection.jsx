import { useMemo, useState } from "react";
import { Zap, IndianRupee, FileText, Hourglass, Plus,
  ChevronLeft, ChevronRight, Eye, Pencil, Trash2, CalendarDays,
} from "lucide-react";

import "./UtilitySection.scss";

import UtilityDialog from "../../../components/barber/UtilityDialog/UtilityDialog";

import { UTILITY_DATA, UTILITY_ITEMS_PER_PAGE,} from "../../../constants/utility";

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

const UtilitySection = () => {
  const [utilities, setUtilities] = useState(UTILITY_DATA);
  const [currentPage, setCurrentPage] = useState(1);

  const [showDialog, setShowDialog] = useState(false);
  const [editingUtility, setEditingUtility] = useState(null);
  const [viewingUtility, setViewingUtility] = useState(null);

  // KPI CALCULATIONS
  const totalExpense = useMemo(
    () =>
      utilities.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      ),
    [utilities]
  );

  const totalBills = utilities.length;

  const pendingAmount = useMemo(
    () =>
      utilities
        .filter((item) => item.status !== "Paid")
        .reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        ),
    [utilities]
  );

  // PAGINATION
  const totalPages = Math.ceil(
    utilities.length / UTILITY_ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * UTILITY_ITEMS_PER_PAGE;

  const currentItems = utilities.slice(
    startIndex,
    startIndex + UTILITY_ITEMS_PER_PAGE
  );

  // ADD
  const handleAddClick = () => {
    setEditingUtility(null);
    setShowDialog(true);
  };

  // EDIT
  const handleEditClick = (utility) => {
    setEditingUtility(utility);
    setShowDialog(true);
  };

  // SAVE / UPDATE
  const handleSaveUtility = (data) => {
    if (editingUtility) {
      setUtilities((prev) =>
        prev.map((item) =>
          item.id === editingUtility.id
            ? { ...item, ...data }
            : item
        )
      );
    } else {
      const newUtility = {
        ...data,
        id: `UTL${Date.now()}`,
      };

      setUtilities((prev) => [newUtility, ...prev]);
      setCurrentPage(1);
    }

    setShowDialog(false);
    setEditingUtility(null);
  };

  // DELETE
  const handleDelete = (utility) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${utility.billName}"?`
    );

    if (!confirmed) return;

    setUtilities((prev) =>
      prev.filter((item) => item.id !== utility.id)
    );

    setCurrentPage((prev) => {
      const remaining = utilities.length - 1;
      const newTotalPages = Math.ceil(
        remaining / UTILITY_ITEMS_PER_PAGE
      );

      return Math.min(prev, Math.max(newTotalPages, 1));
    });
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingUtility(null);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  };

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
    <section className="utility-section">

      {/* HEADER */}
      <div className="utility-section__header">
        <div className="utility-section__heading">
          <div className="utility-section__heading-icon">
            <Zap size={25} />
          </div>

          <div>
            <h2>Utility Expenses</h2>
            <p>
              Track your utility bills including electricity,
              water, internet, telephone and gas bills.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="utility-section__add-btn"
          onClick={handleAddClick}
        >
          <Plus size={18} />
          Add Utility Expense
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="utility-section__kpis">

        <div className="utility-kpi utility-kpi--green">
          <div className="utility-kpi__icon">
            <IndianRupee size={23} />
          </div>

          <div className="utility-kpi__content">
            <span>Total Utility Expense</span>
            <h3>{formatCurrency(totalExpense)}</h3>
            <p>All recorded bills</p>
          </div>
        </div>

        <div className="utility-kpi utility-kpi--blue">
          <div className="utility-kpi__icon">
            <FileText size={23} />
          </div>

          <div className="utility-kpi__content">
            <span>Total Bills</span>
            <h3>{totalBills}</h3>
            <p>Recorded utility bills</p>
          </div>
        </div>

        <div className="utility-kpi utility-kpi--orange">
          <div className="utility-kpi__icon">
            <Hourglass size={23} />
          </div>

          <div className="utility-kpi__content">
            <span>Pending Amount</span>
            <h3>{formatCurrency(pendingAmount)}</h3>
            <p>Unpaid and partially paid bills</p>
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="utility-section__table-card">

        <div className="utility-section__table-header">
          <div>
            <h3>Utility Bills</h3>
            <p>
              Manage your utility payment records.
            </p>
          </div>

          <span className="utility-section__record-count">
            {totalBills} Records
          </span>
        </div>

        <div className="utility-section__table-wrapper">
          <table className="utility-section__table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Bill Name</th>
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
                      <div className="utility-section__date">
                        <CalendarDays size={15} />
                        {formatDate(item.billDate)}
                      </div>
                    </td>

                    <td>
                      <strong className="utility-section__bill-name">
                        {item.billName}
                      </strong>
                    </td>

                    <td>
                      <span className="utility-section__category">
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <strong className="utility-section__amount">
                        {formatCurrency(item.amount)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`utility-section__status utility-section__status--${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <div className="utility-section__actions">

                        <button
                          type="button"
                          className="utility-section__action utility-section__action--view"
                          onClick={() => setViewingUtility(item)}
                          title="View details"
                          aria-label={`View ${item.billName}`}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          className="utility-section__action utility-section__action--edit"
                          onClick={() => handleEditClick(item)}
                          title="Edit bill"
                          aria-label={`Edit ${item.billName}`}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className="utility-section__action utility-section__action--delete"
                          onClick={() => handleDelete(item)}
                          title="Delete bill"
                          aria-label={`Delete ${item.billName}`}
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
                    className="utility-section__empty-state"
                  >
                    No utility bills found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* PAGINATION */}
        <div className="utility-section__pagination">

          <span>
            Showing{" "}
            {utilities.length === 0 ? 0 : startIndex + 1}
            {" - "}
            {Math.min(
              startIndex + UTILITY_ITEMS_PER_PAGE,
              utilities.length
            )}
            {" "}of {utilities.length} records
          </span>

          <div className="utility-section__pagination-controls">

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
      <UtilityDialog
        isOpen={showDialog}
        initialData={editingUtility}
        onClose={handleCloseDialog}
        onSave={handleSaveUtility}
      />

      {/* VIEW DETAILS DIALOG */}
      {viewingUtility && (
        <div
          className="utility-section__view-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewingUtility(null);
            }
          }}
        >
          <div
            className="utility-section__view-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="utility-view-title"
          >
            <div className="utility-section__view-header">
              <h3 id="utility-view-title">
                Utility Bill Details
              </h3>

              <button
                type="button"
                onClick={() => setViewingUtility(null)}
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <div className="utility-section__view-grid">
              {[
                ["Bill Name", viewingUtility.billName],
                ["Category", viewingUtility.category],
                ["Bill Date", formatDate(viewingUtility.billDate)],
                ["Bill Number", viewingUtility.billNumber || "—"],
                ["Amount", formatCurrency(viewingUtility.amount)],
                ["Payment Method", viewingUtility.paymentMethod],
                ["Status", viewingUtility.status],
                ["Due Date", formatDate(viewingUtility.dueDate)],
                ["Description", viewingUtility.description || "—"],
              ].map(([label, value]) => (
                <div
                  className="utility-section__view-field"
                  key={label}
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            {viewingUtility.receipt && (
              <p className="utility-section__receipt">
                Receipt: {viewingUtility.receipt.name || "Attached"}
              </p>
            )}

            <div className="utility-section__view-footer">
              <button
                type="button"
                onClick={() => setViewingUtility(null)}
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

export default UtilitySection;
