
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  CheckCircle2,
  UserRound,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import {
  OVERVIEW_STATS,
  OVERVIEW_BOOKINGS,
  OVERVIEW_ORDERS,
  PROFILE_COMPLETION_FIELDS,
  OVERVIEW_PROMO,
} from "../../../constants/UserOverview.constants";

import "./UserOverviewSection.scss";

const UserOverviewSection = ({
  user = {},
  cartItems = [],
  bookings = [],
  orders = [],
  notifications = [],
  loading = false,
}) => {
  const navigate = useNavigate();

  const profile = user?.profile || user || {};

  const profileCompletion = useMemo(() => {
    const isPresent = (field) => {
      const value = profile?.[field];

      if (field === "avatar") {
        return Boolean(value || profile?.profileImage || profile?.image);
      }

      if (field === "address") {
        return Boolean(
          value ||
          profile?.addressLine1 ||
          profile?.addresses?.length
        );
      }

      return typeof value === "string"
        ? value.trim().length > 0
        : Boolean(value);
    };

    const completed = PROFILE_COMPLETION_FIELDS.filter(isPresent).length;

    return Math.round(
      (completed / PROFILE_COMPLETION_FIELDS.length) * 100
    );
  }, [profile]);

  const upcomingBookings = bookings.length
    ? bookings.filter((booking) => {
        const status = String(booking.status || "").toLowerCase();

        return ![
          "cancelled",
          "canceled",
          "completed",
          "rejected",
        ].includes(status);
      })
    : OVERVIEW_BOOKINGS;

  const recentOrders = orders.length
    ? [...orders].slice(-3).reverse()
    : OVERVIEW_ORDERS;

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.read && !notification.isRead
  ).length;

  const stats = OVERVIEW_STATS.map((item) => {
    let value = item.value;

    if (item.key === "cart") value = cartItems.length;
    if (item.key === "bookings") value = upcomingBookings.length;
    if (item.key === "orders") value = orders.length;
    if (item.key === "notifications") value = unreadCount;

    return { ...item, value };
  });

  const formatPrice = (price) => {
    const amount = Number(price || 0);

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getOrderName = (order) =>
    order.name ||
    order.serviceName ||
    order.title ||
    order.services?.[0]?.name ||
    "Grooming Service";

  const getBookingName = (booking) =>
    booking.salon ||
    booking.shopName ||
    booking.barberShopName ||
    booking.barberName ||
    "Salon Booking";

  const getStatusClass = (status) =>
    String(status || "pending")
      .toLowerCase()
      .replace(/\s+/g, "-");

  const getDate = (item) =>
    item.date ||
    item.bookingDate ||
    item.createdAt ||
    item.orderDate ||
    "";

  const handleStatClick = (action) => {
    const routes = {
      cart: "/cart",
      bookings: "/cart",
      orders: "/cart",
      notifications: "/cart",
    };

    navigate(routes[action] || "/cart");
  };

  return (
    <section className="user-overview">
      <header className="user-overview__header">
        <div>
          <p className="user-overview__eyebrow">
            YOUR TRIMTOKYO SPACE
          </p>
          <h1>
            Welcome back
            {profile.name ? `, ${profile.name.split(" ")[0]}` : ""}!
          </h1>
          <p className="user-overview__subtitle">
            Manage your grooming appointments, orders and profile.
          </p>
        </div>

        <button
          className="user-overview__profile-link"
          onClick={() => navigate("/profile")}
          type="button"
        >
          <UserRound size={17} />
          My Profile
          <ArrowRight size={16} />
        </button>
      </header>

      <div className="user-overview__stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <button
              className="overview-stat"
              key={stat.key}
              type="button"
              onClick={() => handleStatClick(stat.action)}
            >
              <span
                className={`overview-stat__icon overview-stat__icon--${stat.color}`}
              >
                <Icon size={21} />
              </span>

              <span className="overview-stat__content">
                <span className="overview-stat__label">
                  {stat.label}
                </span>
                <strong>{stat.value}</strong>
                <span className="overview-stat__description">
                  {stat.description}
                </span>
              </span>

              <ChevronRight
                className="overview-stat__arrow"
                size={17}
              />
            </button>
          );
        })}
      </div>

      <div className="user-overview__main-grid">
        <section className="overview-panel overview-panel--bookings">
          <div className="overview-panel__header">
            <div>
              <h2>Upcoming Bookings</h2>
              <p>Your next grooming appointments</p>
            </div>

            <button
              className="overview-text-link"
              onClick={() => navigate("/cart")}
              type="button"
            >
              View all <ArrowRight size={15} />
            </button>
          </div>

          {loading ? (
            <p className="overview-empty">Loading bookings...</p>
          ) : upcomingBookings.length ? (
            <div className="overview-booking-list">
              {upcomingBookings.slice(0, 3).map((booking, index) => (
                <article
                  className="overview-booking"
                  key={booking._id || booking.id || index}
                >
                  <div className="overview-booking__image">
                    {booking.image || booking.shopImage ? (
                      <img
                        src={booking.image || booking.shopImage}
                        alt={getBookingName(booking)}
                      />
                    ) : (
                      <CalendarDays size={25} />
                    )}
                  </div>

                  <div className="overview-booking__details">
                    <h3>{getBookingName(booking)}</h3>
                    <p>
                      {booking.service ||
                        booking.serviceName ||
                        booking.services?.[0]?.name ||
                        "Grooming appointment"}
                    </p>

                    <div className="overview-booking__meta">
                      <span>
                        <CalendarDays size={13} />
                        {getDate(booking)
                          ? new Date(getDate(booking)).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Date pending"}
                      </span>

                      <span>
                        <Clock3 size={13} />
                        {booking.time || booking.bookingTime || "Time pending"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`overview-status overview-status--${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <div className="overview-empty">
              <CalendarDays size={30} />
              <p>No upcoming bookings yet.</p>
              <button
                type="button"
                onClick={() => navigate("/search")}
              >
                Explore salons
              </button>
            </div>
          )}
        </section>

        <section className="overview-panel overview-panel--orders">
          <div className="overview-panel__header">
            <div>
              <h2>Recent Orders</h2>
              <p>Your latest activity</p>
            </div>

            <button
              className="overview-text-link"
              onClick={() => navigate("/cart")}
              type="button"
            >
              View all <ArrowRight size={15} />
            </button>
          </div>

          {loading ? (
            <p className="overview-empty">Loading orders...</p>
          ) : recentOrders.length ? (
            <div className="overview-order-list">
              {recentOrders.slice(0, 3).map((order, index) => (
                <article
                  className="overview-order"
                  key={order._id || order.id || index}
                >
                  <div className="overview-order__image">
                    {order.image || order.serviceImage ? (
                      <img
                        src={order.image || order.serviceImage}
                        alt={getOrderName(order)}
                      />
                    ) : (
                      <Sparkles size={23} />
                    )}
                  </div>

                  <div className="overview-order__details">
                    <h3>{getOrderName(order)}</h3>
                    <p>
                      {order.services?.length
                        ? `${order.services.length} services`
                        : order.serviceCount
                          ? `${order.serviceCount} services`
                          : "Grooming service"}
                    </p>
                    <span className="overview-order__date">
                      {getDate(order)
                        ? new Date(getDate(order)).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Recent order"}
                    </span>
                  </div>

                  <div className="overview-order__right">
                    <strong>
                      {formatPrice(order.totalAmount ?? order.total ?? order.price)}
                    </strong>
                    <span
                      className={`overview-status overview-status--${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="overview-empty">
              <Sparkles size={30} />
              <p>No orders to show yet.</p>
              <button
                type="button"
                onClick={() => navigate("/search")}
              >
                Browse services
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="user-overview__bottom-grid">
        <section className="overview-promo">
          <div className="overview-promo__content">
            <span>{OVERVIEW_PROMO.eyebrow}</span>
            <h2>{OVERVIEW_PROMO.title}</h2>
            <p>{OVERVIEW_PROMO.description}</p>

            <button
              type="button"
              onClick={() => navigate(OVERVIEW_PROMO.route)}
            >
              {OVERVIEW_PROMO.buttonText}
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="overview-promo__decoration">
            <Sparkles size={76} strokeWidth={1.1} />
          </div>
        </section>

        <section className="overview-panel overview-profile">
          <div className="overview-panel__header">
            <div>
              <h2>Complete Your Profile</h2>
              <p>Get the most out of TrimTokyo</p>
            </div>
            <UserRound size={21} />
          </div>

          <div className="overview-profile__content">
            <div
              className="overview-profile__chart"
              style={{
                "--profile-progress": `${profileCompletion}%`,
              }}
              role="img"
              aria-label={`Profile ${profileCompletion}% complete`}
            >
              <div className="overview-profile__chart-center">
                <strong>{profileCompletion}%</strong>
                <span>Complete</span>
              </div>
            </div>

            <div className="overview-profile__details">
              <h3>
                {profileCompletion === 100
                  ? "You're all set!"
                  : "You're making progress"}
              </h3>
              <p>
                {profileCompletion === 100
                  ? "Your profile is complete and ready to go."
                  : "Add your details to make bookings quicker and easier."}
              </p>

              <div className="overview-profile__progress">
                <span
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => navigate("/profile")}
              >
                {profileCompletion === 100
                  ? "View Profile"
                  : "Complete Your Profile"}
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="overview-profile__hint">
            <CheckCircle2 size={15} />
            Your details help simplify future bookings.
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserOverviewSection;
