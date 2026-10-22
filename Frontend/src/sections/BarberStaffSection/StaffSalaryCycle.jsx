
import { useCallback, useEffect, useMemo, useState } from "react";
import {  Wallet,  Download,  Search,  CheckCircle2,  Clock3,IndianRupee,  Plus,Eye,  Pencil,  RefreshCw,} from "lucide-react";

import useBarberSalaryCycle from "../../hooks/barber/useBarberSalaryCycle";
import BarberSalaryCycleDialog from "../../components/organisms/BarberSalaryCycleDialog/BarberSalaryCycleDialog";
import BarberSalaryCycleViewDialog from "../../components/organisms/BarberSalaryCycleViewDialog/BarberSalaryCycleViewDialog";

import "./StaffSalaryCycle.scss";

const getCurrentMonth = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const escapeCsv = (value) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

const getStaff = (cycle) =>
  cycle?.staffId && typeof cycle.staffId === "object"
    ? cycle.staffId
    : null;

const getPaymentStatusLabel = (status) => {
  const labels = {
    PAID: "Paid",
    PENDING: "Pending",
    PARTIALLY_PAID: "Partially Paid",
  };

  return labels[status] || status || "Pending";
};

const getStatusClass = (status) => {
  const classes = {
    PAID: "is-paid",
    PENDING: "is-pending",
    PARTIALLY_PAID: "is-partial",
  };

  return classes[status] || "is-pending";
};

