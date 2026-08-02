import React, { useState } from "react";
import useAdminOrders from "../../hooks/useAdminOrders";
import useAdminKPIs from "../../hooks/useAdminKPIs";
import useLatestUsers from "../../hooks/useLatestUsers";
import useGetShop from "../../hooks/useGetShop";
import UserPanel from "../../components/organisms/UserPanel/UserPanel";
import BarberPanel from "../../components/organisms/BarberPanel/BarberPanel";
import "./AdminHeroSection.scss";

const AdminHeroSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showBarberPanel, setShowBarberPanel] =  useState(false);
  const ordersPerPage = 10;

  // Orders Hook
  const { orders, totalPages, totalOrders, loading, error, } = useAdminOrders(currentPage, ordersPerPage);

  // KPI Hook
  const {data: kpis, loading: kpiLoading, error: kpiError, } = useAdminKPIs();

  // Latest Users Hook
  const { users, loading: usersLoading, error: usersError, } = useLatestUsers();

  const {  barbers,  loading: barbersLoading,  error: barbersError,} = useGetShop();

 return (
  <>
    <div className="admin-hero">
      {/* ================= KPI CARDS ================= */}
      <div className="admin-hero__kpis">
        <div className="kpi-card">
          <h4>Total Orders</h4>
          <p>{kpiLoading ? "..." : kpis.totalOrders}</p>
        </div>

        <div className="kpi-card">
          <h4>Today Orders</h4>
          <p>{kpiLoading ? "..." : kpis.todaysOrders}</p>
        </div>

        <div className="kpi-card">
          <h4>Total Barbers</h4>
          <p>{kpiLoading ? "..." : kpis.totalBarbers}</p>
        </div>

        <div className="kpi-card">
          <h4>Total Users</h4>
          <p>{kpiLoading ? "..." : kpis.totalUsers}</p>
        </div>
      </div>

      {kpiError && (
        <p className="error">
          Failed to load KPI data
        </p>
      )}

      {/* ================= USERS TABLE ================= */}

      <div className="admin-hero__table">
        <div className="table-header">
          <h3>Latest Users</h3>

          <button
            className="view-all-btn"
            onClick={() =>
              setShowUserPanel(true)
            }
          >
            View All
          </button>
        </div>

        {usersLoading && (
          <p>Loading users...</p>
        )}

        {usersError && (
          <p className="error">
            {usersError}
          </p>
        )}

        {!usersLoading &&
          !usersError && (
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
                  users.map(
                    (
                      user,
                      index
                    ) => (
                      <tr key={index}>
                        <td>
                          {user.name}
                        </td>
                        <td>
                          {user.email}
                        </td>
                        <td>
                          {user.phone ||
                            "-"}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          )}
      </div>

      {/* ================= BARBERS TABLE ================= */}

      <div className="admin-hero__table">
        <div className="table-header">
          <h3>Latest Barbers</h3>

          <button
            className="view-all-btn"
            onClick={() =>
              setShowBarberPanel(true)
            }
          >
            View All
          </button>
        </div>

        {barbersLoading && (
          <p>Loading barbers...</p>
        )}

        {barbersError && (
          <p className="error">
            {barbersError}
          </p>
        )}

        {!barbersLoading &&
          !barbersError && (
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Phone</th>
                </tr>
              </thead>

              <tbody>
                {barbers.length ===
                0 ? (
                  <tr>
                    <td colSpan="3">
                      No barbers found
                    </td>
                  </tr>
                ) : (
                  barbers.map(
                    (
                      barber,
                      index
                    ) => (
                      <tr
                        key={
                          barber._id
                        }
                      >
                        <td>
                          {index + 1}
                        </td>
                        <td>
                          {
                            barber.name
                          }
                        </td>
                        <td>
                          {
                            barber.phone
                          }
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          )}
      </div>

      {/* ================= ORDERS TABLE ================= */}

      <div className="admin-hero__table">
        <h3>Recent Orders</h3>

        {loading && (
          <p>Loading orders...</p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {!loading &&
          !error && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Barber</th>
                    <th>Services</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length ===
                  0 ? (
                    <tr>
                      <td colSpan="6">
                        No orders
                        found
                      </td>
                    </tr>
                  ) : (
                    orders.map(
                      (
                        order
                      ) => (
                        <tr
                          key={
                            order.orderId
                          }
                        >
                          <td>
                            {
                              order.orderId
                            }
                          </td>
                          <td>
                            {
                              order.userName
                            }
                          </td>
                          <td>
                            {
                              order.barberName
                            }
                          </td>
                          <td>
                            {
                              order.services
                            }
                          </td>
                          <td>
                            ₹
                            {
                              order.amount
                            }
                          </td>
                          <td>
                            {
                              order.status
                            }
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  disabled={
                    currentPage ===
                    1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (
                        prev
                      ) =>
                        prev -
                        1
                    )
                  }
                >
                  Prev
                </button>

                <span>
                  Page{" "}
                  {
                    currentPage
                  }{" "}
                  of{" "}
                  {
                    totalPages
                  }
                </span>

                <button
                  disabled={
                    currentPage ===
                      totalPages ||
                    totalPages ===
                      0
                  }
                  onClick={() =>
                    setCurrentPage(
                      (
                        prev
                      ) =>
                        prev +
                        1
                    )
                  }
                >
                  Next
                </button>
              </div>
            </>
          )}
      </div>
    </div>

    {/* ================= USER DRAWER ================= */}

    <UserPanel
      open={showUserPanel}
      onClose={() =>
        setShowUserPanel(false)
      }
    />

    {/* ================= BARBER DRAWER ================= */}

    <BarberPanel
      open={showBarberPanel}
      onClose={() =>
        setShowBarberPanel(false)
      }
    />
  </>
);
};

export default AdminHeroSection;