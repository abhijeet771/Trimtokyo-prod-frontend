import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Scissors,
  Clock3,
  IndianRupee,
  Check,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  CalendarCheck,
} from "lucide-react";

import { useCart, getCartItemId } from "../../context/CartContext";
import "./SlugServicesSection.scss";

const INITIAL_SERVICE_LIMIT = 10;
const DEBUG = true;

const debugLog = (...args) => {
  if (DEBUG) console.log("[SlugServicesSection]", ...args);
};

const debugError = (...args) => {
  if (DEBUG) console.error("[SlugServicesSection]", ...args);
};

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") {
    return "Price unavailable";
  }

  const amount = Number(price);

  return Number.isFinite(amount)
    ? `₹${amount.toLocaleString("en-IN")}`
    : "Price unavailable";
};

const formatDuration = (duration) => {
  if (duration === undefined || duration === null || duration === "") {
    return "Duration unavailable";
  }

  const value = Number(duration);

  if (!Number.isFinite(value)) {
    return String(duration);
  }

  if (value >= 60) {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    return minutes === 0
      ? `${hours} hr${hours > 1 ? "s" : ""}`
      : `${hours} hr ${minutes} min`;
  }

  return `${value} min`;
};

const getServiceName = (service) =>
  service?.title ||
  service?.name ||
  service?.serviceName ||
  "Salon Service";

const getServiceImage = (service) =>
  service?.imageUrl ||
  service?.image ||
  service?.url ||
  "";

const getServiceId = (service, index) =>
  String(
    service?._id ??
      service?.id ??
      service?.serviceId ??
      `${getServiceName(service)}-${index}`
  );

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }

  if (typeof value !== "object") return "";

  if (value._id) {
    return getId(value._id);
  }

  if (value.id) {
    return getId(value.id);
  }

  return "";
};

/*
 * Resolve the BarberProfile document ID.
 * Never use the salon slug or service ID as a barber profile ID.
 */
const resolveBarberProfileId = (providedId, service) => {
  const candidates = [
    providedId,
    service?.barberProfileId,
    service?.barberProfile?._id,
    service?.barberProfile?.id,
    service?.barber?.barberProfileId,
    service?.barber?.barberProfile?._id,
    service?.profile?._id,
  ];

  for (const candidate of candidates) {
    const id = getId(candidate);
    if (id) return id;
  }

  return "";
};

/*
 * Auth user ID is separate from BarberProfile._id.
 * Only use fields that actually contain the Auth user ID.
 */
const resolveBarberUserId = (providedUserId, service) => {
  const candidates = [
    providedUserId,
    service?.barberUserId,
    service?.authUserId,
    service?.barber?.userId,
    service?.barber?.authUserId,
    service?.barberProfile?.userId,
    service?.barberProfile?.user?._id,
    service?.barberProfile?.user?.id,
  ];

  for (const candidate of candidates) {
    const id = getId(candidate);
    if (id) return id;
  }

  return "";
};

