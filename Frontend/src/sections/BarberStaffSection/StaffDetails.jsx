
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Eye,
  Pencil,
  Trash2,
  UsersRound,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

import useBarberStaff from "../../hooks/barber/useBarberStaff";
import StaffDialog from "../../components/organisms/StaffDialog/StaffDialog";
import StaffViewDialog from "../../components/organisms/StaffViewDialog/StaffViewDialog";
import "./StaffDetails.scss";

const PAGE_SIZE = 5;

const ROLE_OPTIONS = [
  { value: "RECEPTIONIST", label: "Receptionist" },
  { value: "MANAGER", label: "Manager" },
  { value: "ASSISTANT", label: "Assistant" },
  { value: "BARBER", label: "Barber" },
  { value: "CLEANER", label: "Cleaner" },
  { value: "OTHER", label: "Other" },
];

const escapeCsv = (value) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

const formatRole = (role = "") => {
  const option = ROLE_OPTIONS.find((item) => item.value === role);

  return (
    option?.label ||
    role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase()) ||
    "—"
  );
};

export default function StaffDetails() {
  const {
    staff,
    loading,
    error,
    fetchBarberStaff,
    removeBarberStaff,
    deletingId,
    clearError,
  } = useBarberStaff();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const refreshStaff = useCallback(() => {
    return fetchBarberStaff({ page: 1, limit: 100 });
  }, [fetchBarberStaff]);

  useEffect(() => {
    refreshStaff();
  }, [refreshStaff]);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();

    return staff.filter((person) => {
      const matchesSearch =
        !query ||
        [
          person.fullName,
          person._id,
          person.phone,
          person.email,
          person.role,
          person.employmentType,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesRole =
        roleFilter === "All" || person.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || person.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staff, search, roleFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStaff.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedStaff = filteredStaff.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const resetPage = () => setCurrentPage(1);

  const handleSearch = (value) => {
    setSearch(value);
    resetPage();
  };

  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    resetPage();
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    resetPage();
  };

  const handleAdd = () => {
    setSelectedStaff(null);
    clearError();
    setDialogOpen(true);
  };

  const handleView = (person) => {
    setSelectedStaff(person);
    setViewOpen(true);
  };

  const handleUpdate = (person) => {
    setSelectedStaff(person);
    setViewOpen(false);
    clearError();
    setDialogOpen(true);
  };

  const handleDelete = async (person) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${person.fullName}?`
    );

    if (!confirmed) return;

    const result = await removeBarberStaff(person._id);

    if (!result.success) {
      window.alert(result.message || "Failed to delete staff member.");
      return;
    }

    if (selectedStaff?._id === person._id) {
      setSelectedStaff(null);
      setViewOpen(false);
      setDialogOpen(false);
    }

    await refreshStaff();
  };

  const handleDialogSuccess = async () => {
    setDialogOpen(false);
    setSelectedStaff(null);
    resetPage();
    await refreshStaff();
  };

  const handleExportCsv = () => {
    const headers = [
      "Staff ID",
      "Name",
      "Phone",
      "Email",
      "Role",
      "Employment Type",
      "Joining Date",
      "Status",
      "Address",
    ];

    const rows = filteredStaff.map((person) => [
      person._id,
      person.fullName,
      person.phone,
      person.email,
      formatRole(person.role),
      person.employmentType,
      person.joiningDate
        ? new Date(person.joiningDate).toLocaleDateString("en-IN")
        : "",
      person.status,
      person.address,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "trimtokyo-staff.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="staff-details">
      <div className="staff-details__header">
        <div>
          <h2>Staff Details</h2>
          <p>Manage your salon team and staff information.</p>
        </div>

        <div className="staff-details__header-icon">
          <UsersRound size={23} />
        </div>
      </div>

      <div className="staff-details__filter-card">
        <div className="staff-details__filter-heading">
          <div className="staff-details__filter-title">
            <SlidersHorizontal size={17} />
            <h3>Filters</h3>
          </div>

          <span className="staff-details__result-count">
            {filteredStaff.length} staff found
          </span>
        </div>

        <div className="staff-details__filter-controls">
          <div className="staff-details__search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search name, ID, phone..."
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              aria-label="Search staff"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => handleRoleFilter(event.target.value)}
            aria-label="Filter by role"
          >
            <option value="All">All Roles</option>
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => handleStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <button
            type="button"
            className="staff-details__button staff-details__button--export"
            onClick={handleExportCsv}
            disabled={loading || filteredStaff.length === 0}
          >
            <Download size={17} />
            Export CSV
          </button>

          <button
            type="button"
            className="staff-details__button staff-details__button--add"
            onClick={handleAdd}
          >
            <Plus size={18} />
            Add Staff
          </button>
        </div>
      </div>

      <div className="staff-details__table-card">
        <div className="staff-details__table-heading">
          <div>
            <h3>All Staff Members</h3>
            <p>View and manage your registered staff.</p>
          </div>
        </div>

        {error && (
          <div className="staff-details__error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={clearError}>
              Dismiss
            </button>
          </div>
        )}

        <div className="staff-details__table-wrapper">
          <table className="staff-details__table">
            <thead>
              <tr>
                <th>Staff Details</th>
                <th>Role</th>
                <th>Employment Type</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && staff.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="staff-details__empty">
                      Loading staff members...
                    </div>
                  </td>
                </tr>
              ) : paginatedStaff.length > 0 ? (
                paginatedStaff.map((person) => (
                  <tr key={person._id}>
                    <td>
                      <div className="staff-details__person">
                        <div className="staff-details__avatar">
                          {person.profileImage ? (
                            <img
                              src={person.profileImage}
                              alt={person.fullName || "Staff"}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            person.fullName?.charAt(0)?.toUpperCase() || "S"
                          )}
                        </div>

                        <div className="staff-details__person-info">
                          <span className="staff-details__person-name">
                            {person.fullName || "Unnamed staff"}
                          </span>
                          <span className="staff-details__person-meta">
                            {person.email || person._id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="staff-details__role">
                        {formatRole(person.role)}
                      </span>
                    </td>

                    <td>
                      {person.employmentType
                        ? person.employmentType
                            .replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (character) =>
                              character.toUpperCase()
                            )
                        : "—"}
                    </td>

                    <td>{person.phone || "—"}</td>

                    <td>
                      <span
                        className={`staff-details__status staff-details__status--${(
                          person.status || "unknown"
                        ).toLowerCase()}`}
                      >
                        {person.status || "Unknown"}
                      </span>
                    </td>

                    <td>
                      <div className="staff-details__actions">
                        <button
                          type="button"
                          className="staff-details__action staff-details__action--view"
                          title="View staff"
                          aria-label={`View ${person.fullName}`}
                          onClick={() => handleView(person)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          className="staff-details__action staff-details__action--edit"
                          title="Update staff"
                          aria-label={`Update ${person.fullName}`}
                          onClick={() => handleUpdate(person)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="staff-details__action staff-details__action--delete"
                          title="Delete staff"
                          aria-label={`Delete ${person.fullName}`}
                          disabled={deletingId === person._id}
                          onClick={() => handleDelete(person)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="staff-details__empty">
                      <UsersRound size={30} />
                      <strong>
                        {loading ? "Refreshing staff..." : "No staff found"}
                      </strong>
                      <span>
                        {search || roleFilter !== "All" || statusFilter !== "All"
                          ? "Try changing your search or filters."
                          : "Add your first staff member to get started."}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="staff-details__pagination">
          <span>
            Showing{" "}
            {filteredStaff.length === 0
              ? 0
              : (safePage - 1) * PAGE_SIZE + 1}
            {"–"}
            {Math.min(safePage * PAGE_SIZE, filteredStaff.length)} of{" "}
            {filteredStaff.length} staff
          </span>

          <div className="staff-details__pagination-controls">
            <button
              type="button"
              aria-label="Previous page"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage(safePage - 1)}
            >
              <ChevronLeft size={17} />
            </button>

            <span className="staff-details__page-number">
              {safePage} / {totalPages}
            </span>

            <button
              type="button"
              aria-label="Next page"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <StaffDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
        onSuccess={handleDialogSuccess}
      />

      <StaffViewDialog
        isOpen={viewOpen}
        staff={selectedStaff}
        onClose={() => setViewOpen(false)}
        onEdit={handleUpdate}
      />
    </section>
  );
}
