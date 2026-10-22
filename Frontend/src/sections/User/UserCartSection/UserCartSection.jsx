import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Scissors, Plus, Minus, Trash2, ArrowRight, ArrowLeft, Clock3, Store, Sparkles, ShoppingCart, Tag,
} from "lucide-react";

import "./UserCartSection.scss";
import UserCheckoutSection from "../UserCheckoutSection/UserCheckoutSection";
import UserPaymentSection from "../UserPaymentSection/UserPaymentSection";
import { createOrder } from "../../../services/order.service.js";

/**
 * Normalize salon coordinates from supported location formats.
 * GeoJSON coordinates are [longitude, latitude].
 */
const normalizeSalonLocation = (...candidates) => {
  for (const location of candidates) {
    if (!location) continue;

    let lat;
    let lng;

    if (Array.isArray(location.coordinates)) {
      [lng, lat] = location.coordinates;
    } else if (location.location && Array.isArray(location.location.coordinates)
    ) {
      [lng, lat] = location.location.coordinates;
    } else {
      lat = location.lat ?? location.latitude;
      lng = location.lng ?? location.longitude;
    }

    lat = Number(lat);
    lng = Number(lng);

    if ( Number.isFinite(lat) && Number.isFinite(lng) &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180 &&
      !(lat === 0 && lng === 0)
    ) {
      return { lat, lng };
    }
  }

  return null;
};

const UserCartSection = ({ user = {}, cartItems = [], onRemoveItem, onUpdateQuantity, onAddService, onClearCart,
}) => {
  const navigate = useNavigate();

  const [step, setStep] = useState("cart");
  const [checkoutData, setCheckoutData] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");

  // Cart items are managed by CartContext through UserDashboard.
  const items = useMemo(
    () => (Array.isArray(cartItems) ? cartItems : []),[cartItems]);

  // One order must contain services from one salon.
  const salonSlugs = useMemo(
    () => [...new Set(items.map((item) => item.salonSlug).filter(Boolean)),],[items]
  );

  // Resolve the BarberProfile MongoDB ID, not the Auth user ID or slug.
  const barberIds = useMemo(
    () => [
      ...new Set(
        items.map(
            (item) => item.barberProfileId || item.barberId ||
              item.barberProfile?.id ||item.barberProfile?._id
          ).filter(Boolean).map(String)
      ),
    ],
    [items]
  );

  const staffIds = useMemo(
    () => [
      ...new Set(
        items.map((item) => item.staffId || item.staff?._id).filter(Boolean).map(String)),
    ],
    [items]
  );

  const barberId = barberIds.length === 1 ? barberIds[0] : "";
  const staffId = staffIds.length === 1 ? staffIds[0] : "";

  const salonName = items.find((item) => item.salonName)?.salonName ||
    items.find((item) => item.salon)?.salon ||
    items.find((item) => item.shopName)?.shopName ||
    items.find((item) => item.barberProfile?.shopName)?.barberProfile ?.shopName || "Selected salon";

  const barberLocation = useMemo(() => {
    for (const item of items) {
      const location = normalizeSalonLocation(
        item.barberLocation,
        item.salonLocation,
        item.barberProfile?.location,
        item.salon?.location,
        item.location
      );

      if (location) return location;
    }

    return null;
  }, [items]);

  const profile = user?.profile || user || {};

  const firstName = String(profile.firstName || profile.name || "").trim().split(/\s+/)[0];

  const updateQuantity = (id, change) => {
    const item = items.find(
      (cartItem) => String(cartItem.id) === String(id)
    );

    if (!item) return;

    const currentQuantity = Math.max(1, Number(item.quantity) || 1);
    const nextQuantity = Math.max(1, currentQuantity + change);

    if (nextQuantity === currentQuantity) return;

    onUpdateQuantity?.(id, nextQuantity);
  };

  const removeItem = (id) => {
    onRemoveItem?.(id);
  };

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>total +(Number(item.price) || 0) * (Number(item.quantity) || 1),0),
    [items]
  );

  const totalQuantity = useMemo(
    () =>items.reduce((total, item) => total + (Number(item.quantity) || 1),0),
    [items]
  );

  const totalDuration = useMemo(
    () =>
      items.reduce((total, item) =>total +(Number(item.duration) || 0) * (Number(item.quantity) || 1),0),
    [items]
  );

  const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const formatDuration = (minutes) => { const duration = Number(minutes) || 0;

    if (duration <= 0) return "Duration varies";
    if (duration < 60) return `${duration} min`;

    const hours = Math.floor(duration / 60);
    const remainingMinutes = duration % 60;

    return remainingMinutes ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`;
  };

  const handleAddService = () => {
    if (onAddService) {
      onAddService();
      return;
    }

    const salonSlug = items.find((item) => item.salonSlug)?.salonSlug;

    if (salonSlug) {
      navigate(`/salon/${encodeURIComponent(salonSlug)}#salon-services`);
      return;
    }
    navigate("/search");
  };

  const handleProceedToCheckout = () => {
    setCheckoutError("");

    if (!items.length) {setCheckoutError("Add at least one service before checkout.");return;}

    if (salonSlugs.length > 1) {
      setCheckoutError("Please keep services from one salon per order. Remove services from another salon to continue.");
      return;
    }

    if (barberIds.length !== 1 || !barberId) {
      setCheckoutError("We couldn't identify the salon's barber profile. Please remove these services and add them again from the salon's service page.");
      return;
    }

    if (staffIds.length > 1) {
      setCheckoutError("Please select services assigned to one staff member per order.");
      return;
    }

    const missingService = items.some((item) => !(item.serviceId || item._id || item.service?._id));

    if (missingService) {
      setCheckoutError(
        "Some services are missing their service IDs. Please remove them and add them again from the salon's service page."
      );
      return;
    }

    if (!barberLocation) {
      console.error(
        "Salon location is missing from cart items:",
        items.map((item) => ({
          serviceId: item.serviceId || item._id,
          salonSlug: item.salonSlug,
          barberProfileId: item.barberProfileId || item.barberId,
          barberLocation: item.barberLocation,
          salonLocation: item.salonLocation,
          location: item.location,
        }))
      );

      setCheckoutError("The salon coordinates are missing from your saved cart items. Remove the selected services, return to the salon page, add the services again, and retry checkout.");
      return;
    }

    setStep("checkout");
  };

  if (step === "checkout") {
    return (
      <UserCheckoutSection
        initialData={checkoutData}
        salonName={salonName}
        barberLocation={barberLocation}
        cartItems={items}
        barberId={barberId}
        staffId={staffId || undefined}
        totalAmount={subtotal}
        onBack={() => {setCheckoutError("");setStep("cart");}}
        onContinue={(data) => {
          setCheckoutData(data);
          setCheckoutError("");
          setStep("payment");
        }}
      />
    );
  }

