
import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import useSubscriptions from "../../../../hooks/admin/useSubscriptions";
import SubscriptionDialog from "./SubscriptionDialog";
import "./Subscription.scss";

const Subscription = () => {
  const {
    subscriptions,
    loading,
    submitting,
    error,
    fetchSubscriptions,
    create,
    update,
    remove,
  } = useSubscriptions();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedSubscription, setSelectedSubscription] =
    useState(null);

  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [deleting, setDeleting] = useState(false);

  const isBusy = submitting || deleting;

  const filteredSubscriptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return subscriptions.filter((subscription) => {
      const matchesSearch =
        !normalizedSearch ||
        subscription.name?.toLowerCase().includes(normalizedSearch) ||
        subscription.description
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && subscription.isActive) ||
        (statusFilter === "inactive" && !subscription.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const activeCount = subscriptions.filter(
    (subscription) => subscription.isActive
  ).length;

  const openAddDialog = () => {
    setSelectedSubscription(null);
    setDialogMode("add");
    setActionError("");
    setActionSuccess("");
    setDialogOpen(true);
  };

  const openEditDialog = (subscription) => {
    setSelectedSubscription(subscription);
    setDialogMode("edit");
    setActionError("");
    setActionSuccess("");
    setDialogOpen(true);
  };

  const openDeleteDialog = (subscription) => {
    setSelectedSubscription(subscription);
    setDialogMode("delete");
    setActionError("");
    setActionSuccess("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (isBusy) return;

    setDialogOpen(false);
    setSelectedSubscription(null);
    setActionError("");
  };

  const handleSaveSubscription = async (formData) => {
    setActionError("");
    setActionSuccess("");

    try {
      if (dialogMode === "edit") {
        if (!selectedSubscription?._id) {
          throw new Error("Subscription ID is missing.");
        }

        await update(selectedSubscription._id, formData);
        setActionSuccess("Subscription updated successfully.");
      } else {
        await create(formData);
        setActionSuccess("Subscription created successfully.");
      }

      setDialogOpen(false);
      setSelectedSubscription(null);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save subscription."
      );
    }
  };

  const handleConfirmDelete = async (subscription) => {
    if (!subscription?._id) {
      setActionError("Subscription ID is missing.");
      return;
    }

    setActionError("");
    setActionSuccess("");
    setDeleting(true);

    try {
      await remove(subscription._id);

      setDialogOpen(false);
      setSelectedSubscription(null);
      setActionSuccess("Subscription deleted successfully.");
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete subscription."
      );
    } finally {
      setDeleting(false);
    }
  };

  const displayedError = actionError || error;

  return (
    <section className="subscription-management">
      {/* Header */}
      <div className="subscription-management__header">
        <div>
          <h2>Subscriptions</h2>
          <p>
            Manage subscription plans, pricing, benefits, and
            availability on your website.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="subscription-management__summary">
        <div className="subscription-management__summary-card">
          <span className="subscription-management__summary-icon">
            <CreditCard size={20} />
          </span>
          <div>
            <span>Total Plans</span>
            <strong>{subscriptions.length}</strong>
          </div>
        </div>

        <div className="subscription-management__summary-card">
          <span className="subscription-management__summary-icon subscription-management__summary-icon--active">
            <CheckCircle2 size={20} />
          </span>
          <div>
            <span>Active Plans</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="subscription-management__summary-card">
          <span className="subscription-management__summary-icon subscription-management__summary-icon--inactive">
            <XCircle size={20} />
          </span>
          <div>
            <span>Inactive Plans</span>
            <strong>{subscriptions.length - activeCount}</strong>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="subscription-management__toolbar">
        <label className="subscription-management__search">
          <Search size={19} aria-hidden="true" />

          <input
            type="search"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search subscriptions"
          />

          {search && (
            <button
              type="button"
              className="subscription-management__clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <select
          className="subscription-management__status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter subscriptions by status"
        >
          <option value="all">All Plans</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="button"
          className="subscription-management__add-button"
          onClick={openAddDialog}
          disabled={isBusy}
        >
          <Plus size={19} />
          <span>Add Subscription</span>
        </button>

        <button
          type="button"
          className="subscription-management__icon-button"
          onClick={fetchSubscriptions}
          disabled={loading || isBusy}
          title="Refresh subscriptions"
          aria-label="Refresh subscriptions"
        >
          <RefreshCw
            size={17}
            className={
              loading ? "subscription-management__spin" : ""
            }
          />
        </button>
      </div>

      {/* Success */}
      {actionSuccess && (
        <div
          className="subscription-management__success"
          role="status"
        >
          {actionSuccess}
        </div>
      )}

      {/* Error */}
      {displayedError && (
        <div
          className="subscription-management__error"
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

      {/* Table */}
      <div className="subscription-management__table-wrapper">
        <table className="subscription-management__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Plan</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Original Price</th>
              <th>Benefits</th>
              <th>Popularity</th>
              <th>Status</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10}>
                  <div className="subscription-management__empty">
                    <RefreshCw size={20} />
                    <strong>Loading subscriptions...</strong>
                  </div>
                </td>
              </tr>
            ) : error && subscriptions.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <div className="subscription-management__empty">
                    <strong>Unable to load subscriptions</strong>
                    <span>{error}</span>

                    <button
                      type="button"
                      className="subscription-management__add-button"
                      onClick={fetchSubscriptions}
                    >
                      Try Again
                    </button>
                  </div>
                </td>
              </tr>
            ) : filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <div className="subscription-management__empty">
                    <strong>No subscriptions found</strong>
                    <span>
                      {search || statusFilter !== "all"
                        ? "Try changing your search or status filter."
                        : "Create your first subscription to get started."}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((subscription, index) => (
                <tr key={subscription._id}>
                  <td>{index + 1}</td>

                  <td className="subscription-management__name">
                    <div>
                      <strong>{subscription.name}</strong>
                      {subscription.description && (
                        <span>{subscription.description}</span>
                      )}
                    </div>
                  </td>

                  <td>
                    {subscription.durationMonths}{" "}
                    {subscription.durationMonths === 1
                      ? "month"
                      : "months"}
                  </td>

                  <td className="subscription-management__price">
                    {formatCurrency(
                      subscription.price,
                      subscription.currency
                    )}
                  </td>

                  <td>
                    {formatCurrency(
                      subscription.originalPrice,
                      subscription.currency
                    )}
                  </td>

                  <td>
                    {subscription.benefits?.length || 0}
                  </td>

                  <td>
                    <span
                      className={`subscription-management__badge ${
                        subscription.isPopular
                          ? "subscription-management__badge--popular"
                          : "subscription-management__badge--neutral"
                      }`}
                    >
                      {subscription.isPopular
                        ? "Popular"
                        : "Standard"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`subscription-management__badge ${
                        subscription.isActive
                          ? "subscription-management__badge--active"
                          : "subscription-management__badge--inactive"
                      }`}
                    >
                      {subscription.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>{subscription.displayOrder ?? 0}</td>

                  <td>
                    <div className="subscription-management__actions">
                      <button
                        type="button"
                        className="subscription-management__icon-button"
                        onClick={() => openEditDialog(subscription)}
                        disabled={isBusy}
                        aria-label={`Edit ${subscription.name}`}
                        title="Edit subscription"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        className="subscription-management__icon-button subscription-management__icon-button--delete"
                        onClick={() => openDeleteDialog(subscription)}
                        disabled={isBusy}
                        aria-label={`Delete ${subscription.name}`}
                        title="Delete subscription"
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

      {/* Results count */}
      <div className="subscription-management__footer">
        Showing {filteredSubscriptions.length} of{" "}
        {subscriptions.length} subscriptions
      </div>

      {/* Add, edit, and delete dialog */}
      <SubscriptionDialog
        isOpen={dialogOpen}
        mode={dialogMode}
        subscriptionData={selectedSubscription}
        onClose={closeDialog}
        onSave={handleSaveSubscription}
        onConfirmDelete={handleConfirmDelete}
        saving={submitting}
        deleting={deleting}
      />
    </section>
  );
};

function formatCurrency(value, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  } catch {
    return `₹${Number(value) || 0}`;
  }
}

export default Subscription;
