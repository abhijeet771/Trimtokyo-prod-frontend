import React, { useMemo, useState } from "react";
import {  Ticket,Clock3,  CheckCircle2,CircleAlert,  Search,ChevronLeft,  ChevronRight,} from "lucide-react";
import supportTickets from "../../../constants/support";
import "./AdminSupportSection.scss";

const PAGE_SIZE = 5;

const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];

const AdminSupportSection = () => {
  const [tickets, setTickets] = useState(supportTickets);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(
    () => [
      {
        label: "Total Tickets",
        value: tickets.length,
        type: "total",
        icon: Ticket,
      },
      {
        label: "Open",
        value: tickets.filter((ticket) => ticket.status === "Open").length,
        type: "open",
        icon: Clock3,
      },
      {
        label: "In Progress",
        value: tickets.filter((ticket) => ticket.status === "In Progress")
          .length,
        type: "progress",
        icon: CircleAlert,
      },
      {
        label: "Resolved",
        value: tickets.filter((ticket) => ticket.status === "Resolved").length,
        type: "resolved",
        icon: CheckCircle2,
      },
    ],
    [tickets]
  );

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesTab =
        activeTab === "All" || ticket.role === activeTab;

      const matchesStatus =
        statusFilter === "All" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || ticket.priority === priorityFilter;

      const matchesSearch = [
        ticket.id,
        ticket.user,
        ticket.email,
        ticket.subject,
        ticket.category,
      ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesTab && matchesStatus && matchesPriority && matchesSearch
      );
    });
  }, [tickets, activeTab, statusFilter, priorityFilter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTickets.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedTickets = filteredTickets.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets((previous) =>
      previous.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const startEntry = filteredTickets.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endEntry = Math.min(safePage * PAGE_SIZE, filteredTickets.length);

  return (
    <section className="admin-support">
      <header className="admin-support__header">
        <div>
          <h2>Support Tickets</h2>
          <p>Manage support requests from users and barbers.</p>
        </div>
      </header>

      {/* Four KPI cards */}
      <div className="admin-support__kpis">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              className={`admin-support__kpi admin-support__kpi--${stat.type}`}
              key={stat.type}
            >
              <div className="admin-support__kpi-icon">
                <Icon size={21} />
              </div>

              <div className="admin-support__kpi-info">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Ticket filters */}
      <div className="admin-support__panel">
        <div className="admin-support__toolbar">
          <div className="admin-support__tabs" role="tablist" aria-label="Ticket type">
            {["All", "User", "Barber"].map((tab) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={
                  activeTab === tab ? "is-active" : ""
                }
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
              >
                {tab === "All" ? "All Tickets" : `${tab} Tickets`}
              </button>
            ))}
          </div>

          <div className="admin-support__filters">
            <label className="admin-support__search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search tickets..."
                aria-label="Search tickets"
                value={search}
                onChange={(event) =>
                  handleFilterChange(setSearch, event.target.value)
                }
              />
            </label>

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) =>
                handleFilterChange(setStatusFilter, event.target.value)
              }
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by priority"
              value={priorityFilter}
              onChange={(event) =>
                handleFilterChange(setPriorityFilter, event.target.value)
              }
            >
              <option value="All">All Priorities</option>
              {["High", "Medium", "Low"].map((priority) => (
                <option value={priority} key={priority}>
                  {priority} Priority
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tickets table */}
        <div className="admin-support__table-heading">
          <h3>Support Tickets ({filteredTickets.length})</h3>
        </div>

        <div className="admin-support__table-wrapper">
          <table className="admin-support__table">
            <thead>
              <tr>
                <th>Ticket / User</th>
                <th>Role</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Update Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <div className="admin-support__user">
                      <strong>{ticket.user}</strong>
                      <span>{ticket.id}</span>
                      <small>{ticket.email}</small>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`admin-support__role admin-support__role--${ticket.role.toLowerCase()}`}
                    >
                      {ticket.role}
                    </span>
                  </td>

                  <td className="admin-support__subject">
                    {ticket.subject}
                  </td>

                  <td>
                    <span
                      className={`admin-support__category admin-support__category--${ticket.category.toLowerCase()}`}
                    >
                      {ticket.category}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`admin-support__priority admin-support__priority--${ticket.priority.toLowerCase()}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`admin-support__status admin-support__status--${ticket.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td className="admin-support__date">
                    <span>{formatDate(ticket.createdAt)}</span>
                    <small>{formatTime(ticket.createdAt)}</small>
                  </td>

                  <td>
                    <select
                      className="admin-support__status-select"
                      aria-label={`Update status for ${ticket.id}`}
                      value={ticket.status}
                      onChange={(event) =>
                        handleStatusChange(ticket.id, event.target.value)
                      }
                    >
                      {STATUSES.map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {paginatedTickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="admin-support__empty">
                    No support tickets match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination: 5 tickets per page */}
        <footer className="admin-support__pagination">
          <span>
            Showing {startEntry}–{endEntry} of {filteredTickets.length} tickets
          </span>

          <div className="admin-support__page-controls">
            <button
              type="button"
              aria-label="Previous page"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  type="button"
                  key={page}
                  className={safePage === page ? "is-active" : ""}
                  aria-label={`Page ${page}`}
                  aria-current={safePage === page ? "page" : undefined}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              aria-label="Next page"
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default AdminSupportSection;
