import React, { useCallback, useEffect, useMemo, useState } from "react";
import useAdminUsers from "../../../hooks/admin/useAdminUsers";
import useAdminUserStats from "../../../hooks/admin/useAdminUserStats";
import useDeleteAdminUser from "../../../hooks/admin/useDeleteAdminUser";
import "./AdminUserSection.scss";

const AdminUserSection = () => {
  const { users = [], page, limit, search, total, totalPages,
    loading, error, setPage, setSearch, fetchUsers,
  } = useAdminUsers();

  const { stats, loading: statsLoading, fetchStats,  } = useAdminUserStats();
  const { deleteUser, loading: deleting,  } = useDeleteAdminUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadData = useCallback(async () => {
    const results = await Promise.allSettled([ fetchUsers(), fetchStats(), ]);
    return results;
  }, [fetchUsers, fetchStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalizedSearch = searchTerm.trim();

      if (normalizedSearch !== search) {
        setPage(1);
        fetchUsers({
          page: 1,
          search: normalizedSearch,
        }).catch(() => {});
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm, search, setPage, fetchUsers]);

  const userStats = useMemo(() => {
    const validUsers = Array.isArray(users) ? users : [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: stats?.totalUsers ?? stats?.total ?? total ?? validUsers.length,
      newThisMonth: stats?.newThisMonth ??
        validUsers.filter((user) => {
          if (!user.createdAt) return false;
          const createdAt = new Date(user.createdAt);
          return createdAt >= monthStart && createdAt <= now;
        }).length,
      verified: stats?.verifiedUsers ??
        stats?.verified ??
        validUsers.filter((user) => user.phoneVerified === true).length,
      withEmail: stats?.usersWithEmail ??
        stats?.withEmail ??
        validUsers.filter(
          (user) => typeof user.email === "string" && user.email.trim()
        ).length,
    };
  }, [users, stats, total]);

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value); if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return String(name).trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();
  };

  const handleDelete = async (user) => {
    const id = user._id || user.id;
    if (!id) { return; }
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name || "this user"}? This action cannot be undone.`
    );
    if (!confirmed) return;
    setDeletingId(id);

    try {
      await deleteUser(id);

      // If the last user on a page is deleted, move back one page.
      const remainingOnPage = users.length - 1;
      const nextPage = remainingOnPage === 0 && page > 1 ? page - 1 : page;
      await Promise.allSettled([
        fetchUsers({ page: nextPage, search }),
        fetchStats(),
      ]);
    } finally {
      setDeletingId(null);
    }
  };

  const kpiCards = [
    {
      label: "Total Users",
      value: userStats.total,
      hint: "Registered customer accounts",
      type: "total",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 11a3.5 3.5 0 0 0 0-7M17 14.5h1a3 3 0 0 1 3 3V20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "New This Month",
      value: userStats.newThisMonth,
      hint: "Joined during this month",
      type: "new",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: "Phone Verified",
      value: userStats.verified,
      hint: "Verified phone numbers",
      type: "verified",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="m5 12 4 4L19 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
        </svg>
      ),
    },
    {
      label: "Users with Email",
      value: userStats.withEmail,
      hint: "Accounts with an email address",
      type: "email",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="admin-user-section">
      <div className="admin-user-section__heading">
        <div>
          <p className="admin-user-section__eyebrow">USER MANAGEMENT</p>
          <h1>Users</h1>
          <p className="admin-user-section__subtitle">
            Manage customer accounts and view their registration details.
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="admin-user-section__kpis">
        {kpiCards.map((card) => (
          <article className={`user-kpi-card user-kpi-card--${card.type}`} key={card.type}>
            <div className="user-kpi-card__top">
              <span className="user-kpi-card__label">{card.label}</span>
              <span className="user-kpi-card__icon">{card.icon}</span>
            </div>

            <strong className="user-kpi-card__value">
              {statsLoading && !stats ? "—" : Number(card.value || 0).toLocaleString("en-IN")}
            </strong>

            <span className="user-kpi-card__hint">{card.hint}</span>
          </article>
        ))}
      </div>

      {/* USERS TABLE */}
      <div className="admin-user-table">
        <div className="admin-user-table__header">
          <div>
            <h2>Users List</h2>
            <p>
              {loading
                ? "Loading customer accounts..." : `${total ?? users.length} ${
                    (total ?? users.length) === 1 ? "user" : "users"
                  } total`}
            </p>
          </div>

          <label className="admin-user-table__search">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8"/>
              <path d="m16 16 4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search" value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, email or phone..."
              aria-label="Search users by name, email or phone"
            />

            {searchTerm && (
              <button type="button" className="admin-user-table__clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search">
                ×
              </button>
            )}
          </label>
        </div>

        {loading && (
          <div className="admin-user-table__state">
            <span className="admin-user-table__spinner" />
            Loading users...
          </div>
        )}

        {!loading && error && (
          <div className="admin-user-table__state admin-user-table__state--error" role="alert">
            {typeof error === "string" ? error : "Failed to load users. Please try again."}
            <button type="button" onClick={() => fetchUsers().catch(() => {})}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {users.length === 0 ? (
              <div className="admin-user-table__empty">
                <strong>
                  {searchTerm ? "No matching users" : "No users found"}
                </strong>
                <span>
                  {searchTerm ? "Try a different name, email or phone number." : "User accounts will appear here when available."}
                </span>
              </div>
            ) : (
              <div className="admin-user-table__scroll">
                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Phone Verified</th>
                      <th>Joined At</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, index) => {
                      const id = user._id || user.id;
                      const isDeleting = deleting && deletingId === id;

                      return (
                        <tr key={id || `${user.phone}-${index}`}>
                          <td>{(page - 1) * limit + index + 1}</td>

                          <td>
                            <div className="admin-user-table__person">
                              <span className="admin-user-table__avatar">
                                {getInitials(user.name)}
                              </span>
                              <span className="admin-user-table__name">
                                {user.name || "Unnamed user"}
                              </span>
                            </div>
                          </td>

                          <td className="admin-user-table__email"> {user.email || "—"} </td>
                          <td>{user.phone || "—"}</td>
                          <td>
                            <span
                              className={`user-status ${
                                user.phoneVerified ? "user-status--verified" : "user-status--unverified"
                              }`}
                            >
                              <span className="user-status__dot" />
                              {user.phoneVerified ? "Verified" : "Not verified"}
                            </span>
                          </td>

                          <td>{formatDate(user.createdAt)}</td>

                          <td>
                            <button
                              type="button"
                              className="admin-user-table__delete"
                              onClick={() => handleDelete(user)}
                              disabled={deleting}
                              aria-label={`Delete ${user.name || "user"}`}
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="admin-user-table__pagination">
                <button
                  type="button"
                  disabled={loading || page <= 1}
                  onClick={() => fetchUsers({ page: page - 1 }).catch(() => {})}>
                  Previous
                </button>

                <span> Page {page} of {totalPages} </span>

                <button
                  type="button"
                  disabled={loading || page >= totalPages}
                  onClick={() => fetchUsers({ page: page + 1 }).catch(() => {})
                  }
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AdminUserSection;
