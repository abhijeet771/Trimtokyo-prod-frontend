import React, { useState } from "react";
import TrackMap from "../../components/organisms/TrackMap/TrackMap";
import Button from "../../components/atoms/Button/Button";
import "./UserMapSection.scss";

const UserMapSection = ({ orders }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const confirmedOrders = orders.filter(
    (order) => order.status === "CONFIRMED"
  );

  if (confirmedOrders.length === 0) return null;

  return (
    <div className="section user-map-section">
      <h3>Track Orders</h3>

      <div className="track-buttons">
        {confirmedOrders.map((order) => (
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

export default UserMapSection;