import {  CalendarDays,  Clock3,  IndianRupee,  Scissors, ChevronRight,} from "lucide-react";
import StatusBadge from "../../atoms/StatusBadge/StatusBadge";
import "./OrderCard.scss";

const OrderCard = ({ order }) => {
  const formattedDate = order?.scheduledDate
    ? new Date(
        order.scheduledDate
      ).toDateString()
    : "N/A";

  return (
    <div className="order-card">

      {/* ================= TOP ================= */}

      <div className="order-card__top">
        <div className="order-card__shop">
          <div className="order-card__shop-icon">
            <Scissors size={20} />
          </div>

          <div>
            <p className="order-card__label">
              Booking ID
            </p>

            <h4>
              #{order._id?.slice(-6)}
            </h4>
          </div>

        </div>

        <StatusBadge status={order.status} />

      </div>

      {/* ================= DETAILS ================= */}

      <div className="order-card__details">

        <div className="order-card__detail">

          <CalendarDays size={16} />

          <span>
            {formattedDate}
          </span>

        </div>

        <div className="order-card__detail">

          <Clock3 size={16} />

          <span>
            {order.scheduledTime}
          </span>

        </div>

        <div className="order-card__detail amount">

          <IndianRupee size={16} />

          <span>
            {order.totalAmount}
          </span>

        </div>

      </div>

      {/* ================= FOOTER ================= */}

      <div className="order-card__footer">

        <button>
          View Details

          <ChevronRight size={16} />
        </button>

      </div>

    </div>
  );
};

export default OrderCard;