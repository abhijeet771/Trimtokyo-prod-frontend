import { useEffect, useState } from "react";

import useBarberOrders from "../../hooks/useBarberOrders";

import BarberOrderCard from "../../components/molecules/BarberOrderCard/BarberOrderCard";

import {
  getMyProfile,
  toggleAutoConfirm,
} from "../../services/api";

import "./BarberOrderSection.scss";

const ORDERS_PER_PAGE = 4;

const BarberOrderSection = () => {
  const { orders, loading } =
    useBarberOrders();

  // ================= PAGINATION =================

  const [currentPage, setCurrentPage] =
    useState(1);

  // ================= AUTO CONFIRM =================

  const [
    autoConfirmEnabled,
    setAutoConfirmEnabled,
  ] = useState(false);

  const [
    toggleLoading,
    setToggleLoading,
  ] = useState(false);

  // ================= FETCH BARBER PROFILE =================

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
        console.error(
          "Failed to fetch barber profile",
          err
        );
      }
    };

    fetchProfile();
  }, []);

  // ================= TOGGLE AUTO CONFIRM =================

  const handleToggleAutoConfirm =
    async () => {
      try {
        setToggleLoading(true);

        const updatedValue =
          !autoConfirmEnabled;

        await toggleAutoConfirm(
          updatedValue
        );

        setAutoConfirmEnabled(
          updatedValue
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

  // ================= LOADING =================

  if (loading) {
    return <p>Loading orders...</p>;
  }

  // ================= PAGINATION LOGIC =================

  const totalPages = Math.ceil(
    orders.length / ORDERS_PER_PAGE
  );

  const indexOfLast =
    currentPage * ORDERS_PER_PAGE;

  const indexOfFirst =
    indexOfLast - ORDERS_PER_PAGE;

  const currentOrders = orders.slice(
    indexOfFirst,
    indexOfLast
  );

  return (
    <div className="barber-order-section">
      {/* ================= HEADER ================= */}

      <div className="section-header">
        <div>
          <h3>Incoming Orders</h3>

          <p className="auto-confirm-note">
            Auto-confirmed orders
            will appear directly as
            confirmed.
          </p>
        </div>

        {/* ================= AUTO CONFIRM TOGGLE ================= */}

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

      {/* ================= EMPTY STATE ================= */}

      {orders.length === 0 ? (
        <p className="empty">
          No orders received yet.
        </p>
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

          {orders.length >
            ORDERS_PER_PAGE && (
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
                Prev
              </button>

              <span>
                Page {currentPage} of{" "}
                {totalPages}
              </span>

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
    </div>
  );
};

export default BarberOrderSection;