const getBarberLocation = (location) => {
  if (!location || typeof location !== "object") return null;

  const lat = Number(location.lat ?? location.latitude);
  const lng = Number(
    location.lng ?? location.longitude ?? location.lon
  );

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

const SlugServicesSection = ({
  services = [],
  salonSlug: providedSalonSlug,
  salonName: providedSalonName,
  barberProfileId,
  barberUserId,
  barberLocation,
}) => {
  const { slug: routeSlug } = useParams();
  const navigate = useNavigate();

  const {
    cartItems,
    addService,
    removeItem,
    removeSalonItems,
  } = useCart();

  const salonSlug = String(providedSalonSlug || routeSlug || "salon");
  const salonName = providedSalonName || "Selected salon";

  const [searchTerm, setSearchTerm] = useState("");
  const [showAllServices, setShowAllServices] = useState(false);

  const serviceList = useMemo(
    () => (Array.isArray(services) ? services : []),
    [services]
  );

  const salonCartItems = useMemo(
    () =>
      cartItems.filter(
        (item) => String(item.salonSlug || "") === salonSlug
      ),
    [cartItems, salonSlug]
  );

  const selectedItemIds = useMemo(
    () => new Set(salonCartItems.map((item) => item.id)),
    [salonCartItems]
  );

  const filteredServices = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return serviceList;

    return serviceList.filter((service) => {
      const searchableText = [
        getServiceName(service),
        service?.description,
        service?.category,
        service?.gender,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [serviceList, searchTerm]);

  const visibleServices = useMemo(() => {
    if (searchTerm.trim() || showAllServices) {
      return filteredServices;
    }

    return filteredServices.slice(0, INITIAL_SERVICE_LIMIT);
  }, [filteredServices, searchTerm, showAllServices]);

  const toggleService = (service, index) => {
    const serviceId = getServiceId(service, index);
    const cartItemId = getCartItemId(salonSlug, serviceId);

    if (selectedItemIds.has(cartItemId)) {
      removeItem(cartItemId);
      return;
    }

    const profileId = resolveBarberProfileId(
      barberProfileId,
      service
    );

    const authUserId = resolveBarberUserId(
      barberUserId,
      service
    );

    if (!profileId) {
      debugError("Cannot add service: BarberProfile ID is missing.", {
        salonSlug,
        serviceId,
        service,
      });
      return;
    }

    const mongoServiceId =
      service?._id ?? service?.serviceId ?? service?.id;

    if (!mongoServiceId) {
      debugError("Cannot add service: MongoDB service ID is missing.", {
        service,
      });
      return;
    }

    const validBarberLocation = getBarberLocation(barberLocation);
    const realServiceId = String(mongoServiceId);

    debugLog("Adding service:", {
      salonSlug,
      profileId,
      authUserId,
      serviceId: realServiceId,
      service,
    });

    addService(
      {
        ...service,
        id: serviceId,
        serviceId: realServiceId,
        barberProfileId: profileId,
        ...(authUserId ? { barberUserId: authUserId } : {}),
        ...(validBarberLocation
          ? { barberLocation: validBarberLocation }
          : {}),
      },
      salonSlug,
      salonName,
      {
        id: profileId,
        _id: profileId,
        barberProfileId: profileId,
        ...(authUserId
          ? {
              barberUserId: authUserId,
              authUserId,
            }
          : {}),
        name: salonName,
        slug: salonSlug,
        ...(validBarberLocation
          ? { barberLocation: validBarberLocation }
          : {}),
      }
    );
  };

  const handleBookAppointment = (service) => {
    const mongoServiceId =
      service?._id ?? service?.serviceId ?? service?.id;

    const profileId = resolveBarberProfileId(
      barberProfileId,
      service
    );

    const authUserId = resolveBarberUserId(
      barberUserId,
      service
    );

    debugLog("Preparing booking draft:", {
      salonSlug,
      profileId,
      authUserId,
      mongoServiceId,
      providedBarberProfileId: barberProfileId,
      providedBarberUserId: barberUserId,
      service,
    });

    if (!mongoServiceId) {
      debugError("MongoDB service ID is missing.", service);
      return;
    }

    if (!profileId) {
      debugError("BarberProfile ID is missing.", {
        salonSlug,
        service,
        providedBarberProfileId: barberProfileId,
      });
      return;
    }

    if (!authUserId) {
      debugError(
        "Auth user ID is missing. The parent component must pass barberUserId or the API data must include BarberProfile.userId.",
        {
          salonSlug,
          profileId,
          service,
        }
      );

      // Do not silently send a profile ID as an Auth user ID.
      return;
    }

    const validBarberLocation = getBarberLocation(barberLocation);
    const realServiceId = String(mongoServiceId);

    const bookingDraft = {
      shop: {
        id: profileId,
        _id: profileId,
        barberProfileId: profileId,
        barberId: authUserId,
        barberUserId: authUserId,
        authUserId,
        name: salonName,
        slug: salonSlug,
        ...(validBarberLocation
          ? { barberLocation: validBarberLocation }
          : {}),
      },
      service: {
        ...service,
        id: realServiceId,
        serviceId: realServiceId,
        barberProfileId: profileId,
        barberId: authUserId,
        barberUserId: authUserId,
      },
      date: "",
      slot: null,
      slotId: "",
    };

    debugLog("Final booking draft:", bookingDraft);

    navigate("/cart", {
      state: {
        activeSection: "appointments",
        appointmentStep: 1,
        bookingDraft,
      },
    });
  };

  const selectedCount = salonCartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  const selectedTotal = salonCartItems.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 1),
    0
  );

  const hasMoreServices =
    !searchTerm.trim() &&
    filteredServices.length > INITIAL_SERVICE_LIMIT;

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setShowAllServices(false);
  };
  return (
    <section className="slug-services" id="salon-services">
      <div className="slug-services__header">
        <div className="slug-services__heading">
          <span className="slug-services__heading-icon">
            <Scissors size={19} />
          </span>

          <div>
            <h2>Our Services</h2>
            <p>
              Explore services, add them to your cart, or book an appointment.
            </p>
          </div>
        </div>

        <span className="slug-services__total">
          {searchTerm.trim()
            ? `${filteredServices.length} found`
            : `${serviceList.length} ${
                serviceList.length === 1 ? "service" : "services"
              }`}
        </span>
      </div>

      <div className="slug-services__toolbar">
        <label className="slug-services__search">
          <Search size={18} />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              handleSearchChange(event.target.value)
            }
            placeholder="Search Rica, haircut, facial..."
            aria-label="Search salon services"
          />

          {searchTerm && (
            <button
              type="button"
              className="slug-services__clear-search"
              onClick={() => handleSearchChange("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </label>

        <div className="slug-services__toolbar-label">
          <SlidersHorizontal size={15} />
          <span>
            {searchTerm.trim() ? "Search results" : "All services"}
          </span>
        </div>
      </div>

      {visibleServices.length > 0 ? (
        <>
          <div className="slug-services__grid">
            {visibleServices.map((service) => {
              const index = serviceList.indexOf(service);
              const serviceId = getServiceId(service, index);
              const cartItemId = getCartItemId(salonSlug, serviceId);
              const isSelected = selectedItemIds.has(cartItemId);

              const image = getServiceImage(service);
              const name = getServiceName(service);

              return (
                <article
                  className={`slug-services__card ${
                    isSelected
                      ? "slug-services__card--selected"
                      : ""
                  }`}
                  key={serviceId}
                >
                  <div className="slug-services__image-wrap">
                    {image ? (
                      <img
                        className="slug-services__image"
                        src={image}
                        alt={name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="slug-services__image-placeholder">
                        <Scissors size={28} />
                        <span>Service</span>
                      </div>
                    )}

                    {isSelected && (
                      <span className="slug-services__selected-badge">
                        <Check size={13} />
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="slug-services__card-body">
                    <div className="slug-services__card-heading">
                      <h3>{name}</h3>

                      {service?.gender && (
                        <span className="slug-services__gender">
                          {service.gender}
                        </span>
                      )}
                    </div>

                    {service?.description && (
                      <p className="slug-services__description">
                        {service.description}
                      </p>
                    )}

                    <div className="slug-services__duration">
                      <Clock3 size={14} />
                      <span>
                        {formatDuration(service?.duration)}
                      </span>
                    </div>

                    <div className="slug-services__card-footer">
                      <div className="slug-services__price">
                        <span>Price</span>
                        <strong>
                          {formatPrice(service?.price)}
                        </strong>
                      </div>

                      <button
                        type="button"
                        className={`slug-services__select ${
                          isSelected
                            ? "slug-services__select--selected"
                            : ""
                        }`}
                        onClick={() => toggleService(service, index)}
                        aria-pressed={isSelected}
                      >
                        {isSelected ? (
                          <>
                            <Check size={15} />
                            Selected
                          </>
                        ) : (
                          <>
                            <Plus size={15} />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      className="slug-services__book-appointment"
                      onClick={() => handleBookAppointment(service)}
                    >
                      <CalendarCheck size={16} />
                      Book Appointment
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {hasMoreServices && (
            <div className="slug-services__view-all">
              <button
                type="button"
                onClick={() =>
                  setShowAllServices((current) => !current)
                }
                aria-expanded={showAllServices}
                className="slug-services__view-all-button"
              >
                {showAllServices ? (
                  <>
                    Show Less
                    <ChevronUp size={17} />
                  </>
                ) : (
                  <>
                    View All {filteredServices.length} Services
                    <ChevronDown size={17} />
                  </>
                )}
              </button>
            </div>
          )}

          {searchTerm.trim() && (
            <p className="slug-services__search-note">
              Showing all {filteredServices.length} matching{" "}
              {filteredServices.length === 1
                ? "service"
                : "services"}.
            </p>
          )}
        </>
      ) : (
        <div className="slug-services__empty">
          <span className="slug-services__empty-icon">
            <Search size={23} />
          </span>

          <h3>
            {serviceList.length === 0
              ? "No services available yet"
              : "No matching services"}
          </h3>

          <p>
            {serviceList.length === 0
              ? "Services will appear here when the salon adds them."
              : "Try another service name or clear your search."}
          </p>

          {searchTerm && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {selectedCount > 0 && (
        <div className="slug-services__selection-bar">
          <div className="slug-services__selection-info">
            <span className="slug-services__selection-count">
              <Check size={15} />
              {selectedCount} selected
            </span>

            <div className="slug-services__selection-total">
              <span>Selected services total</span>
              <strong>
                <IndianRupee size={16} />
                {selectedTotal.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="slug-services__clear-selection"
            onClick={() => removeSalonItems(salonSlug)}
          >
            Clear selection
          </button>
        </div>
      )}
    </section>
  );
};

export default SlugServicesSection;