export default function StaffSalaryCycle() {
  const {
    salaryCycles,
    loading,
    creating,
    updating,
    deletingId,
    error,
    pagination,
    fetchSalaryCycles,
    updateSalaryCycle,
    removeSalaryCycle,
    clearError,
  } = useBarberSalaryCycle();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [actionError, setActionError] = useState("");

  const loadSalaryCycles = useCallback(async () => {
    try {
      await fetchSalaryCycles({
        page: 1,
        limit: 100,
      });
    } catch {
      // The hook stores the API error.
    }
  }, [fetchSalaryCycles]);

  useEffect(() => {
    loadSalaryCycles();
  }, [loadSalaryCycles]);

  const filteredSalaries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return salaryCycles.filter((cycle) => {
      const staff = getStaff(cycle);

      const staffName = staff?.fullName || "Unknown staff";
      const staffRole = staff?.role || "";
      const staffPhone = staff?.phone || "";
      const cycleId = cycle?._id || "";
      const cycleMonth = cycle?.cycleStartDate
        ? String(cycle.cycleStartDate).slice(0, 7)
        : "";

      const matchesSearch =
        !query ||
        [
          staffName,
          staffRole,
          staffPhone,
          cycleId,
          cycle.salaryType,
          cycle.transactionReference,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" ||
        cycle.paymentStatus === statusFilter;

      const matchesMonth =
        !selectedMonth || cycleMonth === selectedMonth;

      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [salaryCycles, search, statusFilter, selectedMonth]);

  const totalSalary = filteredSalaries.reduce(
    (sum, cycle) => sum + Number(cycle.netSalary || 0),
    0
  );

  const paidSalary = filteredSalaries
    .filter((cycle) => cycle.paymentStatus === "PAID")
    .reduce((sum, cycle) => sum + Number(cycle.netSalary || 0), 0);

  const pendingCount = filteredSalaries.filter(
    (cycle) =>
      cycle.paymentStatus === "PENDING" ||
      cycle.paymentStatus === "PARTIALLY_PAID"
  ).length;

  const handleCreate = () => {
    clearError();
    setActionError("");
    setSelectedCycle(null);
    setDialogOpen(true);
  };

  const handleView = (cycle) => {
    setActionError("");
    setSelectedCycle(cycle);
    setViewDialogOpen(true);
  };

  const handleEdit = (cycle) => {
    clearError();
    setActionError("");
    setSelectedCycle(cycle);
    setViewDialogOpen(false);
    setDialogOpen(true);
  };

  const handleDialogSuccess = async () => {
    setDialogOpen(false);
    setSelectedCycle(null);
    await loadSalaryCycles();
  };

  const handleMarkPaid = async (cycle) => {
    if (cycle.paymentStatus === "PAID") return;

    const confirmed = window.confirm(
      `Mark the salary cycle for ${
        getStaff(cycle)?.fullName || "this staff member"
      } as fully paid?`
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await updateSalaryCycle(cycle._id, {
        paymentStatus: "PAID",
        paymentDate: new Date().toISOString(),
        paymentMethod: cycle.paymentMethod || "CASH",
      });

      await loadSalaryCycles();
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update the payment status."
      );
    }
  };

  const handleDelete = async (cycle) => {
    const confirmed = window.confirm(
      `Delete the salary cycle for ${
        getStaff(cycle)?.fullName || "this staff member"
      }? This action cannot be undone.`
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await removeSalaryCycle(cycle._id);

      if (selectedCycle?._id === cycle._id) {
        setSelectedCycle(null);
        setViewDialogOpen(false);
        setDialogOpen(false);
      }

      await loadSalaryCycles();
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete the salary cycle."
      );
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "Staff Member",
      "Role",
      "Salary Type",
      "Cycle Start",
      "Cycle End",
      "Working Days",
      "Base Amount",
      "Bonus",
      "Commission",
      "Deductions",
      "Net Salary",
      "Payment Status",
      "Payment Date",
      "Payment Method",
      "Transaction Reference",
    ];

    const rows = filteredSalaries.map((cycle) => {
      const staff = getStaff(cycle);

      return [
        staff?.fullName || "Unknown staff",
        staff?.role || "",
        cycle.salaryType,
        formatDate(cycle.cycleStartDate),
        formatDate(cycle.cycleEndDate),
        cycle.workingDays,
        cycle.salaryAmount,
        cycle.bonus,
        cycle.commissionAmount,
        cycle.deductions,
        cycle.netSalary,
        getPaymentStatusLabel(cycle.paymentStatus),
        formatDate(cycle.paymentDate),
        cycle.paymentMethod || "",
        cycle.transactionReference || "",
      ];
    });

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `trimtokyo-salary-${selectedMonth || "all"}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="staff-salary">
      <div className="staff-salary__header">
        <div>
          <h2>Salary Cycle</h2>
          <p>Track staff salaries, bonuses, deductions, and payments.</p>
        </div>

        <div className="staff-salary__header-actions">
          <button
            type="button"
            className="staff-salary__refresh"
            onClick={loadSalaryCycles}
            disabled={loading}
            aria-label="Refresh salary records"
            title="Refresh"
          >
            <RefreshCw size={17} />
          </button>

          <div className="staff-salary__header-icon">
            <Wallet size={23} />
          </div>
        </div>
      </div>

      {(actionError || error) && (
        <div className="staff-salary__error" role="alert">
          <span>{actionError || error}</span>

          <button
            type="button"
            onClick={() => {
              setActionError("");
              clearError();
            }}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="staff-salary__summary">
        <article className="staff-salary__summary-card">
          <div className="staff-salary__summary-icon salary-icon-green">
            <IndianRupee size={20} />
          </div>
          <p>Total Net Salary</p>
          <h3>{formatCurrency(totalSalary)}</h3>
          <span>For selected month and filters</span>
        </article>

        <article className="staff-salary__summary-card">
          <div className="staff-salary__summary-icon salary-icon-blue">
            <CheckCircle2 size={20} />
          </div>
          <p>Salary Paid</p>
          <h3>{formatCurrency(paidSalary)}</h3>
          <span>Fully paid salary cycles</span>
        </article>

        <article className="staff-salary__summary-card">
          <div className="staff-salary__summary-icon salary-icon-orange">
            <Clock3 size={20} />
          </div>
          <p>Outstanding Cycles</p>
          <h3>{pendingCount}</h3>
          <span>Pending or partially paid</span>
        </article>
      </div>

      {/* Filters */}
      <div className="staff-salary__filter-card">
        <div className="staff-salary__filter-heading">
          <div>
            <h3>Salary Records</h3>
            <span>
              {filteredSalaries.length} records found
              {pagination.total > salaryCycles.length
                ? ` · ${pagination.total} total records`
                : ""}
            </span>
          </div>

          <button
            type="button"
            className="staff-salary__add-button"
            onClick={handleCreate}
          >
            <Plus size={17} />
            Add Salary Cycle
          </button>
        </div>

        <div className="staff-salary__filters">
          <div className="staff-salary__search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search staff, ID, role..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search salary records"
            />
          </div>

          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            aria-label="Select salary month"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter payment status"
          >
            <option value="All">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
          </select>

          <button
            type="button"
            className="staff-salary__export"
            onClick={handleExportCsv}
            disabled={filteredSalaries.length === 0}
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Salary table */}
      <div className="staff-salary__table-card">
        <div className="staff-salary__table-wrapper">
          <table className="staff-salary__table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Salary Period</th>
                <th>Salary Type</th>
                <th>Base Amount</th>
                <th>Net Salary</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && salaryCycles.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="staff-salary__empty">
                      <Wallet size={30} />
                      <strong>Loading salary records...</strong>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                filteredSalaries.map((cycle) => {
                  const staff = getStaff(cycle);
                  const staffName = staff?.fullName || "Unknown staff";
                  const status = cycle.paymentStatus || "PENDING";

                  return (
                    <tr key={cycle._id}>
                      <td>
                        <div className="staff-salary__person">
                          <div className="staff-salary__avatar">
                            {staffName.charAt(0).toUpperCase() || "S"}
                          </div>

                          <div>
                            <strong>{staffName}</strong>
                            <span>
                              {staff?.role || "Staff member"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="staff-salary__period">
                          <strong>
                            {formatDate(cycle.cycleStartDate)}
                          </strong>
                          <span>
                            to {formatDate(cycle.cycleEndDate)}
                          </span>
                        </div>
                      </td>

                      <td>
                        {cycle.salaryType
                          ? cycle.salaryType.charAt(0) +
                            cycle.salaryType.slice(1).toLowerCase()
                          : "—"}
                      </td>

                      <td>{formatCurrency(cycle.salaryAmount)}</td>

                      <td className="staff-salary__total">
                        {formatCurrency(cycle.netSalary)}
                      </td>

                      <td>
                        <div className="staff-salary__status-cell">
                          <span
                            className={`staff-salary__status ${getStatusClass(
                              status
                            )}`}
                          >
                            {getPaymentStatusLabel(status)}
                          </span>

                          {status !== "PAID" && (
                            <button
                              type="button"
                              className="staff-salary__mark-paid"
                              onClick={() => handleMarkPaid(cycle)}
                              disabled={
                                updating || deletingId === cycle._id
                              }
                            >
                              Mark paid
                            </button>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="staff-salary__actions">
                          <button
                            type="button"
                            onClick={() => handleView(cycle)}
                            aria-label={`View salary cycle for ${staffName}`}
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(cycle)}
                            aria-label={`Edit salary cycle for ${staffName}`}
                            title="Edit salary cycle"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(cycle)}
                            disabled={deletingId === cycle._id}
                            aria-label={`Delete salary cycle for ${staffName}`}
                            title="Delete salary cycle"
                          >
                            ×
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!loading && filteredSalaries.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="staff-salary__empty">
                      <Wallet size={30} />
                      <strong>No salary records found</strong>
                      <span>
                        Try another month, change your filters, or create a
                        salary cycle.
                      </span>

                      <button
                        type="button"
                        className="staff-salary__add-button"
                        onClick={handleCreate}
                      >
                        <Plus size={16} />
                        Create Salary Cycle
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit dialog */}
      <BarberSalaryCycleDialog
        isOpen={dialogOpen}
        salaryCycle={selectedCycle}
        onClose={() => {
          setDialogOpen(false);
          setSelectedCycle(null);
        }}
        onSuccess={handleDialogSuccess}
      />

      {/* View dialog */}
      <BarberSalaryCycleViewDialog
        isOpen={viewDialogOpen}
        salaryCycle={selectedCycle}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedCycle(null);
        }}
        onEdit={handleEdit}
      />
    </section>
  );
}
