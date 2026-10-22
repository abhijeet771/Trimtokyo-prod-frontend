import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  LocateFixed,
} from "lucide-react";
import "./UserCheckoutSection.scss";

const getInitialForm = (initialData = {}) => {
  const data = initialData ?? {};
  const address = data.deliveryAddress ?? {};
  const location = data.customerLocation ?? {};

  let scheduledAt = "";

  if (data.scheduledAt) {
    const date = new Date(data.scheduledAt);

    if (!Number.isNaN(date.getTime())) {
      scheduledAt = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
    }
  }

  return {
    fullName: address.fullName ?? data.fullName ?? "",
    phone: address.phone ?? data.phone ?? "",
    addressLine: address.addressLine ?? data.addressLine ?? "",
    city: address.city ?? data.city ?? "",
    state: address.state ?? data.state ?? "",
    pincode: address.pincode ?? data.pincode ?? "",
    lat: location.lat ?? data.lat ?? "",
    lng: location.lng ?? data.lng ?? "",
    scheduledAt,
  };
};

/**
 * Normalize a salon location into { lat, lng }.
 *
 * GeoJSON coordinates use [longitude, latitude].
 * Other objects commonly use { lat, lng } or { latitude, longitude }.
 */
const normalizeLocation = (location) => {
  if (!location) return null;

  let lat;
  let lng;

  if (Array.isArray(location.coordinates)) {
    [lng, lat] = location.coordinates;
  } else if (Array.isArray(location)) {
    [lng, lat] = location;
  } else {
    lat =
      location.lat ??
      location.latitude ??
      location.coordinates?.lat;

    lng =
      location.lng ??
      location.longitude ??
      location.coordinates?.lng;
  }

  if (
    lat === undefined ||
    lng === undefined ||
    lat === null ||
    lng === null ||
    lat === "" ||
    lng === ""
  ) {
    return null;
  }

  lat = Number(lat);
  lng = Number(lng);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null;
  }

  return { lat, lng };
};

