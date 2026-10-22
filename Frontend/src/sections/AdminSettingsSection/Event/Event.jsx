import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
} from "lucide-react";

import useEventCategories from "../../../hooks/admin/useEventCategories";
import useCreateEventCategory from "../../../hooks/admin/useCreateEventCategory";
import useUpdateEventCategory from "../../../hooks/admin/useUpdateEventCategory";
import useDeleteEventCategory from "../../../hooks/admin/useDeleteEventCategory";

import EventDialog from "./EventDialog";
import "./Event.scss";

const PAGE_SIZE = 10;

const Event = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  // Fetch event categories from the backend.
  const {
    categories,
    pagination,
    loading,
    error,
    refresh,
  } = useEventCategories({
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    status: statusFilter === "ALL" ? "" : statusFilter,
  });

  // CRUD hooks.
  const {
    addEventCategory,
    loading: creating,
    error: createError,
  } = useCreateEventCategory();

  const {
    editEventCategory,
    loading: updating,
    error: updateError,
  } = useUpdateEventCategory();

  const {
    removeEventCategory,
    loading: deleting,
    error: deleteError,
  } = useDeleteEventCategory();

  const isSaving = creating || updating;
  const isBusy = isSaving || deleting;

  const totalPages = Math.max(
    1,
    pagination.totalPages || 1
  );

  const totalCategories = pagination.total || 0;

  const startIndex =
    totalCategories === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE;

  const endIndex = Math.min(
    startIndex + categories.length,
    totalCategories
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // Keep the current page valid when records are removed.
  useEffect(() => {
    if (!loading && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [loading, currentPage, totalPages]);

  const openAddDialog = () => {
    setSelectedEvent(null);
    setDialogMode("add");
    setActionError("");
    setActionSuccess("");
    setDialogOpen(true);
  };

  const openEditDialog = (event) => {
    setSelectedEvent(event);
    setDialogMode("edit");
    setActionError("");
    setActionSuccess("");
    setDialogOpen(true);
  };

  const openDeleteDialog = (event) => {
    setSelectedEvent(event);
    setDialogMode("delete");
    setActionError("");
    setActionSuccess("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (isBusy) return;

    setDialogOpen(false);
    setSelectedEvent(null);
    setActionError("");
  };

  // Create or update an event category.
  const handleSaveEvent = async (formData) => {
    setActionError("");
    setActionSuccess("");

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status.toUpperCase(),
      };

      if (dialogMode === "edit") {
        if (!selectedEvent?._id) {
          throw new Error(
            "Event category ID is missing."
          );
        }

        await editEventCategory(
          selectedEvent._id,
          payload
        );

        setActionSuccess(
          "Event category updated successfully."
        );
      } else {
        await addEventCategory(payload);

        setActionSuccess(
          "Event category created successfully."
        );

        setCurrentPage(1);
      }

      setDialogOpen(false);
      setSelectedEvent(null);

      // Refresh immediately using the current query.
      await refresh();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to save event category.";

      setActionError(message);

      // Let the dialog display the error as well.
      throw err;
    }
  };

  // Delete an event category.
  const handleConfirmDelete = async (eventToDelete) => {
    if (!eventToDelete?._id) {
      const err = new Error(
        "Event category ID is missing."
      );

      setActionError(err.message);
      throw err;
    }

    setActionError("");
    setActionSuccess("");

    try {
      await removeEventCategory(eventToDelete._id);

      setDialogOpen(false);
      setSelectedEvent(null);

      setActionSuccess(
        "Event category deleted successfully."
      );

      // Move back if the deleted item was the last item
      // on the current page.
      const nextPage =
        categories.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;

      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
      } else {
        await refresh();
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to delete event category.";

      setActionError(message);
      throw err;
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
    <section className="event-management">
      {/* Header */}
      <div className="event-management__header">
        <div>
          <h2>Event Categories</h2>
          <p>
            Manage categories available for event bookings.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="event-management__toolbar">
        <label className="event-management__search">
          <Search size={19} aria-hidden="true" />

          <input
            type="search"
            placeholder="Search event categories..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search event categories"
          />

          {search && (
            <button
              type="button"
              className="event-management__clear-search"
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
          className="event-management__status-filter"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setCurrentPage(1);
          }}
          aria-label="Filter by status"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <button
          type="button"
          className="event-management__add-button"
          onClick={openAddDialog}
          disabled={isBusy}
        >
          <Plus size={19} />
          <span>Add Event</span>
        </button>

        <button
          type="button"
          className="event-management__icon-button"
          onClick={refresh}
          disabled={loading || isBusy}
          title="Refresh event categories"
          aria-label="Refresh event categories"
        >
          <RefreshCw
            size={17}
            className={
              loading ? "event-management__spin" : ""
            }
          />
        </button>
      </div>

      {/* Success message */}
      {actionSuccess && (
        <div
          className="event-management__success"
          role="status"
        >
          {actionSuccess}
        </div>
      )}

      {/* Error message */}
      {displayedError && (
        <div
          className="event-management__error"
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

      {/* Event categories table */}
      <div className="event-management__table-wrapper">
        <table className="event-management__table">
          <thead>
            <tr>
              <th className="event-management__number-column">
                #
              </th>
              <th>Event Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th className="event-management__actions-column">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <div className="event-management__empty">
                    <RefreshCw
                      size={20}
                      className="event-management__spin"
                    />
                    <strong>
                      Loading event categories...
                    </strong>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7}>
                  <div className="event-management__empty">
                    <strong>
                      Unable to load event categories
                    </strong>
                    <span>{error}</span>

                    <button
                      type="button"
                      className="event-management__add-button"
                      onClick={refresh}
                    >
                      Try Again
                    </button>
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="event-management__empty">
                    <strong>
                      No event categories found
                    </strong>

                    <span>
                      {debouncedSearch ||
                      statusFilter !== "ALL"
                        ? "Try changing your search or status filter."
                        : "Add your first event category to get started."}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((event, index) => {
                const normalizedStatus = (
                  event.status || "INACTIVE"
                ).toLowerCase();

                return (
                  <tr key={event._id}>
                    <td className="event-management__number-column">
                      {startIndex + index + 1}
                    </td>

                    <td className="event-management__name">
                      {event.name}
                    </td>

                    <td className="event-management__description">
                      {event.description || "—"}
                    </td>

                    <td>
                      <span
                        className={`event-management__status event-management__status--${normalizedStatus}`}
                      >
                        <span className="event-management__status-dot" />
                        {normalizedStatus === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>{formatDate(event.createdAt)}</td>

                    <td>{formatDate(event.updatedAt)}</td>

                    <td>
                      <div className="event-management__actions">
                        <button
                          type="button"
                          className="event-management__icon-button"
                          onClick={() => openEditDialog(event)}
                          disabled={isBusy}
                          aria-label={`Edit ${event.name}`}
                          title="Edit event"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className="event-management__icon-button event-management__icon-button--delete"
                          onClick={() => openDeleteDialog(event)}
                          disabled={isBusy}
                          aria-label={`Delete ${event.name}`}
                          title="Delete event"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="event-management__pagination">
        <span className="event-management__pagination-info">
          {loading
            ? "Loading event categories..."
            : totalCategories === 0
              ? "Showing 0 categories"
              : `Showing ${startIndex + 1}–${endIndex} of ${totalCategories} categories`}
        </span>

        <div className="event-management__pagination-controls">
          <button
            type="button"
            className="event-management__page-button"
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
              className={`event-management__page-button ${
                currentPage === page
                  ? "event-management__page-button--active"
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
            className="event-management__page-button"
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
      <EventDialog
        isOpen={dialogOpen}
        mode={dialogMode}
        eventData={selectedEvent}
        onClose={closeDialog}
        onSave={handleSaveEvent}
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

export default Event;
