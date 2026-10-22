
import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  CalendarClock,
  Banknote,
  Clock3,
  ReceiptText,
} from "lucide-react";

import "./UserPaymentSection.scss";

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDateTime = (value) => {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getCreatedOrder = (response) => {
  const data = response?.data ?? response;

  return (
    data?.order ??
    data?.data?.order ??
    data?.data ??
    data
  );
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Unable to place your order. Please try again.";

const UserPaymentSection = ({
  cartItems = [],
  totalAmount = 0,
  totalDuration = 0,
  salonName = "Selected salon",
  checkoutData,
  onBack,
  onPlaceOrder,
  onOrderSuccess,
}) => {
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderReference, setOrderReference] = useState("");

  const address = checkoutData?.deliveryAddress || {};
  const scheduledAt = checkoutData?.scheduledAt;

  const servicesCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  const handlePlaceOrder = async () => {
    if (placingOrder) return;

    if (!cartItems.length) {
      setOrderError("Your cart is empty. Please add a service first.");
      return;
    }

    if (!checkoutData?.deliveryAddress) {
      setOrderError(
        "Your service address is missing. Please return to checkout."
      );
      return;
    }

    if (!checkoutData?.customerLocation) {
      setOrderError(
        "Your location is missing. Please return to checkout and provide your location."
      );
      return;
    }

    if (!checkoutData?.scheduledAt) {
      setOrderError(
        "Please select your appointment date and time."
      );
      return;
    }

    if (new Date(checkoutData.scheduledAt).getTime() <= Date.now()) {
      setOrderError(
        "Your appointment must be scheduled for a future date and time."
      );
      return;
    }

    if (!checkoutData?.barberId) {
      setOrderError(
        "The salon's barber profile is missing. Please return to your cart and try again."
      );
      return;
    }

    const services = cartItems.map((item) => {
      const serviceId =
        item.serviceId ||
        item.service?._id ||
        item._id;

      return {
        serviceId: serviceId ? String(serviceId) : "",
        quantity: Math.max(1, Number(item.quantity) || 1),
      };
    });

    if (services.some((service) => !service.serviceId)) {
      setOrderError(
        "One or more services have missing IDs. Please remove those services and add them again."
      );
      return;
    }

    if (typeof onPlaceOrder !== "function") {
      setOrderError(
        "Order submission is not connected. Please contact support or try again later."
      );
      return;
    }

    const payload = {
      barberId: String(checkoutData.barberId),
      ...(checkoutData.staffId
        ? { staffId: String(checkoutData.staffId) }
        : {}),
      services,
      deliveryAddress: checkoutData.deliveryAddress,
      customerLocation: checkoutData.customerLocation,
      ...(checkoutData.barberLocation
        ? { barberLocation: checkoutData.barberLocation }
        : {}),
      scheduledAt: checkoutData.scheduledAt,
      isScheduled: checkoutData.isScheduled ?? true,
      paymentMethod: "COD",
    };

    setPlacingOrder(true);
    setOrderError("");

    try {
      const response = await onPlaceOrder(payload);
      const order = getCreatedOrder(response);

      // Do not show success if the response contains no created order.
      if (
        !order ||
        order.success === false ||
        order._id === undefined &&
          order.id === undefined &&
          order.orderId === undefined &&
          order.orderNumber === undefined
      ) {
        throw new Error(
          order?.message ||
            "The server did not confirm that your order was created."
        );
      }

      const reference =
        order.orderNumber ||
        order.orderId ||
        order._id ||
        order.id;

      setOrderReference(String(reference));
      setOrderPlaced(true);

      // The parent clears the cart only after successful creation.
      onOrderSuccess?.(order);
    } catch (error) {
      setOrderError(getErrorMessage(error));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <section className="user-payment">
        <div className="payment-success">
          <div className="payment-success__icon">
            <CheckCircle2 size={46} />
          </div>

          <span className="payment-success__eyebrow">
            ORDER CONFIRMED
          </span>

          <h1>Your order has been placed!</h1>

          <p className="payment-success__description">
            Your order was submitted successfully. Keep your
            order reference for future enquiries.
          </p>

          {orderReference && (
            <div className="payment-success__reference">
              <span>Order reference</span>
              <strong>{orderReference}</strong>
            </div>
          )}

          <div className="payment-success__details">
            <div>
              <span>Salon</span>
              <strong>{salonName}</strong>
            </div>

            <div>
              <span>Payment method</span>
              <strong>Cash on Delivery</strong>
            </div>

            <div>
              <span>Scheduled for</span>
              <strong>{formatDateTime(scheduledAt)}</strong>
            </div>

            <div>
              <span>Estimated total</span>
              <strong>{formatPrice(totalAmount)}</strong>
            </div>
          </div>

          <div className="payment-success__notice">
            <Banknote size={19} />
            <p>
              Pay in cash when your service is completed.
              Payment status remains pending until payment
              is collected and recorded.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="user-payment">
      <div className="user-payment__top">
        <button
          type="button"
          className="user-payment__back"
          onClick={onBack}
          disabled={placingOrder}
        >
          <ArrowLeft size={17} />
          Back to checkout
        </button>

        <span className="user-payment__secure">
          <ShieldCheck size={17} />
          Secure checkout
        </span>
      </div>

      <header className="user-payment__header">
        <span className="user-payment__eyebrow">
          STEP 3 OF 3
        </span>
        <h1>Review and confirm</h1>
        <p>Check your details before placing your order.</p>
      </header>

      <div className="user-payment__layout">
        <div className="user-payment__main">
          <section className="payment-card">
            <div className="payment-card__heading">
              <span className="payment-card__icon">
                <Banknote size={21} />
              </span>

              <div>
                <h2>Payment method</h2>
                <p>One simple way to pay for your service.</p>
              </div>
            </div>

            <div className="payment-cod">
              <span className="payment-cod__radio">
                <span />
              </span>

              <span className="payment-cod__icon">
                <Banknote size={23} />
              </span>

              <div className="payment-cod__content">
                <strong>Cash on Delivery (COD)</strong>
                <p>Pay in cash after your service is completed.</p>
              </div>

              <span className="payment-cod__selected">
                Selected
              </span>
            </div>

            <div className="payment-card__info">
              <ShieldCheck size={17} />
              No online payment is required at this stage.
            </div>
          </section>

          <section className="payment-card">
            <div className="payment-card__heading">
              <span className="payment-card__icon">
                <MapPin size={21} />
              </span>

              <div>
                <h2>Service address</h2>
                <p>Confirm where your service will take place.</p>
              </div>
            </div>

            <div className="payment-detail">
              <strong>{address.fullName || "Customer"}</strong>
              <span>{address.phone || "No phone provided"}</span>
              <span>
                {address.addressLine || "No address provided"}
              </span>
              <span>
                {[address.city, address.state, address.pincode]
                  .filter(Boolean)
                  .join(", ") || "Address incomplete"}
              </span>
            </div>
          </section>

          <section className="payment-card">
            <div className="payment-card__heading">
              <span className="payment-card__icon">
                <CalendarClock size={21} />
              </span>

              <div>
                <h2>Scheduled service</h2>
                <p>Your requested appointment time.</p>
              </div>
            </div>

            <div className="payment-schedule">
              <CalendarClock size={20} />

              <div>
                <strong>{formatDateTime(scheduledAt)}</strong>
                <span>{salonName}</span>
              </div>
            </div>
          </section>

          {orderError && (
            <div
              className="user-payment__error"
              role="alert"
            >
              {orderError}
            </div>
          )}

          <div className="user-payment__actions">
            <button
              type="button"
              className="user-payment__secondary"
              onClick={onBack}
              disabled={placingOrder}
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <button
              type="button"
              className="user-payment__primary"
              onClick={handlePlaceOrder}
              disabled={placingOrder || !cartItems.length}
            >
              {placingOrder ? (
                "Placing order..."
              ) : (
                <>
                  Confirm order
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        <aside className="payment-summary">
          <div className="payment-summary__heading">
            <ReceiptText size={20} />
            <h2>Order summary</h2>
          </div>

          <div className="payment-summary__salon">
            <MapPin size={16} />
            <span>{salonName}</span>
          </div>

          <div className="payment-summary__items">
            {cartItems.map((item, index) => {
              const quantity = Math.max(
                1,
                Number(item.quantity) || 1
              );

              return (
                <div
                  className="payment-summary__item"
                  key={
                    item.id ||
                    item.serviceId ||
                    item._id ||
                    index
                  }
                >
                  <div>
                    <strong>
                      {item.name ||
                        item.serviceName ||
                        item.title ||
                        "Service"}
                    </strong>

                    <span>
                      {quantity} × {formatPrice(item.price)}
                    </span>
                  </div>

                  <strong>
                    {formatPrice(
                      (Number(item.price) || 0) * quantity
                    )}
                  </strong>
                </div>
              );
            })}
          </div>

          <div className="payment-summary__row">
            <span>Services</span>
            <strong>{servicesCount}</strong>
          </div>

          <div className="payment-summary__row">
            <span>
              <Clock3 size={15} />
              Estimated duration
            </span>

            <strong>
              {totalDuration > 0
                ? `${totalDuration} min`
                : "To be confirmed"}
            </strong>
          </div>

          <div className="payment-summary__total">
            <span>Total to pay in cash</span>
            <strong>{formatPrice(totalAmount)}</strong>
          </div>

          <div className="payment-summary__cod-note">
            <ShieldCheck size={17} />
            <span>
              Payment is due after the service is completed.
            </span>
          </div>

          <p className="payment-summary__disclaimer">
            Final order confirmation depends on successful
            order submission and salon availability.
          </p>
        </aside>
      </div>
    </section>
  );
};

export default UserPaymentSection;
