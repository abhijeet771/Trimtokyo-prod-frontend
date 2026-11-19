
import { useEffect, useState } from "react";
import {
  X,
  Plus,
  Trash2,
  ShoppingBag,
  User,
  Scissors,
  MapPin,
  CalendarDays,
  Loader2,
} from "lucide-react";
import "./AdminOrderDialog.scss";

const initialForm = {
  customerName: "",
  phone: "",
  barberName: "",
  scheduledAt: "",
  status: "CONFIRMED",
  paymentStatus: "PENDING",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  latitude: "",
  longitude: "",
};

const newService = () => ({
  id: `${Date.now()}-${Math.random()}`,
  name: "",
  quantity: 1,
});

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  step,
  min,
  hint,
  full = false,
}) => (
  <div className={`admin-order-field${full ? " full" : ""}`}>
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      step={step}
      min={min}
    />
    {hint && <small>{hint}</small>}
  </div>
);

const AdminOrderDialog = ({
  open,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [form, setForm] = useState(initialForm);
  const [services, setServices] = useState([newService()]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setServices([newService()]);
      setFormError("");
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateService = (id, field, value) => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeService = (id) => {
    setServices((prev) =>
      prev.length > 1 ? prev.filter((item) => item.id !== id) : prev
    );
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const name = form.customerName.trim();
    const phone = form.phone.replace(/\D/g, "");

    if ((name && !phone) || (!name && phone)) {
      setFormError("Enter both customer name and phone, or leave both empty.");
      return;
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      setFormError("Enter a valid 10-digit Indian phone number.");
      return;
    }

    const validServices = services
      .map(({ name, quantity }) => ({
        name: name.trim(),
        quantity: Number(quantity),
      }))
      .filter((item) => item.name);

    if (!validServices.length) {
      setFormError("Add at least one service.");
      return;
    }

    if (
      validServices.some(
        (item) => !Number.isInteger(item.quantity) || item.quantity < 1
      )
    ) {
      setFormError("Service quantity must be a positive whole number.");
      return;
    }

    const addressFields = [
      form.addressLine,
      form.city,
      form.state,
      form.pincode,
    ];

    const hasAddress = addressFields.some((value) => value.trim());

    if (
      hasAddress &&
      addressFields.some((value) => !value.trim())
    ) {
      setFormError("Complete all address fields or leave them empty.");
      return;
    }

    const hasLatitude = form.latitude.trim() !== "";
    const hasLongitude = form.longitude.trim() !== "";

    if (hasLatitude !== hasLongitude) {
      setFormError("Enter both latitude and longitude, or leave both empty.");
      return;
    }

    let customerLocation;

    if (hasLatitude && hasLongitude) {
      const lat = Number(form.latitude);
      const lng = Number(form.longitude);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        setFormError("Enter valid latitude and longitude coordinates.");
        return;
      }

      customerLocation = { lat, lng };
    }

    const payload = {
      customer: name ? { name, phone } : undefined,
      barberName: form.barberName.trim() || undefined,
      services: validServices,
      scheduledAt: form.scheduledAt || null,
      status: form.status.toUpperCase(),
      paymentStatus: form.paymentStatus.toUpperCase(),
      deliveryAddress: hasAddress
        ? {
            fullName: name,
            phone,
            addressLine: form.addressLine.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            pincode: form.pincode.trim(),
          }
        : null,
      customerLocation: customerLocation || null,
    };

    try {
      const result = await onSubmit(payload);

      if (result?.success) {
        setForm(initialForm);
        setServices([newService()]);
        setFormError("");
      } else {
        setFormError(result?.message || "Unable to create order.");
      }
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create order."
      );
    }
  };

  return (
    <div
      className="admin-order-dialog-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        className="admin-order-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-order-dialog-title"
      >
        <header className="admin-order-dialog__header">
          <div className="admin-order-dialog__heading">
            <span className="admin-order-dialog__header-icon">
              <ShoppingBag size={22} />
            </span>
            <div>
              <h2 id="admin-order-dialog-title">Create Manual Order</h2>
              <p>Enter customer, barber and booking information</p>
            </div>
          </div>

          <button
            type="button"
            className="admin-order-dialog__close"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close dialog"
          >
            <X size={21} />
          </button>
        </header>

        <form
          className="admin-order-dialog__form"
          onSubmit={handleSubmit}
        >
          {/* CUSTOMER */}
          <section className="admin-order-form-section">
            <div className="admin-order-form-section__title">
              <span className="admin-order-form-section__icon blue">
                <User size={18} />
              </span>
              <div>
                <h3>Customer Information</h3>
                <p>Optional for walk-in orders</p>
              </div>
            </div>

            <div className="admin-order-form-grid">
              <Field
                label="Customer Name"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
              />
              <Field
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
              />
            </div>
          </section>

          {/* BARBER */}
          <section className="admin-order-form-section">
            <div className="admin-order-form-section__title">
              <span className="admin-order-form-section__icon purple">
                <Scissors size={18} />
              </span>
              <div>
                <h3>Barber Information</h3>
                <p>Enter the salon or barber shop name</p>
              </div>
            </div>

            <div className="admin-order-form-grid">
              <Field
                label="Barber / Shop Name"
                name="barberName"
                value={form.barberName}
                onChange={handleChange}
                placeholder="Enter salon or shop name"
                full
                hint="Optional if the selected services identify one barber."
              />
            </div>
          </section>

          {/* SERVICES */}
          <section className="admin-order-form-section">
            <div className="admin-order-form-section__title admin-order-form-section__title--between">
              <div className="admin-order-form-section__title">
                <span className="admin-order-form-section__icon orange">
                  <ShoppingBag size={18} />
                </span>
                <div>
                  <h3>Services</h3>
                  <p>Enter service names and quantities</p>
                </div>
              </div>

              <span className="admin-order-service-count">
                {services.length}
              </span>
            </div>

            <div className="admin-order-service-list">
              {services.map((service, index) => (
                <div className="admin-order-service-row" key={service.id}>
                  <div className="admin-order-field">
                    <label htmlFor={`service-${service.id}`}>
                      Service Name {index + 1} *
                    </label>
                    <input
                      id={`service-${service.id}`}
                      value={service.name}
                      onChange={(event) =>
                        updateService(service.id, "name", event.target.value)
                      }
                      placeholder="e.g. Hair Cut"
                      required
                    />
                  </div>

                  <div className="admin-order-field quantity">
                    <label htmlFor={`quantity-${service.id}`}>
                      Quantity *
                    </label>
                    <input
                      id={`quantity-${service.id}`}
                      type="number"
                      min="1"
                      step="1"
                      value={service.quantity}
                      onChange={(event) =>
                        updateService(
                          service.id,
                          "quantity",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <button
                    type="button"
                    className="admin-order-service-remove"
                    onClick={() => removeService(service.id)}
                    disabled={services.length === 1}
                    title="Remove service"
                    aria-label={`Remove service ${index + 1}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="admin-order-add-service"
              onClick={() => setServices((prev) => [...prev, newService()])}
            >
              <Plus size={16} />
              Add another service
            </button>
          </section>

          {/* SCHEDULE AND STATUS */}
          <section className="admin-order-form-section">
            <div className="admin-order-form-section__title">
              <span className="admin-order-form-section__icon blue">
                <CalendarDays size={18} />
              </span>
              <div>
                <h3>Schedule & Status</h3>
                <p>Set appointment and order status</p>
              </div>
            </div>

            <div className="admin-order-form-grid">
              <Field
                label="Appointment Date & Time"
                name="scheduledAt"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={handleChange}
                full
                hint="Leave empty to use the current date and time."
              />
              <Field
                label="Order Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                hint="PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED"
              />
              <Field
                label="Payment Status"
                name="paymentStatus"
                value={form.paymentStatus}
                onChange={handleChange}
                required
                hint="PENDING or PAID"
              />
            </div>
          </section>

          {/* ADDRESS */}
          <section className="admin-order-form-section">
            <div className="admin-order-form-section__title">
              <span className="admin-order-form-section__icon orange">
                <MapPin size={18} />
              </span>
              <div>
                <h3>Delivery Address</h3>
                <p>Optional. Complete all fields if providing an address.</p>
              </div>
            </div>

            <div className="admin-order-form-grid">
              <Field
                label="Address"
                name="addressLine"
                value={form.addressLine}
                onChange={handleChange}
                placeholder="House number, street, area"
                full
              />
              <Field
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
              <Field
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
              />
              <Field
                label="Pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
              />
            </div>
          </section>

          {/* CUSTOMER LOCATION */}
          <section className="admin-order-form-section">
            <div className="admin-order-form-section__title">
              <span className="admin-order-form-section__icon green">
                <MapPin size={18} />
              </span>
              <div>
                <h3>Customer Location</h3>
                <p>Optional latitude and longitude</p>
              </div>
            </div>

            <div className="admin-order-form-grid">
              <Field
                label="Latitude"
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange}
                placeholder="e.g. 25.7809992"
              />
              <Field
                label="Longitude"
                name="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange}
                placeholder="e.g. 87.4557266"
              />
            </div>
          </section>

          {formError && (
            <div className="admin-order-dialog__error" role="alert">
              {formError}
            </div>
          )}

          <footer className="admin-order-dialog__footer">
            <button
              type="button"
              className="admin-order-dialog__cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-order-dialog__submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="spinning" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Create Order
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default AdminOrderDialog;
