import { useEffect, useMemo, useState } from "react";
import {  Search,  ClipboardList,  Clock3,  CircleCheckBig,  XCircle,  Eye,  X,} from "lucide-react";
import useBarberOrders from "../../../hooks/barber/useBarberOrders";
import BarberOrderCard from "../../../components/barber/BarberOrderCard/BarberOrderCard";
import {  getMyProfile,  toggleAutoConfirm,} from "../../../services/api";

import "./BarberOrderSection.scss";

const ORDERS_PER_PAGE = 5;

const BarberOrderSection = () => {
  const { orders = [], loading } = useBarberOrders();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [autoConfirmEnabled, setAutoConfirmEnabled] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Fetch barber profile and auto-confirm setting
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();

        setAutoConfirmEnabled(
          Boolean(res.data?.data?.autoConfirmOrders)
        );
      } catch (err) {
        console.error("Failed to fetch barber profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // Close order details with Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedOrder(null);
      }
    };

    if (selectedOrder) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedOrder]);

  // Toggle auto-confirm
  const handleToggleAutoConfirm = async () => {
    try {
      setToggleLoading(true);
      const updated = !autoConfirmEnabled;
      await toggleAutoConfirm(updated);

      setAutoConfirmEnabled(updated);
    } catch (err) {
      alert(err.response?.data?.message ||"Failed to update auto confirm");
    } finally {
      setToggleLoading(false);
    }
  };

  // Customer name fallback
  const getCustomerName = (order) => {
    return ( order.deliveryAddress?.fullName || order.userId?.name || order.userId?.fullName || "Unknown customer"
    );
  };

  // Order price formatting
  const formatPrice = (amount) => {
    const price = Number(amount);

    if (!Number.isFinite(price)) {
      return "₹0";
    }

    return `₹${price.toLocaleString("en-IN")}`;
  };

  // KPI values
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const confirmedOrders = orders.filter((order) => order.status === "CONFIRMED").length;
  const cancelledOrders = orders.filter((order) => order.status === "CANCELLED").length;

  // Search and status filtering
  const filteredOrders = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName = (order.deliveryAddress?.fullName ||order.userId?.name ||order.userId?.fullName ||"").toLowerCase();
      const orderId = String(order._id || "").toLowerCase();
      const matchesSearch = customerName.includes(searchTerm) || orderId.includes(searchTerm);
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE  );
  const indexOfLast = currentPage * ORDERS_PER_PAGE;
  const indexOfFirst = indexOfLast - ORDERS_PER_PAGE;

  const currentOrders = filteredOrders.slice(indexOfFirst,indexOfLast);

  // Reset pagination when search/filter changes
  useEffect(() => {setCurrentPage(1);}, [search, statusFilter]);

  // Keep the page within the available range
  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Format status labels
  const formatStatus = (status = "UNKNOWN") =>
    status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  // Format booking date
  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {day: "2-digit",month: "short",year: "numeric",});
  };

  if (loading) {
    return (
      <section className="barber-order-section">
        <p className="orders-loading">Loading orders...</p>
      </section>
    );
  }

  return (
    <section className="barber-order-section">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2>Orders</h2>
          <p>
            Manage incoming appointments and customer bookings.
          </p>
        </div>

        <div className="auto-confirm-toggle">
          <span>Auto Confirm</span>

          <button
            type="button"
            className={
              autoConfirmEnabled? "toggle-btn active": "toggle-btn"}
            disabled={toggleLoading}
            onClick={handleToggleAutoConfirm}>
            {toggleLoading? "Updating...": autoConfirmEnabled? "ON": "OFF"}
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <ClipboardList size={24} />
          <div>
            <span>Total Orders</span>
            <h3>{totalOrders}</h3>
          </div>
        </div>

        <div className="stat-card">
          <Clock3 size={24} />
          <div>
            <span>Pending</span>
            <h3>{pendingOrders}</h3>
          </div>
        </div>

        <div className="stat-card">
          <CircleCheckBig size={24} />
          <div>
            <span>Confirmed</span>
            <h3>{confirmedOrders}</h3>
          </div>
        </div>

        <div className="stat-card">
          <XCircle size={24} />
          <div>
            <span>Cancelled</span>
            <h3>{cancelledOrders}</h3>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>setStatusFilter(event.target.value)}
          aria-label="Filter orders by status"
        >
          <option value="ALL">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* ORDERS TABLE */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={48} />
          <h3>No Orders Found</h3>

          <p>
            {orders.length === 0? "You haven't received any customer bookings yet.": "No orders match your current search or filter."}
          </p>
        </div>
      ) : (
        <>
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Booking Date</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentOrders.map((order) => {
                  const customerName = getCustomerName(order);

                  return (
                    <tr key={order._id}>
                      {/* ORDER ID */}
                      <td>
                        <span className="order-id">
                          #
                          {String(order._id)
                            .slice(-8)
                            .toUpperCase()}
                        </span>
                      </td>

                      {/* CUSTOMER */}
                      <td>
                        <div className="customer-cell">
                          <span className="customer-avatar">
                            {customerName.charAt(0).toUpperCase()}
                          </span>

                          <span>{customerName}</span>
                        </div>
                      </td>

                      {/* BOOKING DATE */}
                      <td>
                        {formatDate(order.scheduledAt || order.createdAt)}
                      </td>

                      {/* PRICE */}
                      <td>
                        <span className="order-price">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`order-status status-${(order.status || "unknown").toLowerCase()}`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td>
                        <button
                          type="button"
                          className="view-order-btn"
                          onClick={() =>setSelectedOrder(order)}aria-label={`View order ${String(order._id).slice(-8)}`}>
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination">
              <button type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((previous) => previous - 1)}>
                Previous
              </button>

              <div className="page-info">
                <span>
                  Page <strong>{currentPage}</strong> of{" "}
                  <strong>{totalPages}</strong>
                </span>

                <small>
                  Showing {indexOfFirst + 1}–
                  {Math.min(indexOfLast,filteredOrders.length)}{" "}of {filteredOrders.length} orders
                </small>
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((previous) => previous + 1)
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* ORDER DETAILS DIALOG */}
      {selectedOrder && (
        <div
          className="order-dialog-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <div className="order-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Order details"
          >
            <div className="order-dialog-header">
              <div>
                <h3>Order Details</h3>

                <p>
                  Order #
                  {String(selectedOrder._id).slice(-8).toUpperCase()}
                </p>
              </div>

              <button
                type="button"
                className="close-order-dialog"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="order-dialog-content">
              <BarberOrderCard order={selectedOrder} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BarberOrderSection;
