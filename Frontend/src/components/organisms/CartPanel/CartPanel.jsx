import { useState } from "react";
import "./CartPanel.scss";
import { createOrder } from "../../../services/api";

const CartPanel = ({ cart, onClose, refreshDashboard }) => {
  const [address, setAddress] = useState({ fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "",  });
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const [bookingType, setBookingType] = useState("now"); // "now" | "schedule"
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const handleChange = (e) => {    setAddress({  ...address, [e.target.name]: e.target.value,}); };

  /* ------------------------ AUTO DETECT ADDRESS ------------------------ */

  const detectAddress = async () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );

          const data = await response.json();
          const addr = data.address || {};

          setAddress((prev) => ({
            ...prev,
            addressLine: addr.road || addr.neighbourhood || "",
            city: addr.city || addr.town || addr.village || "",
            state: addr.state || "",
            pincode: addr.postcode || "",
          }));
        } catch (err) {
          alert("Unable to detect address");
        } finally {
          setDetecting(false);
        }
      },
      () => {
        alert("Location permission required");
        setDetecting(false);
      }
    );
  };

  /* ------------------------ VALIDATION ------------------------ */

  const validateAddress = () => {
    if (
      !address.fullName || !address.phone ||  !address.addressLine ||  !address.city ||  !address.state ||    !address.pincode  ) {
      alert("Please fill complete delivery address");
      return false;
    }

    if (address.phone.length < 10) { alert("Enter valid phone number"); return false; }
    return true;
  };

  /* ------------------------ PLACE ORDER ------------------------ */

  const handleConfirmOrder = async () => {
    if (!validateAddress()) return;

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          let scheduledAt = null;

          if (bookingType === "schedule") {
            if (!scheduleDate || !scheduleTime) {
              alert("Please select date and time");
              setLoading(false);
              return;
            }

            scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`);

            if (scheduledAt <= new Date()) {
              alert("Please select future time");
              setLoading(false);
              return;
            }
          }

          await createOrder({
            barberId: cart.barberId,
            services: cart.items.map((item) => ({
              serviceId: item.serviceId,
              quantity: item.quantity,
            })),
            deliveryAddress: address,
            scheduledAt, // 🔥 NEW FIELD
            customerLocation: { lat, lng },
          });

          alert("Order Confirmed!");

          cart.clearCart();
          onClose();
          refreshDashboard?.();

        } catch (err) {
          alert(err.response?.data?.message || "Order failed");
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Location permission required to place order.");
        setLoading(false);
      }
    );
  };

  /* ------------------------ UI ------------------------ */

  return (
    <div className="cart-panel">
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button onClick={onClose}>✕</button>
      </div>

      {cart.items.length === 0 ? (
        <p>No items added.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.serviceId} className="cart-item">
              <div>
                <h4>{item.title}</h4>
                <p>₹{item.price} × {item.quantity}</p>
              </div>

              <div className="qty-controls">
                <button onClick={() => cart.decreaseQty(item.serviceId)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => cart.increaseQty(item.serviceId)}>
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <p>Total: ₹{cart.totalAmount}</p>
            <p>Duration: {cart.totalDuration} mins</p>
          </div>

          {/* 🔥 BOOKING TYPE */}

          <div className="schedule-section">
            <h4>Booking Type</h4>

            <div className="toggle">
              <button className={bookingType === "now" ? "active" : ""} onClick={() => setBookingType("now")} >
                Book Now
              </button>
              <button className={bookingType === "schedule" ? "active" : ""}  onClick={() => setBookingType("schedule")} >
                Schedule
              </button>
            </div>

            {bookingType === "schedule" && (
              <div className="schedule-inputs">
                <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}/>
                <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}/>
              </div>
            )}
          </div>
          <div className="address-form">
            <h4>Delivery Address</h4>

            <button type="button" className="detect-btn"  onClick={detectAddress}>
              {detecting ? "Detecting..." : "Use My Location"}
            </button>
            <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange}/>
            <input name="phone" placeholder="Phone Number" value={address.phone}    onChange={handleChange}/>
            <input name="addressLine" placeholder="Address Line" value={address.addressLine} onChange={handleChange}/>
            <input name="city" placeholder="City" value={address.city} onChange={handleChange}/>
            <input name="state" placeholder="State" value={address.state}  onChange={handleChange}/>
            <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange}/>
          </div>
          <button className="confirm-btn" onClick={handleConfirmOrder} disabled={loading} >
            {loading ? "Placing Order..." : "Confirm Order (COD)"}
          </button>
        </>
      )}
    </div>
  );
};

export default CartPanel;