import { useMemo, useState, useEffect } from "react";

import { ShoppingBag, Clock3, Activity, CheckCircle2, XCircle, Search, RefreshCw, ChevronLeft, ChevronRight,
  IndianRupee, Eye, Trash2, Users, Scissors, AlertCircle,} from "lucide-react";

import useAdminOrders from "../../../hooks/admin/useAdminOrders";
import useAdminOrderStats from "../../../hooks/admin/useAdminOrderStats";
import useDeleteAdminOrder from "../../../hooks/admin/useDeleteAdminOrder";

import OrderSidebar from "../../../components/organisms/OrderSidebar/OrderSidebar";

import "./AdminOrderSection.scss";

const ORDERS_PER_PAGE = 5;

const STATUS_CONFIG = {
  PENDING: { label: "Pending", className: "pending" },
  CONFIRMED: { label: "Confirmed", className: "confirmed" },
  IN_PROGRESS: { label: "In Progress", className: "in-progress" },
  COMPLETED: { label: "Completed", className: "completed" },
  CANCELLED: { label: "Cancelled", className: "cancelled" },
};

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatus = (status) =>
  STATUS_CONFIG[status] || {
    label: status || "Unknown",
    className: "unknown",
  };

const getOrderId = (order) => order.orderId || order._id || "";

const getCustomerName = (order) =>
  order.userName ||
  order.userId?.name ||
  order.userId?.fullName ||
  order.deliveryAddress?.fullName ||
  "N/A";

const getBarberName = (order) =>
  order.barberName ||
  order.barberId?.userId?.name ||
  order.barberId?.userId?.fullName ||
  order.barberId?.name ||
  "N/A";

const getServiceNames = (order) => {
  if (Array.isArray(order.services)) {
    return (
      order.services
        .map((service) =>
          typeof service === "string" ? service : service?.title
        )
        .filter(Boolean)
        .join(", ") || "N/A"
    );
  }

  return order.services || "N/A";
};

const getStatValue = (stats, keys, fallback) => {
  for (const key of keys) {
    const value = stats?.[key];

    if (value !== undefined && value !== null && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }

  return fallback;
};

const AdminOrderSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Paginated order list.
  const {
    orders = [],
    loading,
    error,
    totalOrders = 0,
    totalPages = 0,
    refresh: refreshOrders,
  } = useAdminOrders(currentPage, ORDERS_PER_PAGE);

  // Independent order statistics.
  const {
    stats = {},
    loading: statsLoading,
    error: statsError,
    refresh: refreshStats,
  } = useAdminOrderStats();

  // Delete order action.
  const {
    removeOrder,
    loading: deleting,
    error: hookDeleteError,
  } = useDeleteAdminOrder();

  // Keep the selected sidebar order synchronized with refreshed data.
  useEffect(() => {
    if (!selectedOrder) return;

    const selectedId = String(getOrderId(selectedOrder));

    const updatedOrder = orders.find(
      (order) => String(getOrderId(order)) === selectedId
    );

    setSelectedOrder(updatedOrder || null);
  }, [orders]);

  const statusCounts = useMemo(
    () =>
      orders.reduce(
        (counts, order) => {
          if (
            Object.prototype.hasOwnProperty.call(counts, order.status)
          ) {
            counts[order.status] += 1;
          }

          return counts;
        },
        {
          PENDING: 0,
          CONFIRMED: 0,
          IN_PROGRESS: 0,
          COMPLETED: 0,
          CANCELLED: 0,
        }
      ),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      const searchableFields = [
        getOrderId(order),
        getCustomerName(order),
        getBarberName(order),
        getServiceNames(order),
        order.status,
        order.amount,
        order.totalAmount,
      ];

      const matchesSearch =
        !query ||
        searchableFields.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  const pageStart =
    totalOrders === 0 ? 0 : (currentPage - 1) * ORDERS_PER_PAGE + 1;

  const pageEnd = Math.min(
    currentPage * ORDERS_PER_PAGE,
    totalOrders
  );

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage ||
      loading
    ) {
      return;
    }

    setCurrentPage(page);
  };

  const handleRefresh = async () => {
    await Promise.allSettled([refreshOrders(), refreshStats()]);
  };

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleDeleteOrder = async (order) => {
    const orderId = getOrderId(order);

    if (!orderId || deleting) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete order ${orderId}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleteError("");

    try {
      await removeOrder(orderId);

      if (
        selectedOrder &&
        String(getOrderId(selectedOrder)) === String(orderId)
      ) {
        setSelectedOrder(null);
      }

      // Refresh the current list and the statistics after deletion.
      const results = await Promise.allSettled([
        refreshOrders(),
        refreshStats(),
      ]);

      // If the last item on a page was deleted, return to the previous page.
      if (
        results[0]?.status === "fulfilled" &&
        orders.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage((page) => page - 1);
      }
    } catch (err) {
      setDeleteError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete the order."
      );
    }
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );
  }, [currentPage, totalPages]);

  // Prefer statistics from the stats API; fall back to current-page counts.
  const displayedTotalOrders = getStatValue(
    stats,
    ["totalOrders", "total", "ordersCount"],
    totalOrders
  );

  const displayedPending = getStatValue(
    stats,
    ["pendingOrders", "pending", "totalPending"],
    statusCounts.PENDING
  );

  const displayedInProgress = getStatValue(
    stats,
    ["inProgressOrders", "inProgress", "totalInProgress"],
    statusCounts.IN_PROGRESS
  );

  const displayedCompleted = getStatValue(
    stats,
    ["completedOrders", "completed", "totalCompleted"],
    statusCounts.COMPLETED
  );

  const displayedCancelled = getStatValue(
    stats,
    ["cancelledOrders", "canceledOrders", "cancelled", "canceled"],
    statusCounts.CANCELLED
  );

  return (
    <section className="admin-order-section">
      {/* PAGE HEADER */}
      <header className="admin-order-hero">
        <div className="admin-order-hero__content">
          <span className="admin-order-hero__eyebrow">
            <ShoppingBag size={15} />
            ORDER MANAGEMENT
          </span>

          <h1>Orders Management</h1>

          <p>
            View customer orders, track their status, and review barber
            service bookings.
          </p>
        </div>

        <div className="admin-order-hero__illustration">
          <ShoppingBag size={43} />
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="admin-order-kpis">
        <article className="admin-order-kpi admin-order-kpi--lavender">
          <div className="admin-order-kpi__icon">
            <ShoppingBag size={22} />
          </div>

          <div className="admin-order-kpi__content">
            <span>Total Orders</span>
            <strong>
              {statsLoading && totalOrders === 0
                ? "..."
                : displayedTotalOrders.toLocaleString("en-IN")}
            </strong>
            <small>All orders in the database</small>
          </div>
        </article>

        <article className="admin-order-kpi admin-order-kpi--orange">
          <div className="admin-order-kpi__icon">
            <Clock3 size={22} />
          </div>

          <div className="admin-order-kpi__content">
            <span>Pending</span>
            <strong>
              {statsLoading && orders.length === 0
                ? "..."
                : displayedPending.toLocaleString("en-IN")}
            </strong>
            <small>
              {statsError ? "Current page count" : "Order statistics"}
            </small>
          </div>
        </article>

        <article className="admin-order-kpi admin-order-kpi--blue">
          <div className="admin-order-kpi__icon">
            <Activity size={22} />
          </div>

          <div className="admin-order-kpi__content">
            <span>In Progress</span>
            <strong>
              {statsLoading && orders.length === 0
                ? "..."
                : displayedInProgress.toLocaleString("en-IN")}
            </strong>
            <small>
              {statsError ? "Current page count" : "Order statistics"}
            </small>
          </div>
        </article>

        <article className="admin-order-kpi admin-order-kpi--green">
          <div className="admin-order-kpi__icon">
            <CheckCircle2 size={22} />
          </div>

          <div className="admin-order-kpi__content">
            <span>Completed</span>
            <strong>
              {statsLoading && orders.length === 0
                ? "..."
                : displayedCompleted.toLocaleString("en-IN")}
            </strong>
            <small>
              {statsError ? "Current page count" : "Order statistics"}
            </small>
          </div>
        </article>

        <article className="admin-order-kpi admin-order-kpi--rose">
          <div className="admin-order-kpi__icon">
            <XCircle size={22} />
          </div>

          <div className="admin-order-kpi__content">
            <span>Cancelled</span>
            <strong>
              {statsLoading && orders.length === 0
                ? "..."
                : displayedCancelled.toLocaleString("en-IN")}
            </strong>
            <small>
              {statsError ? "Current page count" : "Order statistics"}
            </small>
          </div>
        </article>
      </div>

      {/* ORDERS TABLE PANEL */}
      <div className="admin-order-panel">
        <div className="admin-order-panel__heading">
          <div>
            <h2>All Orders</h2>
            <p>
              Review orders and open a record to see its details.
            </p>
          </div>

          <button
            type="button"
            className="admin-order-refresh"
            onClick={handleRefresh}
            disabled={loading || statsLoading}
          >
            <RefreshCw
              size={16}
              className={
                loading || statsLoading
                  ? "admin-order-refresh__spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="admin-order-toolbar">
          <label className="admin-order-search">
            <Search size={18} />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search customer, barber, order ID or service..."
              aria-label="Search orders on the current page"
            />
          </label>

          <label className="admin-order-filter">
            <span className="admin-order-filter__label">Status</span>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter orders by status"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>
        </div>

        <div className="admin-order-results">
          <span>
            Showing <strong>{filteredOrders.length}</strong> matching
            orders on this page
          </span>

          <span>
            Page <strong>{currentPage}</strong>
            {totalPages > 0 && (
              <>
                {" "}of <strong>{totalPages}</strong>
              </>
            )}
          </span>
        </div>

        {/* DELETE ERROR */}
        {(deleteError || hookDeleteError) && (
          <div
            className="admin-order-state admin-order-state--error"
            role="alert"
          >
            <p>{deleteError || hookDeleteError}</p>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="admin-order-state">
            <div className="admin-order-state__spinner" />
            <h3>Loading orders</h3>
            <p>Fetching order records from the server.</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="admin-order-state admin-order-state--error">
            <span className="admin-order-state__icon">
              <AlertCircle size={28} />
            </span>

            <h3>Unable to load orders</h3>
            <p>{error}</p>

            <button
              type="button"
              className="admin-order-primary-button"
              onClick={handleRefresh}
            >
              Try again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="admin-order-state">
            <span className="admin-order-state__icon">
              <ShoppingBag size={28} />
            </span>

            <h3>
              {orders.length === 0
                ? "No orders found"
                : "No matching orders"}
            </h3>

            <p>
              {orders.length === 0
                ? "Order records will appear here when available."
                : "Try a different search term or status filter."}
            </p>

            {(searchTerm || statusFilter !== "ALL") && (
              <button
                type="button"
                className="admin-order-primary-button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ORDERS TABLE */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="admin-order-table-wrapper">
            <table className="admin-order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Barber</th>
                  <th>Services</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order, index) => {
                  const orderId = getOrderId(order);
                  const status = getStatus(order.status);
                  const createdAt = order.createdAt;

                  return (
                    <tr
                      key={orderId || index}
                      onDoubleClick={() => handleOpenOrder(order)}
                    >
                      <td>
                        <span
                          className="admin-order-id"
                          title={String(orderId)}
                        >
                          #
                          {String(orderId).slice(-8).toUpperCase() ||
                            "N/A"}
                        </span>
                      </td>

                      <td>
                        <div className="admin-order-person">
                          <span className="admin-order-person__avatar admin-order-person__avatar--customer">
                            <Users size={15} />
                          </span>

                          <span className="admin-order-person__name">
                            {getCustomerName(order)}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-order-person">
                          <span className="admin-order-person__avatar admin-order-person__avatar--barber">
                            <Scissors size={15} />
                          </span>

                          <span className="admin-order-person__name">
                            {getBarberName(order)}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className="admin-order-services"
                          title={getServiceNames(order)}
                        >
                          {getServiceNames(order)}
                        </span>
                      </td>

                      <td>
                        <strong className="admin-order-amount">
                          <IndianRupee size={13} />
                          {Number(
                            order.amount ?? order.totalAmount ?? 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`admin-order-status admin-order-status--${status.className}`}
                        >
                          <span className="admin-order-status__dot" />
                          {status.label}
                        </span>
                      </td>

                      <td>
                        <div className="admin-order-date">
                          <span>{formatDate(createdAt)}</span>
                          <small>{formatTime(createdAt)}</small>
                        </div>
                      </td>

                      <td>
                        <div className="admin-order-actions">
                          <button
                            type="button"
                            className="admin-order-view-button"
                            onClick={() => handleOpenOrder(order)}
                            aria-label={`View order ${orderId}`}
                            title="View order details"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="admin-order-delete-button"
                            onClick={() => handleDeleteOrder(order)}
                            disabled={deleting}
                            aria-label={`Delete order ${orderId}`}
                            title="Delete order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && !error && totalOrders > 0 && (
          <footer className="admin-order-pagination">
            <span className="admin-order-pagination__summary">
              Showing <strong>{pageStart}</strong>–
              <strong>{pageEnd}</strong> of{" "}
              <strong>{totalOrders}</strong> orders
            </span>

            <div className="admin-order-pagination__controls">
              <button
                type="button"
                className="admin-order-pagination__arrow"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
                aria-label="Previous page"
              >
                <ChevronLeft size={17} />
              </button>

              {pageNumbers.map((page) => (
                <button
                  type="button"
                  key={page}
                  className={`admin-order-pagination__number ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => goToPage(page)}
                  disabled={loading}
                  aria-current={
                    currentPage === page ? "page" : undefined
                  }
                >
                  {page}
                </button>
              ))}

              {totalPages > 5 &&
                pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    <span className="admin-order-pagination__ellipsis">
                      …
                    </span>

                    <button
                      type="button"
                      className="admin-order-pagination__number"
                      onClick={() => goToPage(totalPages)}
                      disabled={loading}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

              <button
                type="button"
                className="admin-order-pagination__arrow"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}
                aria-label="Next page"
              >
                <ChevronRight size={17} />
              </button>
            </div>

            <span className="admin-order-pagination__limit">
              5 per page
            </span>
          </footer>
        )}
      </div>

      {/* ORDER DETAILS SIDEBAR */}
      <OrderSidebar
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </section>
  );
};

export default AdminOrderSection;
