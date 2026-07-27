import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiDownload, FiSearch } from "react-icons/fi";
import useUserDetails from "../../../hooks/useUserDetails";
import "./UserPanel.scss";

const UserPanel = ({ open, onClose }) => {
  const {    users,    loading,    error,    search,setSearch,    pagination,    changePage,    exportCSV,refresh,  } = useUserDetails();

  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);

  return (
    <>
      <div
        className={`user-panel-overlay ${open ? "active" : ""}`}
        onClick={onClose}
      />

      <div className={`user-panel ${open ? "open" : ""}`}>
        {/* ================= HEADER ================= */}
        <div className="user-panel-header">
          <div>
            <h2>Users</h2>
            <p>{pagination.total} Registered Users</p>
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
        <div className="user-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ================= USERS TABLE ================= */}
        <div className="user-table-wrapper">
          {loading ? (
            <div className="empty-state">
              Loading users...
            </div>
          ) : error ? (
            <div className="empty-state">
              {error}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="3">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="user-panel-footer">
          <div className="pagination">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => changePage(pagination.page - 1)}
            >
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasNext}
              onClick={() => changePage(pagination.page + 1)}
            >
              Next
            </button>
          </div>

          <button
            className="export-btn"
            onClick={exportCSV}
          >
            <FiDownload />
            Export CSV
          </button>
        </div>
      </div>
    </>
  );
};

export default UserPanel;