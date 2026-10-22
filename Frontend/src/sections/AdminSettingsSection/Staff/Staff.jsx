
import React, { useEffect, useState } from "react";
import {  Search,  Plus,  Pencil,  Trash2,  ChevronLeft,  ChevronRight,  X,  RefreshCw,} from "lucide-react";

import useStaff from "../../../hooks/admin/useStaff";
import useCreateStaff from "../../../hooks/admin/useCreateStaff";
import useUpdateStaff from "../../../hooks/admin/useUpdateStaff";
import useDeleteStaff from "../../../hooks/admin/useDeleteStaff";

import StaffDialog from "./StaffDialog";
import "./Staff.scss";

const PAGE_SIZE = 10;

const DESIGNATIONS = [
  "Developer",
  "Sales",
  "Marketing",
  "Support",
];

const Staff = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [designationFilter, setDesignationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Debounce search requests.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Fetch staff from the backend.
  const {
    staff,
    pagination,
    loading,
    error,
    refresh,
  } = useStaff({
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    designation:
      designationFilter === "All" ? "" : designationFilter,
  });

  // CRUD hooks.
  const {
    addStaff,
    loading: creating,
    error: createError,
  } = useCreateStaff();

  const {
    editStaff,
    loading: updating,
    error: updateError,
  } = useUpdateStaff();

  const {
    removeStaff,
    loading: deleting,
    error: deleteError,
  } = useDeleteStaff();

  const isSaving = creating || updating;
  const isBusy = isSaving || deleting;

  const totalPages = Math.max(1, pagination.totalPages || 1);
  const totalStaff = pagination.total || 0;

  const startIndex =
    totalStaff === 0 ? 0 : (currentPage - 1) * PAGE_SIZE;

  const endIndex = Math.min(
    startIndex + staff.length,
    totalStaff
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // Keep the current page valid after deletions or filtering.
  useEffect(() => {
    if (!loading && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [loading, currentPage, totalPages]);

  const openAddDialog = () => {
    setSelectedStaff(null);
    setDialogMode("add");
    setActionError("");
    setActionSuccess("");
    setDialogOpen(true);
  };

  const openEditDialog = (member) => {
    setSelectedStaff(member);
    setDialogMode("edit");
    setActionError("");
    setActionSuccess("");
    setDialogOpen(true);
  };

  const openDeleteDialog = (member) => {
    setSelectedStaff(member);
    setDialogMode("delete");
    setActionError("");
    setActionSuccess("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (isBusy) return;

    setDialogOpen(false);
    setSelectedStaff(null);
    setActionError("");
  };

  // Create or update a staff member.
  const handleSaveStaff = async (formData) => {
    setActionError("");
    setActionSuccess("");

    try {
      if (dialogMode === "edit") {
        if (!selectedStaff?._id) {
          throw new Error("Staff ID is missing.");
        }

        await editStaff(selectedStaff._id, formData);

        setActionSuccess(
          "Staff member updated successfully."
        );
      } else {
        await addStaff(formData);

        setActionSuccess(
          "Staff member created successfully."
        );

        setCurrentPage(1);
      }

      setDialogOpen(false);
      setSelectedStaff(null);

      await refresh();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save staff member."
      );
    }
  };

  // Delete a staff member.
  const handleConfirmDelete = async (member) => {
    if (!member?._id) {
      setActionError("Staff ID is missing.");
      return;
    }

    setActionError("");
    setActionSuccess("");

    try {
      await removeStaff(member._id);

      setDialogOpen(false);
      setSelectedStaff(null);

      setActionSuccess(
        "Staff member deleted successfully."
      );

      // Move back if the deleted record was the last item
      // on the current page.
      const nextPage =
        staff.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;

      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
      } else {
        await refresh();
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete staff member."
      );
    }
  };

  const goToPage = (page) => {
    setCurrentPage(
      Math.max(1, Math.min(page, totalPages))
    );
  };

  const displayedError =
    actionError || createError || updateError || deleteError;

  return (
    <section className="staff-management">
      {/* Header */}
      <div className="staff-management__header">
        <div>
          <h2>Staff</h2>
          <p>
            Manage staff names, designations, joining dates,
            salaries, and phone numbers.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="staff-management__toolbar">
        <label className="staff-management__search">
          <Search size={19} aria-hidden="true" />

          <input
            type="search"
            placeholder="Search staff..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search staff"
          />

          {search && (
            <button
              type="button"
              className="staff-management__clear-search"
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                setCurrentPage(1);
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <select
          className="staff-management__designation-filter"
          value={designationFilter}
          onChange={(event) => {
            setDesignationFilter(event.target.value);
            setCurrentPage(1);
          }}
          aria-label="Filter by designation"
        >
          <option value="All">All Designations</option>

          {DESIGNATIONS.map((designation) => (
            <option key={designation} value={designation}>
              {designation}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="staff-management__add-button"
          onClick={openAddDialog}
          disabled={isBusy}
        >
          <Plus size={19} />
          <span>Add Staff</span>
        </button>

        <button
          type="button"
          className="staff-management__icon-button"
          onClick={refresh}
          disabled={loading || isBusy}
          title="Refresh staff"
          aria-label="Refresh staff"
        >
          <RefreshCw
            size={17}
            className={
              loading ? "staff-management__spin" : ""
            }
          />
        </button>
      </div>

      {/* Success message */}
      {actionSuccess && (
        <div
          className="staff-management__success"
          role="status"
        >
          {actionSuccess}
        </div>
      )}

      {/* Error message */}
      {displayedError && (
        <div
          className="staff-management__error"
          role="alert"
        >
          <span>{displayedError}</span>

          <button
            type="button"
            onClick={() => setActionError("")}
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Staff table */}
      <div className="staff-management__table-wrapper">
        <table className="staff-management__table">
          <thead>
            <tr>
              <th className="staff-management__number-column">
                #
              </th>
              <th>Name</th>
              <th>Designation</th>
              <th>Join Date</th>
              <th>Salary</th>
              <th>Phone Number</th>
              <th>Updated At</th>
              <th className="staff-management__actions-column">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <div className="staff-management__empty">
                    <RefreshCw size={20} />
                    <strong>Loading staff...</strong>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8}>
                  <div className="staff-management__empty">
                    <strong>
                      Unable to load staff members
                    </strong>

                    <span>{error}</span>

                    <button
                      type="button"
                      className="staff-management__add-button"
                      onClick={refresh}
                    >
                      Try Again
                    </button>
                  </div>
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="staff-management__empty">
                    <strong>
                      No staff members found
                    </strong>

                    <span>
                      {debouncedSearch ||
                      designationFilter !== "All"
                        ? "Try changing your search or designation filter."
                        : "Add your first staff member to get started."}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              staff.map((member, index) => (
                <tr key={member._id}>
                  <td className="staff-management__number-column">
                    {startIndex + index + 1}
                  </td>

                  <td className="staff-management__name">
                    {member.name || "—"}
                  </td>

                  <td className="staff-management__designation">
                    {member.designation}
                  </td>

                  <td>{formatDate(member.joinDate)}</td>

                  <td className="staff-management__salary">
                    {formatCurrency(member.salary)}
                  </td>

                  <td className="staff-management__phone">
                    {member.phoneNumber}
                  </td>

                  <td>{formatDate(member.updatedAt)}</td>

                  <td>
                    <div className="staff-management__actions">
                      <button
                        type="button"
                        className="staff-management__icon-button"
                        onClick={() =>
                          openEditDialog(member)
                        }
                        disabled={isBusy}
                        aria-label={`Edit ${
                          member.name || "staff member"
                        }`}
                        title="Edit staff"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        className="staff-management__icon-button staff-management__icon-button--delete"
                        onClick={() =>
                          openDeleteDialog(member)
                        }
                        disabled={isBusy}
                        aria-label={`Delete ${
                          member.name || "staff member"
                        }`}
                        title="Delete staff"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="staff-management__pagination">
        <span className="staff-management__pagination-info">
          {loading
            ? "Loading staff records..."
            : totalStaff === 0
              ? "Showing 0 staff members"
              : `Showing ${startIndex + 1}–${endIndex} of ${totalStaff} staff members`}
        </span>

        <div className="staff-management__pagination-controls">
          <button
            type="button"
            className="staff-management__page-button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={loading || currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          {pageNumbers.map((page) => (
            <button
              type="button"
              key={page}
              className={`staff-management__page-button ${
                currentPage === page
                  ? "staff-management__page-button--active"
                  : ""
              }`}
              onClick={() => goToPage(page)}
              disabled={loading}
              aria-label={`Page ${page}`}
              aria-current={
                currentPage === page ? "page" : undefined
              }
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="staff-management__page-button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={
              loading || currentPage === totalPages
            }
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Add, edit, and delete dialog */}
      <StaffDialog
        isOpen={dialogOpen}
        mode={dialogMode}
        staffData={selectedStaff}
        onClose={closeDialog}
        onSave={handleSaveStaff}
        onConfirmDelete={handleConfirmDelete}
        saving={isSaving}
        deleting={deleting}
      />
    </section>
  );
};

function formatDate(dateValue) {
  if (!dateValue) return "—";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export default Staff;
