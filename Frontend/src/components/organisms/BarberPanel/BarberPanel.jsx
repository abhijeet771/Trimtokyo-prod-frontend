import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";

import useGetShop from "../../../hooks/useGetShop";

import "./BarberPanel.scss";

const BarberPanel = ({
  open,
  onClose,
}) => {
  const {
    barbers,
    loading,
    error,
    search,
    setSearch,
    pagination,
    changePage,
    refresh,
  } = useGetShop();

  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);

  return (
    <>
      <div
        className={`barber-panel-overlay ${
          open ? "active" : ""
        }`}
        onClick={onClose}
      />

      <div
        className={`barber-panel ${
          open ? "open" : ""
        }`}
      >
        {/* ================= HEADER ================= */}

        <div className="barber-panel-header">
          <div>
            <h2>Barbers</h2>

            <p>
              {pagination?.total || 0} Registered
              Barbers
            </p>
          </div>

          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>

        {/* ================= SEARCH ================= */}

        <div className="barber-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* ================= TABLE ================= */}

        <div className="barber-table-wrapper">
          {loading ? (
            <div className="empty-state">
              Loading barbers...
            </div>
          ) : error ? (
            <div className="empty-state">
              {error}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Phone</th>
                </tr>
              </thead>

              <tbody>
                {barbers.length === 0 ? (
                  <tr>
                    <td colSpan="3">
                      No barbers found
                    </td>
                  </tr>
                ) : (
                  barbers.map(
                    (
                      barber,
                      index
                    ) => (
                      <tr
                        key={barber._id}
                      >
                        <td>
                          {(pagination.page -
                            1) *
                            pagination.limit +
                            index +
                            1}
                        </td>

                        <td>
                          {barber.name}
                        </td>

                        <td>
                          {barber.phone}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ================= FOOTER ================= */}

        <div className="barber-panel-footer">
          <div className="pagination">
            <button
              disabled={
                !pagination?.hasPrev
              }
              onClick={() =>
                changePage(
                  pagination.page - 1
                )
              }
            >
              Previous
            </button>

            <span>
              Page {pagination?.page || 1} of{" "}
              {pagination?.totalPages || 1}
            </span>

            <button
              disabled={
                !pagination?.hasNext
              }
              onClick={() =>
                changePage(
                  pagination.page + 1
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarberPanel;