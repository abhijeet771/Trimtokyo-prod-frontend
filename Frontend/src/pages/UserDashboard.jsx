import React from "react";
import { useNavigate } from "react-router-dom";
import {  CalendarDays,  Bell,  ShoppingBag,} from "lucide-react";
import SideBarSection from "../sections/SideBarSection/SideBarSection";
import useUserOrders from "../hooks/useUserOrders";
import useNotifications from "../hooks/useNotifications";
import OrderCard from "../components/molecules/OrderCard/OrderCard";
import NotificationItem from "../components/molecules/NotificationItem/NotificationItem";

import Button from "../components/atoms/Button/Button";
import UserMapSection from "../sections/UserMapSection/UserMapSection";
import "./UserDashboard.scss";

const UserDashboard = () => {
  const navigate = useNavigate();

  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useUserOrders();

  const {
    notifications,
    loading: notificationsLoading,
    markAsRead,
  } = useNotifications();

  const handleNavigateToShop = () => {
    navigate("/shop");
  };

  /* =========================
     KPI DATA
  ========================= */

  const totalOrders = orders?.length || 0;

  const activeOrders =
    orders?.filter(
      (order) =>
        order.status !== "completed"
    ).length || 0;

  const unreadNotifications =
    notifications?.filter(
      (notification) => !notification.read
    ).length || 0;

  return (
    <>
      <SideBarSection />

      <div className="user-dashboard">

        {/* ================= HEADER ================= */}

        <div className="dashboard-header">

          <div>
            <p className="dashboard-header__tag">
              Welcome Back 👋
            </p>

            <h2>
              My Dashboard
            </h2>
          </div>

          <Button
            onClick={handleNavigateToShop}
          >
            Explore Services
          </Button>

        </div>

        {/* ================= KPI SECTION ================= */}

        <div className="dashboard-kpis">

          {/* KPI 1 */}
          <div className="dashboard-kpi-card">

            <div className="dashboard-kpi-card__icon pink">
              <ShoppingBag size={24} />
            </div>

            <div className="dashboard-kpi-card__content">
              <h3>{totalOrders}</h3>

              <p>Total Orders</p>
            </div>

          </div>

          {/* KPI 2 */}
          <div className="dashboard-kpi-card">

            <div className="dashboard-kpi-card__icon purple">
              <CalendarDays size={24} />
            </div>

            <div className="dashboard-kpi-card__content">
              <h3>{activeOrders}</h3>

              <p>Active Bookings</p>
            </div>

          </div>

          {/* KPI 3 */}
          <div className="dashboard-kpi-card">

            <div className="dashboard-kpi-card__icon blue">
              <Bell size={24} />
            </div>

            <div className="dashboard-kpi-card__content">
              <h3>{unreadNotifications}</h3>

              <p>Unread Notifications</p>
            </div>

          </div>

        </div>

        {/* ================= ORDERS ================= */}

        <div className="section">

          <div className="section__header">

            <div>
              <p className="section__tag">
                Recent Activity
              </p>

              <h3>
                My Orders
              </h3>
            </div>

            <Button
              variant="secondary"
              onClick={handleNavigateToShop}
            >
              Book Service
            </Button>

          </div>

          {ordersLoading && (
            <p>Loading orders...</p>
          )}

          {ordersError && (
            <p>{ordersError}</p>
          )}

          <div className="orders-grid">

            {orders.length === 0 &&
              !ordersLoading && (
                <p>No orders yet.</p>
              )}

            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
              />
            ))}

          </div>

        </div>

        {/* ================= MAP ================= */}

        <UserMapSection orders={orders} />

        {/* ================= NOTIFICATIONS ================= */}

        <div className="section">

          <div className="section__header">

            <div>
              <p className="section__tag">
                Updates
              </p>

              <h3>
                Notifications
              </h3>
            </div>

          </div>

          {notificationsLoading && (
            <p>Loading notifications...</p>
          )}

          <div className="notifications-list">

            {notifications.length === 0 &&
              !notificationsLoading && (
                <p>No notifications.</p>
              )}

            {notifications.map(
              (notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onRead={markAsRead}
                />
              )
            )}

          </div>

        </div>

      </div>
    </>
  );
};

export default UserDashboard;