export default function UserCheckoutSection({
  initialData = null,
  salonName = "Selected salon",
  barberId = "",
  staffId = null,
  barberLocation = null,
  cartItems = [],
  totalAmount = 0,
  onBack,
  onContinue,
}) {
  const [form, setForm] = useState(() =>
    getInitialForm(initialData)
  );

  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  // Normalize the selected salon's location independently of
  // the customer's current location.
  const normalizedBarberLocation = normalizeLocation(barberLocation);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Location is not supported by this browser.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({
          ...current,
          lat: String(coords.latitude),
          lng: String(coords.longitude),
        }));

        setLocating(false);
        setError("");
      },
      () => {
        setLocating(false);
        setError(
          "Could not get your location. Please allow location access or enter your address."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleContinue = (event) => {
    event.preventDefault();
    setError("");

    if (!cartItems.length) {
      setError("Your cart is empty. Add a service before checkout.");
      return;
    }

    if (!barberId) {
      setError(
        "Salon information is missing. Return to the salon page and add the service again."
      );
      return;
    }

    const requiredFields = [
      "fullName",
      "phone",
      "addressLine",
      "city",
      "state",
      "pincode",
    ];

    if (
      requiredFields.some(
        (key) => !String(form[key] ?? "").trim()
      )
    ) {
      setError("Please complete all address fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    const lat = Number(form.lat);
    const lng = Number(form.lng);

    if (
      form.lat === "" ||
      form.lng === "" ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      setError(
        "Please share your current location using the location button."
      );
      return;
    }

    if (!normalizedBarberLocation) {
      setError(
        "This salon has no valid saved map coordinates. The salon owner needs to update the salon location before this booking can continue."
      );
      return;
    }

    if (!form.scheduledAt) {
      setError("Please select a date and time.");
      return;
    }

    const scheduledDate = new Date(form.scheduledAt);

    if (
      Number.isNaN(scheduledDate.getTime()) ||
      scheduledDate <= new Date()
    ) {
      setError("Choose a future date and time.");
      return;
    }

    const services = cartItems.map((item) => {
      const serviceId = String(
        item.serviceId || item._id || ""
      );

      const quantity =
        item.quantity === undefined || item.quantity === null
          ? 1
          : Number(item.quantity);

      return {
        serviceId,
        quantity,
      };
    });

    const invalidService = services.some(
      (service) =>
        !service.serviceId ||
        !Number.isInteger(service.quantity) ||
        service.quantity < 1
    );

    if (invalidService) {
      setError(
        "One or more cart services are invalid. Remove and re-add those services from the salon page."
      );
      return;
    }

    const checkoutData = {
      barberId: String(barberId),
      ...(staffId ? { staffId: String(staffId) } : {}),
      services,

      deliveryAddress: {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        addressLine: form.addressLine.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      },

      // Customer's location is not the salon's location.
      customerLocation: {
        lat,
        lng,
      },

      // The selected salon's saved location.
      barberLocation: normalizedBarberLocation,

      scheduledAt: scheduledDate.toISOString(),
      isScheduled: true,
      paymentMethod: "COD",
    };

    onContinue?.(checkoutData);
  };

  const minDateTime = (() => {
    const now = new Date();

    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0, 16);
  })();

  return (
    <section className="checkout-page">
      <header className="checkout-page__header">
        <button
          type="button"
          className="checkout-page__back"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back to cart
        </button>

        <span className="checkout-page__step">STEP 2 OF 3</span>

        <h1>Delivery details</h1>
        <p>Where should your barber meet you?</p>
      </header>

      <div className="checkout-page__layout">
        <form
          className="checkout-card"
          onSubmit={handleContinue}
        >
          <div className="checkout-card__title">
            <div>
              <h2>Address and schedule</h2>
              <p>Enter your details for this booking.</p>
            </div>

            <MapPin size={21} />
          </div>

          <div className="checkout-form">
            <label>
              Full name
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </label>

            <label>
              Mobile number
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                required
              />
            </label>

            <label className="checkout-form__wide">
              Address
              <input
                name="addressLine"
                value={form.addressLine}
                onChange={handleChange}
                autoComplete="street-address"
                required
              />
            </label>

            <label>
              City
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                autoComplete="address-level2"
                required
              />
            </label>

            <label>
              State
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                autoComplete="address-level1"
                required
              />
            </label>

            <label>
              PIN code
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={6}
                autoComplete="postal-code"
                required
              />
            </label>

            <div className="checkout-location checkout-form__wide">
              <div>
                <strong>Your service address location</strong>

                <p>
                  {form.lat !== "" && form.lng !== ""
                    ? `Your location saved (${Number(form.lat).toFixed(4)}, ${Number(form.lng).toFixed(4)})`
                    : "Share your location so the barber can find you."}
                </p>
              </div>

              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={locating}
              >
                <LocateFixed size={16} />
                {locating ? "Locating..." : "Use my location"}
              </button>
            </div>

            <div className="checkout-location checkout-form__wide">
              <div>
                <strong>Selected salon location</strong>

                <p>
                  {normalizedBarberLocation
                    ? `Salon coordinates (${normalizedBarberLocation.lat.toFixed(4)}, ${normalizedBarberLocation.lng.toFixed(4)})`
                    : "The salon's saved map coordinates are unavailable."}
                </p>
              </div>
            </div>

            <label className="checkout-form__wide">
              Preferred date and time
              <input
                type="datetime-local"
                name="scheduledAt"
                min={minDateTime}
                value={form.scheduledAt}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {error && (
            <p
              className="checkout-page__error"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="checkout-card__footer">
            <button
              type="button"
              className="checkout-page__secondary"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              type="submit"
              className="checkout-page__primary"
            >
              Continue to payment
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <aside className="checkout-summary">
          <span className="checkout-summary__eyebrow">
            YOUR BOOKING
          </span>

          <h2>{salonName}</h2>

          <p>
            {cartItems.length}{" "}
            {cartItems.length === 1 ? "service" : "services"} selected
          </p>

          <div className="checkout-summary__items">
            {cartItems.map((item) => {
              const quantity = Number(item.quantity) || 1;
              const price = Number(item.price) || 0;

              return (
                <div
                  key={item.serviceId || item._id || item.id}
                >
                  <span>
                    {item.name ||
                      item.serviceName ||
                      item.title ||
                      "Grooming service"}{" "}
                    × {quantity}
                  </span>

                  <strong>
                    ₹ {(price * quantity).toLocaleString("en-IN")}
                  </strong>
                </div>
              );
            })}
          </div>

          <div className="checkout-summary__total">
            <span>Estimated total</span>

            <strong>
              ₹{" "}
              {(Number(totalAmount) || 0).toLocaleString("en-IN")}
            </strong>
          </div>

          <small>Payment method: Cash on Delivery</small>
        </aside>
      </div>
    </section>
  );
}