if (step === "payment") {
  return (
    <UserPaymentSection
      cartItems={items}
      totalAmount={subtotal}
      totalDuration={totalDuration}
      salonName={salonName}
      checkoutData={checkoutData}
      onBack={() => setStep("checkout")}
      onPlaceOrder={async (payload) => {
        const response = await createOrder(payload);

        if (!response?.data?.success || !response?.data?.data) {
          throw new Error(
            response?.data?.message || "Failed to place order."
          );
        }

        return response.data.data;
      }}
      onOrderSuccess={() => {
        // Clear the cart only after the backend confirms order creation.
        // Keep this component on the payment step so the success screen remains visible.
        onClearCart?.();
        setCheckoutError("");
      }}
    />
  );
}

  return (
    <section className="user-cart">
      <header className="user-cart__header">
        <div className="user-cart__heading">
          <span className="user-cart__eyebrow">
            YOUR PERSONAL GROOMING SPACE
          </span>

          <h1>{firstName ? `${firstName}'s Cart` : "My Cart"}</h1>

          <p>Review your selected services before continuing.</p>
        </div>

        <div className="user-cart__count">
          <ShoppingCart size={18} />
          <span>
            {totalQuantity}{" "}
            {totalQuantity === 1 ? "service" : "services"}
          </span>
        </div>
      </header>

      <div className="user-cart__layout">
        <div className="user-cart__main">
          <div className="user-cart__section-heading">
            <div>
              <h2>Selected Services</h2>
              <p>
                {items.length} {items.length === 1 ? "item" : "items"} in
                your cart
              </p>
            </div>

            <button
              className="user-cart__add-link"
              type="button"
              onClick={handleAddService}
            >
              <Plus size={16} />
              Add Service
            </button>
          </div>

          {items.length > 0 ? (
            <div className="user-cart__items">
              {items.map((item) => {
                const quantity = Math.max(1, Number(item.quantity) || 1);
                const itemId = item.id || item.serviceId || item._id;
                const serviceName =
                  item.name ||
                  item.serviceName ||
                  item.title ||
                  "Grooming Service";

                return (
                  <article className="cart-service" key={itemId}>
                    <div className="cart-service__icon">
                      {item.image || item.serviceImage ? (
                        <img
                          src={item.image || item.serviceImage}
                          alt={serviceName}
                        />
                      ) : (
                        <Scissors size={29} strokeWidth={1.6} />
                      )}
                    </div>

                    <div className="cart-service__details">
                      <span className="cart-service__category">
                        GROOMING SERVICE
                      </span>

                      <h3>{serviceName}</h3>

                      <p className="cart-service__description">
                        {item.description ||
                          "Professional grooming service"}
                      </p>

                      <div className="cart-service__meta">
                        <span>
                          <Store size={14} />
                          {item.salon ||
                            item.shopName ||
                            item.salonName ||
                            "Selected salon"}
                        </span>

                        <span>
                          <Clock3 size={14} />
                          {formatDuration(item.duration)}
                        </span>
                      </div>

                      <div className="cart-service__mobile-actions">
                        <div className="cart-service__quantity">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${serviceName}`}
                            disabled={quantity <= 1}
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus size={14} />
                          </button>

                          <span>{quantity}</span>

                          <button
                            type="button"
                            aria-label={`Increase quantity of ${serviceName}`}
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          className="cart-service__remove"
                          type="button"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart-service__right">
                      <strong>
                        {formatPrice(
                          (Number(item.price) || 0) * quantity
                        )}
                      </strong>

                      <span className="cart-service__unit-price">
                        {formatPrice(item.price)} / service
                      </span>

                      <div className="cart-service__quantity">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${serviceName}`}
                          disabled={quantity <= 1}
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus size={14} />
                        </button>

                        <span>{quantity}</span>

                        <button
                          type="button"
                          aria-label={`Increase quantity of ${serviceName}`}
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        className="cart-service__remove"
                        type="button"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="user-cart__empty">
              <div className="user-cart__empty-icon">
                <ShoppingBag size={35} />
              </div>

              <h2>Your cart is empty</h2>

              <p>
                Explore grooming services and add your favourites here.
              </p>

              <button type="button" onClick={handleAddService}>
                <Plus size={17} />
                Add Your First Service
              </button>
            </div>
          )}

          <button
            className="user-cart__continue"
            type="button"
            onClick={handleAddService}
          >
            <ArrowLeft size={16} />
            Continue Exploring Services
          </button>
        </div>

        <aside className="cart-summary">
          <div className="cart-summary__heading">
            <div className="cart-summary__heading-icon">
              <ShoppingBag size={19} />
            </div>

            <div>
              <h2>Cart Summary</h2>
              <p>Review your selected services</p>
            </div>
          </div>

          <div className="cart-summary__rows">
            <div>
              <span>Services selected</span>
              <strong>{totalQuantity}</strong>
            </div>

            <div>
              <span>Estimated duration</span>
              <strong>
                {totalDuration > 0
                  ? formatDuration(totalDuration)
                  : "To be confirmed"}
              </strong>
            </div>

            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div>
              <span>Additional charges</span>
              <strong>At booking</strong>
            </div>
          </div>

          <div className="cart-summary__total">
            <span>Estimated total</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <p className="cart-summary__note">
            <Tag size={15} />
            Final charges, availability and booking details can be
            confirmed when you continue.
          </p>

          {checkoutError && (
            <p className="user-cart__checkout-error" role="alert">
              {checkoutError}
            </p>
          )}

          <button
            className="cart-summary__checkout"
            type="button"
            onClick={handleProceedToCheckout}
            disabled={items.length === 0}
          >
            Continue to Checkout
            <ArrowRight size={17} />
          </button>

          <button
            className="cart-summary__add"
            type="button"
            onClick={handleAddService}
          >
            <Plus size={17} />
            Add More Services
            <ArrowRight size={16} />
          </button>

          <div className="cart-summary__footer">
            <Sparkles size={16} />
            <span>
              Discover services tailored to your grooming needs.
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default UserCartSection;