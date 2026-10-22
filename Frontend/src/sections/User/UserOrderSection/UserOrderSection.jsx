
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  PackageCheck,
} from "lucide-react";

import UserOrderCard from "../../../components/User/UserOrderCard/UserOrderCard";
import "./UserOrderSection.scss";

const FILTER_OPTIONS = [
  { label: "All Orders", value: "all" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const UserOrderSection = ({
  orders = [],
  loading = false,
  onViewDetails,
}) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = orders.filter((order) => {
      const status = String(order?.status || "pending").toLowerCase();

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "ongoing" &&
          ["ongoing", "in progress", "pending", "confirmed"].includes(status)) ||
        (activeFilter === "completed" && status === "completed") ||
        (activeFilter === "cancelled" && status === "cancelled");

      const shopName =
        order?.shop?.name ||
        order?.shopName ||
        order?.barber?.shopName ||
        "";

      const orderId = order?._id || order?.orderId || "";

      const serviceNames = [
        ...(Array.isArray(order?.services) ? order.services : []),
        ...(order?.service ? [order.service] : []),
      ]
        .map((service) =>
          typeof service === "string"
            ? service
            : service?.name || service?.serviceName || ""
        )
        .join(" ");

      const matchesSearch =
        !normalizedQuery ||
        String(orderId).toLowerCase().includes(normalizedQuery) ||
        shopName.toLowerCase().includes(normalizedQuery) ||
        serviceNames.toLowerCase().includes(normalizedQuery) ||
        status.includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a?.scheduledDate || 0).getTime();
      const dateB = new Date(b?.scheduledDate || 0).getTime();

      if (sortOrder === "oldest") {
        return dateA - dateB;
      }

      if (sortOrder === "price-high") {
        return Number(b?.totalAmount || 0) - Number(a?.totalAmount || 0);
      }

      if (sortOrder === "price-low") {
        return Number(a?.totalAmount || 0) - Number(b?.totalAmount || 0);
      }

      return dateB - dateA;
    });
  }, [orders, activeFilter, searchQuery, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ordersPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * ordersPerPage;

  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  const firstOrder = filteredOrders.length ? startIndex + 1 : 0;
  const lastOrder = Math.min(
    startIndex + ordersPerPage,
    filteredOrders.length
  );

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getFilterCount = (filter) => {
    if (filter === "all") {
      return orders.length;
    }

    return orders.filter((order) => {
      const status = String(order?.status || "pending").toLowerCase();

      if (filter === "ongoing") {
        return ["ongoing", "in progress", "pending", "confirmed"].includes(
          status
        );
      }

      return status === filter;
    }).length;
  };

  return (
    <section className="user-order-section">
      {/* Page heading */}
      <div className="user-order-section__header">
        <div className="user-order-section__heading-content">
          <span className="user-order-section__eyebrow">
            CUSTOMER ACCOUNT
          </span>

          <h1>My Orders</h1>

          <p>
            View your service orders, track bookings, and manage order details.
          </p>
        </div>

        <div className="user-order-section__order-count">
          <span className="user-order-section__count-icon">
            <ShoppingBag size={20} />
          </span>

          <div>
            <strong>{orders.length}</strong>
            <span>Total orders</span>
          </div>
        </div>
      </div>

      {/* Bubble filters */}
      <div className="user-order-section__toolbar">
        <div
          className="user-order-section__filters"
          aria-label="Filter orders by status"
        >
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`user-order-section__filter ${
                activeFilter === filter.value
                  ? "user-order-section__filter--active"
                  : ""
              }`}
              onClick={() => handleFilterChange(filter.value)}
              aria-pressed={activeFilter === filter.value}
            >
              {filter.label}

              <span className="user-order-section__filter-count">
                {getFilterCount(filter.value)}
              </span>
            </button>
          ))}
        </div>

        <div className="user-order-section__controls">
          <label className="user-order-section__search">
            <Search size={18} />

            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search orders, shops or services..."
              aria-label="Search orders"
            />
          </label>

          <label className="user-order-section__sort">
            <SlidersHorizontal size={17} />

            <select
              value={sortOrder}
              onChange={(event) => {
                setSortOrder(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Sort orders"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="price-high">Price: high to low</option>
              <option value="price-low">Price: low to high</option>
            </select>
          </label>
        </div>
      </div>

      {/* Order list */}
      <div className="user-order-section__list">
        {loading ? (
          <div className="user-order-section__state">
            <span className="user-order-section__loader" />
            <h3>Loading your orders</h3>
            <p>Please wait while we retrieve your order details.</p>
          </div>
        ) : paginatedOrders.length > 0 ? (
          paginatedOrders.map((order) => (
            <UserOrderCard
              key={order._id || order.orderId}
              order={order}
              onViewDetails={onViewDetails}
            />
          ))
        ) : (
          <div className="user-order-section__state">
            <span className="user-order-section__empty-icon">
              {searchQuery ? (
                <Search size={27} />
              ) : (
                <PackageCheck size={27} />
              )}
            </span>

            <h3>
              {searchQuery
                ? "No matching orders"
                : activeFilter === "all"
                  ? "No orders yet"
                  : `No ${activeFilter} orders`}
            </h3>

            <p>
              {searchQuery
                ? "Try a different search term or change your filters."
                : "Your service orders will appear here when available."}
            </p>

            {(searchQuery || activeFilter !== "all") && (
              <button
                type="button"
                className="user-order-section__reset-button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                  setCurrentPage(1);
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredOrders.length > 0 && (
        <div className="user-order-section__pagination">
          <p className="user-order-section__pagination-info">
            <CalendarDays size={15} />
            Showing{" "}
            <strong>
              {firstOrder}–{lastOrder}
            </strong>{" "}
            of <strong>{filteredOrders.length}</strong> orders
          </p>

          <div className="user-order-section__page-controls">
            <button
              type="button"
              className="user-order-section__page-button user-order-section__page-arrow"
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - safePage) <= 1
              )
              .reduce((pages, page, index, visiblePages) => {
                if (index > 0 && page - visiblePages[index - 1] > 1) {
                  pages.push("ellipsis");
                }

                pages.push(page);
                return pages;
              }, [])
              .map((page, index) =>
                page === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="user-order-section__ellipsis"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    className={`user-order-section__page-button ${
                      safePage === page
                        ? "user-order-section__page-button--active"
                        : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Page ${page}`}
                    aria-current={safePage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                )
              )}

            <button
              type="button"
              className="user-order-section__page-button user-order-section__page-arrow"
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <label className="user-order-section__page-size">
            <span>Rows per page</span>

            <select
              value={ordersPerPage}
              onChange={(event) => {
                setOrdersPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              aria-label="Orders per page"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
      )}
    </section>
  );
};

export default UserOrderSection;
