import React, { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Banknote,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  FileText,
  RotateCcw,
} from "lucide-react";

import {
  PAYMENT_TABLE_TEXT,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_TABLE_RECORDS,
  PAYMENT_TABLE_PAGE_SIZE,
  formatTableCurrency,
  formatTableDate,
} from "../../constants/barberPaymentsTable";

import "./BarberPaymentsTable.scss";

const BarberPaymentsTable = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return PAYMENT_TABLE_RECORDS.filter((payment) => {
      const matchesSearch =
        !query ||
        payment.id.toLowerCase().includes(query) ||
        payment.orderId.toLowerCase().includes(query) ||
        payment.customer.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "all" ||
        payment.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [search, statusFilter, methodFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / PAYMENT_TABLE_PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedPayments = filteredPayments.slice(
    (safePage - 1) * PAYMENT_TABLE_PAGE_SIZE,
    safePage * PAYMENT_TABLE_PAGE_SIZE
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setMethodFilter("all");
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleMethodChange = (value) => {
    setMethodFilter(value);
    setCurrentPage(1);
  };

  return (
    <section className="barber-payments-table">
      {/* Header */}
      <header className="barber-payments-table__heading">
        <div className="barber-payments-table__heading-icon">
          <FileText size={25} />
        </div>

        <div>
          <h1>{PAYMENT_TABLE_TEXT.title}</h1>
          <p>{PAYMENT_TABLE_TEXT.subtitle}</p>
        </div>
      </header>

      {/* Search */}
      <div className="barber-payments-table__search">
        <Search size={22} />

        <input
          type="search"
          value={search}
          placeholder={PAYMENT_TABLE_TEXT.searchPlaceholder}
          aria-label="Search payments"
          onChange={(event) => handleSearch(event.target.value)}
        />

        {search && (
          <button
            type="button"
            className="barber-payments-table__clear-search"
            aria-label="Clear search"
            onClick={() => handleSearch("")}
          >
            ×
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="barber-payments-table__filters">
        <div className="barber-payments-table__filter-group">
          <span className="barber-payments-table__filter-label">
            {PAYMENT_TABLE_TEXT.statusLabel}
          </span>

          <div className="barber-payments-table__filter-options">
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`barber-payments-table__filter-button ${
                  statusFilter === option.value ? "is-active" : ""
                }`}
                aria-pressed={statusFilter === option.value}
                onClick={() => handleStatusChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="barber-payments-table__method-header">
          <span className="barber-payments-table__filter-label">
            {PAYMENT_TABLE_TEXT.methodLabel}
          </span>

          <button
            type="button"
            className="barber-payments-table__reset"
            onClick={resetFilters}
          >
            <RotateCcw size={14} />
            {PAYMENT_TABLE_TEXT.reset}
          </button>
        </div>

        <div className="barber-payments-table__method-options">
          {PAYMENT_METHOD_OPTIONS.map((option) => {
            const MethodIcon =
              option.value === "cash"
                ? Banknote
                : option.value === "online"
                  ? CreditCard
                  : SlidersHorizontal;

            return (
              <button
                key={option.value}
                type="button"
                className={`barber-payments-table__method-button ${
                  methodFilter === option.value ? "is-active" : ""
                }`}
                aria-pressed={methodFilter === option.value}
                onClick={() => handleMethodChange(option.value)}
              >
                <MethodIcon size={18} />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results information */}
      <div className="barber-payments-table__results">
        <strong>
          {filteredPayments.length} {PAYMENT_TABLE_TEXT.paymentsFound}
        </strong>

        <span>
          {PAYMENT_TABLE_TEXT.page} {filteredPayments.length ? safePage : 0}{" "}
          {PAYMENT_TABLE_TEXT.of} {filteredPayments.length ? totalPages : 0}
        </span>
      </div>

      {/* Table */}
      <div className="barber-payments-table__scroll">
        <table className="barber-payments-table__table">
          <thead>
            <tr>
              <th>Payment / Order</th>
              <th>Customer</th>
              <th>Date &amp; Time</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedPayments.map((payment) => (
              <tr key={payment.id}>
                <td>
                  <div className="barber-payments-table__payment-id">
                    {payment.id}
                  </div>
                  <div className="barber-payments-table__secondary">
                    #{payment.orderId}
                  </div>
                </td>

                <td>
                  <span className="barber-payments-table__customer">
                    {payment.customer}
                  </span>
                </td>

                <td>
                  <div className="barber-payments-table__date">
                    {formatTableDate(payment.date)}
                  </div>
                  <div className="barber-payments-table__secondary">
                    {payment.time}
                  </div>
                </td>

                <td>
                  <span
                    className={`barber-payments-table__method barber-payments-table__method--${payment.method}`}
                  >
                    {payment.method === "cash" ? (
                      <Banknote size={17} />
                    ) : (
                      <CreditCard size={17} />
                    )}
                    {payment.method === "cash" ? "Cash" : "Online"}
                  </span>
                </td>

                <td>
                  <strong className="barber-payments-table__amount">
                    {formatTableCurrency(payment.amount)}
                  </strong>
                </td>

                <td>
                  <span
                    className={`barber-payments-table__status barber-payments-table__status--${payment.status}`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}

            {paginatedPayments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="barber-payments-table__empty"
                >
                  <FileText size={32} />
                  <strong>{PAYMENT_TABLE_TEXT.emptyTitle}</strong>
                  <span>
                    {PAYMENT_TABLE_TEXT.emptyDescription}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredPayments.length > 0 && (
        <footer className="barber-payments-table__pagination">
          <span className="barber-payments-table__pagination-info">
            Showing {(safePage - 1) * PAYMENT_TABLE_PAGE_SIZE + 1}–
            {Math.min(
              safePage * PAYMENT_TABLE_PAGE_SIZE,
              filteredPayments.length
            )}{" "}
            of {filteredPayments.length}
          </span>

          <div className="barber-payments-table__pagination-controls">
            <button
              type="button"
              aria-label="Previous page"
              disabled={safePage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  className={
                    safePage === page ? "is-active" : ""
                  }
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
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </footer>
      )}
    </section>
  );
};

export default BarberPaymentsTable;
