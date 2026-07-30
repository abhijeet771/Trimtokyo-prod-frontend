import { useEffect, useMemo, useState } from "react";
import {  Search,  ClipboardList,  Clock3,  CircleCheckBig,  XCircle,} from "lucide-react";
import useBarberOrders from "../../hooks/useBarberOrders";
import BarberOrderCard from "../../components/molecules/BarberOrderCard/BarberOrderCard";
import {  getMyProfile,  toggleAutoConfirm,} from "../../services/api";

import "./BarberOrderSection.scss";

const ORDERS_PER_PAGE = 4;

const BarberOrderSection = () => {
  const { orders, loading } =
    useBarberOrders();

  /* ====================================================== */
  /* PAGINATION                                              */
  /* ====================================================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  /* ====================================================== */
  /* SEARCH + FILTER                                         */
  /* ====================================================== */

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  /* ====================================================== */
  /* AUTO CONFIRM                                            */
  /* ====================================================== */

  const [
    autoConfirmEnabled,
    setAutoConfirmEnabled,
  ] = useState(false);

  const [
    toggleLoading,
    setToggleLoading,
  ] = useState(false);

  /* ====================================================== */
  /* FETCH PROFILE                                            */
  /* ====================================================== */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res =
          await getMyProfile();

        setAutoConfirmEnabled(
          res.data.data
            ?.autoConfirmOrders || false
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  /* ====================================================== */
  /* AUTO CONFIRM                                            */
  /* ====================================================== */

  const handleToggleAutoConfirm =
    async () => {
      try {
        setToggleLoading(true);

        const updated =
          !autoConfirmEnabled;

        await toggleAutoConfirm(
          updated
        );

        setAutoConfirmEnabled(
          updated
        );
      } catch (err) {
        alert(
          err.response?.data?.message ||
            "Failed to update auto confirm"
        );
      } finally {
        setToggleLoading(false);
      }
    };

  /* ====================================================== */
  /* STATS                                                   */
  /* ====================================================== */

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (o) => o.status === "PENDING"
    ).length;

  const confirmedOrders =
    orders.filter(
      (o) =>
        o.status ===
        "CONFIRMED"
    ).length;

  const cancelledOrders =
    orders.filter(
      (o) =>
        o.status ===
        "CANCELLED"
    ).length;

  /* ====================================================== */
  /* FILTER ORDERS                                            */
  /* ====================================================== */

  const filteredOrders =
    useMemo(() => {
      return orders.filter((order) => {
        const matchesSearch =
          (order.userId?.name || "")
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          order._id
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesStatus =
          statusFilter === "ALL"
            ? true
            : order.status ===
              statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      });
    }, [
      orders,
      search,
      statusFilter,
    ]);

  /* ====================================================== */
  /* PAGINATION                                              */
  /* ====================================================== */

  const totalPages = Math.ceil(
    filteredOrders.length /
      ORDERS_PER_PAGE
  );

  const indexOfLast =
    currentPage *
    ORDERS_PER_PAGE;

  const indexOfFirst =
    indexOfLast -
    ORDERS_PER_PAGE;

  const currentOrders =
    filteredOrders.slice(
      indexOfFirst,
      indexOfLast
    );
if (loading) {
    return (
      <p>Loading orders...</p>
    );
  }
  return (
    <section className="barber-order-section">
      {/* ================= HEADER ================= */}

      <div className="page-header">
        <div>
          <h2>Orders</h2>

          <p>
            Manage incoming
            appointments and
            customer bookings.
          </p>
        </div>

        <div className="auto-confirm-toggle">
          <span>
            Auto Confirm
          </span>

          <button
            className={
              autoConfirmEnabled
                ? "toggle-btn active"
                : "toggle-btn"
            }
            disabled={toggleLoading}
            onClick={
              handleToggleAutoConfirm
            }
          >
            {toggleLoading
              ? "Updating..."
              : autoConfirmEnabled
              ? "ON"
              : "OFF"}
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="stats-grid">
        <div className="stat-card">
          <ClipboardList size={24} />

          <div>
            <span>
              Total Orders
            </span>

            <h3>
              {totalOrders}
            </h3>
          </div>
        </div>

        <div className="stat-card">
          <Clock3 size={24} />

          <div>
            <span>
              Pending
            </span>

            <h3>
              {pendingOrders}
            </h3>
          </div>
        </div>

        <div className="stat-card">
          <CircleCheckBig
            size={24}
          />

          <div>
            <span>
              Confirmed
            </span>

            <h3>
              {confirmedOrders}
            </h3>
          </div>
        </div>

        <div className="stat-card">
          <XCircle size={24} />

          <div>
            <span>
              Cancelled
            </span>

            <h3>
              {cancelledOrders}
            </h3>
          </div>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option value="ALL">
            All Orders
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="CONFIRMED">
            Confirmed
          </option>

          <option value="IN_PROGRESS">
            In Progress
          </option>

          <option value="COMPLETED">
            Completed
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>
        </select>
      </div>
      {/* ================= EMPTY STATE ================= */}

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={48} />

          <h3>No Orders Found</h3>

          <p>
            {orders.length === 0
              ? "You haven't received any customer bookings yet."
              : "No orders match your current search or filter."}
          </p>
        </div>
      ) : (
        <>
          {/* ================= ORDERS GRID ================= */}

          <div className="orders-grid">
            {currentOrders.map(
              (order) => (
                <BarberOrderCard
                  key={order._id}
                  order={order}
                />
              )
            )}
          </div>

          {/* ================= PAGINATION ================= */}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev - 1
                  )
                }
              >
                Previous
              </button>

              <div className="page-info">
                <span>
                  Page{" "}
                  <strong>
                    {currentPage}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {totalPages}
                  </strong>
                </span>

                <small>
                  Showing{" "}
                  {indexOfFirst + 1}
                  –
                  {Math.min(
                    indexOfLast,
                    filteredOrders.length
                  )}{" "}
                  of{" "}
                  {
                    filteredOrders.length
                  }{" "}
                  orders
                </small>
              </div>

              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev + 1
                  )
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default BarberOrderSection;