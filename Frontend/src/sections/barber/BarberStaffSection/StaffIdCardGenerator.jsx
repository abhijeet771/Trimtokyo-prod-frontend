import { useMemo, useState } from "react";
import {  Search,  Download,  Printer,CalendarDays,  ChevronDown,  ChevronLeft,  ChevronRight,  Info,
  Scissors,  Phone,  Mail,  MapPin,ShieldCheck,  IdCard,  FileSpreadsheet,} from "lucide-react";

import {  SHOP_DETAILS, STAFF_MEMBERS, ORDER_VERIFICATION_HISTORY,} from "../../../constants/StaffIdCard.constants";
import "./StaffIdCardGenerator.scss";

const PAGE_SIZE = 5;

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const escapeCsv = (value) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

export default function StaffIdCardGenerator({
  staffMembers = STAFF_MEMBERS,
  orderHistory = ORDER_VERIFICATION_HISTORY,
}) {
  const [selectedStaffId, setSelectedStaffId] = useState(
    staffMembers[0]?.id ?? ""
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const selectedStaff = staffMembers.find(
    (staff) => staff.id === selectedStaffId
  );

  const staffHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orderHistory.filter((order) => {
      if (order.staffId !== selectedStaffId) return false;

      const searchableValues = [
        order.orderId,
        order.verificationCode,
        order.customerName,
        order.serviceType,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const orderDate = new Date(order.dateTime);
      const validDate = !Number.isNaN(orderDate.getTime());

      const matchesStartDate =
        !startDate ||
        (validDate &&
          orderDate >= new Date(`${startDate}T00:00:00`));

      const matchesEndDate =
        !endDate ||
        (validDate &&
          orderDate <= new Date(`${endDate}T23:59:59.999`));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    orderHistory,
    selectedStaffId,
    search,
    statusFilter,
    startDate,
    endDate,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(staffHistory.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedHistory = staffHistory.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const handleStaffChange = (event) => {
    setSelectedStaffId(event.target.value);
    resetFilters();
  };

  const handleExportCsv = () => {
    const headers = [
      "Staff ID",
      "Shop Name",
      "Order ID",
      "Verification Code",
      "Customer Name",
      "Service Type",
      "Date and Time",
      "Status",
    ];

    const rows = staffHistory.map((order) => [
      order.staffId,
      SHOP_DETAILS.name,
      order.orderId,
      order.verificationCode,
      order.customerName,
      order.serviceType,
      formatDateTime(order.dateTime),
      order.status,
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
    link.download = `trimtokyo-${selectedStaffId || "staff"}-verification-history.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCard = () => {
    window.print();
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <section className="staff-id-generator">
      <div className="staff-id-generator__heading">
        <div>
          <h2>ID Card Generator</h2>
          <p>
            Generate staff identity cards and review order verification
            history.
          </p>
        </div>

        <div className="staff-id-generator__info">
          <Info size={20} />

          <div>
            <strong>How it works</strong>
            <span>
              Each order should receive a unique verification code.
              Store every code against its order in the backend.
            </span>
          </div>
        </div>
      </div>

      <div className="staff-id-generator__layout">
        {/* Staff selection and ID card */}
        <aside className="staff-id-generator__card-panel">
          <div className="staff-id-generator__panel-heading">
            <h3>Select Staff Member</h3>
            <p>Choose a staff member to view their ID card.</p>
          </div>

          <div className="staff-id-generator__select-wrap">
            <select
              value={selectedStaffId}
              onChange={handleStaffChange}
              aria-label="Select staff member"
            >
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} — {staff.role}
                </option>
              ))}
            </select>

            <ChevronDown size={18} />
          </div>

          {selectedStaff ? (
            <div className="staff-id-card" id="staff-id-card">
              <div className="staff-id-card__top-accent" />

              <div className="staff-id-card__brand">
                <div className="staff-id-card__brand-icon">
                  <Scissors size={31} strokeWidth={2.2} />
                </div>

                <div>
                  <h2>{SHOP_DETAILS.name}</h2>
                  <span>{SHOP_DETAILS.subtitle}</span>
                </div>
              </div>

              <div className="staff-id-card__identity">
                <div className="staff-id-card__avatar">
                  {selectedStaff.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="staff-id-card__identity-info">
                  <h3>{selectedStaff.name}</h3>
                  <span>{selectedStaff.role}</span>
                  <div className="staff-id-card__verified">
                    <ShieldCheck size={14} />
                    Verified Staff
                  </div>
                </div>
              </div>

              <div className="staff-id-card__details">
                <div className="staff-id-card__detail">
                  <span>Staff ID</span>
                  <strong>{selectedStaff.id}</strong>
                </div>

                <div className="staff-id-card__detail staff-id-card__detail--code">
                  <span>Verification Code</span>
                  <strong>
                    {selectedStaff.verificationCode || "Order based"}
                  </strong>
                </div>
              </div>

              <div className="staff-id-card__contact">
                <div>
                  <Phone size={15} />
                  <span>{selectedStaff.phone || "—"}</span>
                </div>

                <div>
                  <Mail size={15} />
                  <span>{selectedStaff.email || "—"}</span>
                </div>

                <div>
                  <Scissors size={15} />
                  <span>{selectedStaff.speciality || "Staff Services"}</span>
                </div>

                <div>
                  <MapPin size={15} />
                  <span>{SHOP_DETAILS.address}</span>
                </div>
              </div>

              <div className="staff-id-card__footer">
                <div>
                  <strong>{SHOP_DETAILS.name}</strong>
                  <span>TRUSTED CARE, AT YOUR DOORSTEP</span>
                </div>

                <IdCard size={28} />
              </div>
            </div>
          ) : (
            <div className="staff-id-generator__empty-staff">
              No staff member selected.
            </div>
          )}

          <div className="staff-id-generator__card-actions">
            <button
              type="button"
              className="staff-id-generator__button staff-id-generator__button--primary"
              onClick={handleDownloadCard}
              disabled={!selectedStaff}
            >
              <Download size={17} />
              Download / Save PDF
            </button>

            <button
              type="button"
              className="staff-id-generator__button staff-id-generator__button--secondary"
              onClick={handlePrintCard}
              disabled={!selectedStaff}
            >
              <Printer size={17} />
              Print ID Card
            </button>
          </div>
        </aside>

        {/* Order history */}
        <div className="staff-id-generator__history-panel">
          <div className="staff-id-generator__history-header">
            <div>
              <h3>Order Verification History</h3>
              <p>
                All recorded orders for{" "}
                <strong>{selectedStaff?.name || "selected staff"}</strong>.
              </p>
            </div>

            <button
              type="button"
              className="staff-id-generator__button staff-id-generator__button--secondary"
              onClick={handleExportCsv}
            >
              <FileSpreadsheet size={17} />
              Export CSV
            </button>
          </div>

          <div className="staff-id-generator__filters">
            <div className="staff-id-generator__search">
              <Search size={17} />

              <input
                type="search"
                value={search}
                placeholder="Search order, code, customer..."
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Search order history"
              />
            </div>

            <div className="staff-id-generator__date-filter">
              <CalendarDays size={17} />

              <input
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter from date"
              />
            </div>

            <div className="staff-id-generator__date-filter">
              <CalendarDays size={17} />

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter to date"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by order status"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="staff-id-generator__table-wrap">
            <table className="staff-id-generator__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Verification Code</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date &amp; Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {paginatedHistory.map((order, index) => (
                  <tr key={`${order.orderId}-${order.staffId}`}>
                    <td>{(safePage - 1) * PAGE_SIZE + index + 1}</td>

                    <td className="staff-id-generator__order-id">
                      {order.orderId}
                    </td>

                    <td>
                      <strong className="staff-id-generator__code">
                        {order.verificationCode}
                      </strong>
                    </td>

                    <td>{order.customerName}</td>
                    <td>{order.serviceType}</td>
                    <td>{formatDateTime(order.dateTime)}</td>

                    <td>
                      <span
                        className={`staff-id-generator__status staff-id-generator__status--${String(
                          order.status
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {paginatedHistory.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="staff-id-generator__empty-history">
                        <IdCard size={30} />
                        <strong>No verification records found</strong>
                        <span>
                          Try changing the search, dates, or status filter.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="staff-id-generator__pagination">
            <span>
              Showing{" "}
              {staffHistory.length === 0
                ? 0
                : (safePage - 1) * PAGE_SIZE + 1}
              {"–"}
              {Math.min(safePage * PAGE_SIZE, staffHistory.length)} of{" "}
              {staffHistory.length} records
            </span>

            <div className="staff-id-generator__pagination-controls">
              <button
                type="button"
                aria-label="Previous page"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(safePage - 1)}
              >
                <ChevronLeft size={17} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - safePage) <= 1
                )
                .map((page, index, pages) => (
                  <span key={page} className="staff-id-generator__page-group">
                    {index > 0 && page - pages[index - 1] > 1 && (
                      <span className="staff-id-generator__ellipsis">…</span>
                    )}

                    <button
                      type="button"
                      className={
                        page === safePage ? "is-active" : ""
                      }
                      aria-label={`Go to page ${page}`}
                      aria-current={page === safePage ? "page" : undefined}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </span>
                ))}

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
      </div>
    </section>
  );
}
