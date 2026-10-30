
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  X,
  Clock,
  Users,
  IndianRupee,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Crown,
  ShieldCheck,
} from "lucide-react";

import useSubscriptions from "../../../hooks/admin/useSubscriptions";
import "./AdminSubscriptionSection.scss";

const PAGE_LIMIT = 10;

const AdminSubscriptionSection = () => {
  const {
    pendingPayments,
    paymentsLoading,
    submitting,
    paymentError,
    fetchPendingPayments,
    approvePayment,
    rejectPayment,
  } = useSubscriptions();

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
    totalPages: 0,
    hasNextPage: false,
  });

  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  /* ============================================================
     HELPERS
  ============================================================ */

  const formatPrice = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserName = (user) =>
    user?.name || user?.fullName || "Unknown User";

  const getUserPhone = (user) =>
    user?.phone || user?.phoneNumber || user?.mobile || "Phone unavailable";

  const getPlanName = (purchase) =>
    purchase?.planName ||
    purchase?.subscriptionId?.name ||
    "Subscription";

  const getDuration = (purchase) =>
    purchase?.durationMonths ||
    purchase?.subscriptionId?.durationMonths ||
    0;

  /* ============================================================
     FETCH PENDING REQUESTS
  ============================================================ */

  const loadPayments = useCallback(async () => {
    try {
      const result = await fetchPendingPayments({
        page,
        limit: PAGE_LIMIT,
      });

      setPagination(
        result?.pagination || {
          total: 0,
          page,
          limit: PAGE_LIMIT,
          totalPages: 0,
          hasNextPage: false,
        }
      );
    } catch {
      // Error is exposed by useSubscriptions.
    }
  }, [fetchPendingPayments, page]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  /* ============================================================
     SEARCH
  ============================================================ */

  const filteredPayments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return pendingPayments;

    return pendingPayments.filter((purchase) => {
      const userName = getUserName(purchase.userId).toLowerCase();
      const phone = getUserPhone(purchase.userId).toLowerCase();
      const planName = getPlanName(purchase).toLowerCase();

      return (
        userName.includes(searchValue) ||
        phone.includes(searchValue) ||
        planName.includes(searchValue)
      );
    });
  }, [pendingPayments, search]);

  /* ============================================================
     KPI DATA
  ============================================================ */

  const pendingAmount = useMemo(
    () =>
      pendingPayments.reduce(
        (total, purchase) => total + Number(purchase.amount || 0),
        0
      ),
    [pendingPayments]
  );

  /* ============================================================
     APPROVE PAYMENT
  ============================================================ */

  const handleApprove = async (purchase) => {
    const confirmed = window.confirm(
      `Have you verified the UPI payment of ${formatPrice(
        purchase.amount,
        purchase.currency
      )} from ${getUserName(purchase.userId)}?`
    );

    if (!confirmed) return;

    setActionId(purchase._id);
    setSuccessMessage("");

    try {
      await approvePayment(purchase._id);

      setSuccessMessage("Subscription payment approved successfully.");

      await loadPayments();
    } catch {
      // Error is exposed by useSubscriptions.
    } finally {
      setActionId(null);
    }
  };

  /* ============================================================
     REJECT PAYMENT
  ============================================================ */

  const handleReject = async (purchase) => {
    const rejectionReason = window.prompt(
      `Enter the reason for declining ${getUserName(
        purchase.userId
      )}'s subscription payment:`
    );

    if (rejectionReason === null) return;

    if (!rejectionReason.trim()) {
      window.alert("Please provide a rejection reason.");
      return;
    }

    setActionId(purchase._id);
    setSuccessMessage("");

    try {
      await rejectPayment(
        purchase._id,
        rejectionReason.trim()
      );

      setSuccessMessage("Subscription payment declined successfully.");

      await loadPayments();
    } catch {
      // Error is exposed by useSubscriptions.
    } finally {
      setActionId(null);
    }
  };

  /* ============================================================
     REFRESH
  ============================================================ */

  const handleRefresh = async () => {
    setSuccessMessage("");
    await loadPayments();
  };

  /* ============================================================
     PAGINATION
  ============================================================ */

  const handlePrevious = () => {
    if (page > 1) {
      setPage((previous) => previous - 1);
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage) {
      setPage((previous) => previous + 1);
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="admin-subscription">
      {/* HEADER */}

      <div className="admin-subscription-header">
        <div>
          <div className="admin-breadcrumb">
            Dashboard <ChevronRight size={15} />
            <strong>Subscription Approvals</strong>
          </div>

          <h1>Subscription Approvals</h1>

          <p>
            Verify user payments and approve or decline subscription
            requests.
          </p>
        </div>

        <div className="admin-date">
          <Clock size={15} />
          {new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {/* KPI CARDS */}

      <div className="subscription-kpi-grid">
        <div className="subscription-kpi-card">
          <div className="kpi-icon orange">
            <Clock size={23} />
          </div>

          <div>
            <span>Pending Approval</span>
            <strong>{pagination.total}</strong>
            <small>Awaiting verification</small>
          </div>
        </div>

        <div className="subscription-kpi-card">
          <div className="kpi-icon green">
            <Users size={23} />
          </div>

          <div>
            <span>Requests on Page</span>
            <strong>{pendingPayments.length}</strong>
            <small>Currently displayed</small>
          </div>
        </div>

        <div className="subscription-kpi-card">
          <div className="kpi-icon blue">
            <ShieldCheck size={23} />
          </div>

          <div>
            <span>Payment Method</span>
            <strong>UPI</strong>
            <small>Manual verification</small>
          </div>
        </div>

        <div className="subscription-kpi-card">
          <div className="kpi-icon purple">
            <IndianRupee size={23} />
          </div>

          <div>
            <span>Amount on This Page</span>
            <strong>{formatPrice(pendingAmount)}</strong>
            <small>Current page total</small>
          </div>
        </div>
      </div>

      {/* PAYMENT REQUEST TABLE */}

      <section className="subscription-requests-panel">
        <div className="subscription-panel-header">
          <div>
            <h2>Subscription Payment Requests</h2>
            <p>
              Review user UPI payments and approve or decline to
              activate subscriptions.
            </p>
          </div>

          <div className="subscription-table-controls">
            <div className="subscription-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search by name, phone or plan..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <button
              type="button"
              className="subscription-refresh-btn"
              onClick={handleRefresh}
              disabled={paymentsLoading}
              title="Refresh requests"
            >
              <RefreshCw
                size={17}
                className={paymentsLoading ? "spinning" : ""}
              />
            </button>

            <button
              type="button"
              className="subscription-filter-btn"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              <Filter size={17} />
              Clear
            </button>
          </div>
        </div>

        {/* MESSAGES */}

        {paymentError && (
          <div className="subscription-alert error">
            {paymentError}
          </div>
        )}

        {successMessage && (
          <div className="subscription-alert success">
            <Check size={16} />
            {successMessage}
          </div>
        )}

        {/* TABLE */}

        <div className="subscription-table-wrapper">
          <table className="subscription-approval-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paymentsLoading ? (
                <tr>
                  <td colSpan="8" className="table-message">
                    Loading payment requests...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="table-message">
                    {search
                      ? "No matching payment requests found."
                      : "No pending subscription payment requests."}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((purchase, index) => {
                  const isProcessing = actionId === purchase._id;

                  return (
                    <tr key={purchase._id}>
                      <td>
                        {(page - 1) * PAGE_LIMIT + index + 1}
                      </td>

                      <td>
                        <div className="subscription-user-cell">
                          <div className="subscription-user-avatar">
                            {getUserName(purchase.userId)
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {getUserName(purchase.userId)}
                            </strong>
                            <small>
                              {getUserPhone(purchase.userId)}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="subscription-plan-cell">
                          <Crown size={16} />
                          <div>
                            <strong>{getPlanName(purchase)}</strong>
                            <small>
                              {getDuration(purchase)} Months
                            </small>
                          </div>
                        </div>
                      </td>

                      <td className="subscription-amount">
                        {formatPrice(
                          purchase.amount,
                          purchase.currency
                        )}
                      </td>

                      <td>
                        <span className="payment-method-label">
                          {purchase.payment?.method?.toUpperCase() ||
                            "UPI"}
                        </span>
                      </td>

                      <td>
                        {formatDate(purchase.payment?.submittedAt)}
                      </td>

                      <td>
                        <span className="subscription-status pending">
                          <span />
                          Pending
                        </span>
                      </td>

                      <td>
                        <div className="subscription-action-buttons">
                          <button
                            type="button"
                            className="approve-payment-btn"
                            onClick={() => handleApprove(purchase)}
                            disabled={submitting || isProcessing}
                          >
                            <Check size={15} />
                            {isProcessing ? "Processing..." : "Approve"}
                          </button>

                          <button
                            type="button"
                            className="reject-payment-btn"
                            onClick={() => handleReject(purchase)}
                            disabled={submitting || isProcessing}
                          >
                            <X size={15} />
                            Decline
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

        {/* PAGINATION */}

        <div className="subscription-table-footer">
          <span>
            Showing{" "}
            {pagination.total === 0
              ? 0
              : (page - 1) * PAGE_LIMIT + 1}{" "}
            to{" "}
            {Math.min(page * PAGE_LIMIT, pagination.total)} of{" "}
            {pagination.total} requests
          </span>

          <div className="subscription-pagination">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={page <= 1 || paymentsLoading}
            >
              <ChevronLeft size={18} />
            </button>

            <span>{page}</span>

            <button
              type="button"
              onClick={handleNext}
              disabled={!pagination.hasNextPage || paymentsLoading}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSubscriptionSection;
