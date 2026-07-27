import React, { useState } from "react";
import TrackMap from "../../components/organisms/TrackMap/TrackMap";
import Button from "../../components/atoms/Button/Button";
import "./BarberMapSection.scss";

const BarberMapSection = ({ orders }) => {
  const [selectedOrderId, setSelectedOrderId] =
    useState(null);

  const activeOrders = orders.filter(
    (order) =>
      order.status === "CONFIRMED" ||
      order.status === "IN_PROGRESS"
  );

  if (activeOrders.length === 0) return null;

  return (
    <div className="section barber-map-section">
      <h3>Active Delivery Routes</h3>

      <div className="track-buttons">
        {activeOrders.map((order) => (
          <Button
            key={order._id}
            variant="secondary"
            onClick={() =>
              setSelectedOrderId(
                selectedOrderId === order._id
                  ? null
                  : order._id
              )
            }
          >
            {selectedOrderId === order._id
              ? "Hide Map"
              : `Track Order ${order._id.slice(-5)}`}
          </Button>
        ))}
      </div>

      {selectedOrderId && (
        <div className="map-container">
          <TrackMap orderId={selectedOrderId} />
        </div>
      )}
    </div>
  );
};

export default BarberMapSection;