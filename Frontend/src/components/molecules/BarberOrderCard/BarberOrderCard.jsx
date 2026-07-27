import { useState } from "react";
import { updateOrderStatus } from "../../../services/api";
import "./BarberOrderCard.scss";

const BarberOrderCard = ({ order }) => {
  const [currentStatus, setCurrentStatus] =    useState(order.status);
  const [loading, setLoading] =    useState(false);

  const handleStatusUpdate = async ( status ) => {
    try { setLoading(true);

      await updateOrderStatus( order._id, status);

      setCurrentStatus(status);} catch (err) {
      alert( err.response?.data?.message ||    "Failed to update order");
    } finally {  setLoading(false); }
  };

  // ================= SAFE DATE FORMATTER =================

  let formattedTime = "Immediate";

  if (order.scheduledAt) {
    const dateObj = new Date(
      order.scheduledAt
    );

    if (!isNaN(dateObj.getTime())) {
      formattedTime =
        dateObj.toLocaleString();
    }
  }

  // ================= AUTO CONFIRM CHECK =================

  const isAutoConfirmed =
    order.status === "CONFIRMED";

  return (
    <div className="barber-order-card">
      {/* ================= HEADER ================= */}

      <div className="barber-order-card__header">
        <div>
          <h4> Order # {order._id.slice(-6)}</h4>
          <p className="customer-name"> Customer:{" "} {order.userId?.name || "User"} </p> </div>
        <span className={`status ${currentStatus}`} >   {currentStatus} </span>
      </div>

      {/* ================= AUTO CONFIRM BADGE ================= */}

      {isAutoConfirmed && ( <div className="auto-confirm-badge"> Auto Confirmed</div>)}

      {/* ================= SERVICES ================= */}

      <div className="services-list">
        {order.services.map((service) => (
          <div   key={service.serviceId}   className="service-item" >
            <span>
              {service.title} ×{" "} {service.quantity}
            </span>

            <span>
              ₹{service.price * service.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* ================= DELIVERY ADDRESS ================= */}

      <div className="delivery-info">
        <h5>Delivery Address</h5>
        <p>{ order.deliveryAddress ?.fullName  }{" "}(
           {order.deliveryAddress ?.phone})
        </p>
        <p>{ order.deliveryAddress ?.addressLine}</p>
        <p>{order.deliveryAddress  ?.city},{" "}
          { order.deliveryAddress   ?.state}{" "}-{" "}
          { order.deliveryAddress  ?.pincode }
        </p>
      </div>

      {/* ================= FOOTER ================= */}

      <div className="barber-order-card__footer">
        <div>  <p> Scheduled:{" "} {formattedTime}</p></div>
        <div className="total">  Total: ₹  {order.totalAmount} </div>
      </div>

      {/* ================= ACTIONS ================= */}
      {/* PENDING -> ACCEPT / REJECT */}

      {currentStatus === "PENDING" && (
        <div className="actions">
          <button className="accept-btn" disabled={loading}
            onClick={() => handleStatusUpdate( "CONFIRMED")}>
            {loading   ? "Processing..." : "Accept"}
          </button>

          <button  className="reject-btn"  disabled={loading}
            onClick={() => handleStatusUpdate( "CANCELLED" )}>
            {loading  ? "Processing..." : "Reject"}
          </button>
        </div>
      )}

      {/* CONFIRMED -> START */}

      {currentStatus ===
        "CONFIRMED" && (
        <div className="actions">
          <button className="progress-btn" disabled={loading}
            onClick={() =>
              handleStatusUpdate(
                "IN_PROGRESS"
              )
            }
          >
            {loading ? "Starting..." : "Start Service"}
          </button>
        </div>
      )}

      {/* IN_PROGRESS -> COMPLETE */}

      {currentStatus ===
        "IN_PROGRESS" && (
        <div className="actions">
          <button className="complete-btn"
            disabled={loading}
            onClick={() =>  handleStatusUpdate( "COMPLETED" )}>
            {loading ? "Completing..." : "Mark Completed"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BarberOrderCard;