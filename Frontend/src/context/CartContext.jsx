import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "trimtokyo-cart";

/**
 * Convert a string, number, or populated MongoDB reference to an ID.
 */
const getReferenceId = (value) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    const id = value._id ?? value.id;
    return id ? String(id) : "";
  }

  return "";
};

/**
 * Normalize a salon location into { lat, lng }.
 * GeoJSON coordinates are always [longitude, latitude].
 */
const normalizeLocation = (...candidates) => {
  for (const location of candidates) {
    if (!location || typeof location !== "object") continue;

    let lat;
    let lng;

    if (Array.isArray(location.coordinates)) {
      [lng, lat] = location.coordinates;
    } else if (
      location.location &&
      Array.isArray(location.location.coordinates)
    ) {
      [lng, lat] = location.location.coordinates;
    } else {
      lat = location.lat ?? location.latitude;
      lng = location.lng ?? location.longitude;
    }

    lat = Number(lat);
    lng = Number(lng);

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      !(lat === 0 && lng === 0)
    ) {
      return { lat, lng };
    }
  }

  return null;
};

/**
 * Safely load existing cart items from localStorage.
 */
const getInitialCart = () => {
  try {
    if (typeof window === "undefined") return [];

    const storedCart = window.localStorage.getItem(STORAGE_KEY);

    if (!storedCart) return [];

    const parsedCart = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) return [];

    return parsedCart.map((item) => {
      const serviceId = getReferenceId(
        item.serviceId ?? item._id
      );

      const barberProfileId = getReferenceId(
        item.barberProfileId ??
          item.barberId ??
          item.barberProfile?._id ??
          item.barberProfile?.id
      );

      const barberLocation = normalizeLocation(
        item.barberLocation,
        item.salonLocation,
        item.barberProfile?.location,
        item.salon?.location,
        item.location
      );

      return {
        ...item,
        ...(serviceId ? { serviceId } : {}),
        ...(barberProfileId
          ? {
              barberId: barberProfileId,
              barberProfileId,
            }
          : {}),
        ...(barberLocation ? { barberLocation } : {}),
        quantity: Math.max(1, Number(item.quantity) || 1),
      };
    });
  } catch (error) {
    console.error("Failed to load cart:", error);
    return [];
  }
};

/**
 * Stable UI/cart ID for a service at a salon.
 */
export const getCartItemId = (salonSlug, serviceId) =>
  `${salonSlug || "salon"}::${serviceId}`;

/**
 * Resolve the actual BarberProfile MongoDB ID.
 * Never substitute the salon slug or Auth user ID.
 */
const getBarberProfileId = (service, salonMetadata = {}) => {
  const candidates = [
    salonMetadata.barberProfileId,
    salonMetadata.barberProfile?._id,
    salonMetadata.barberProfile?.id,
    service?.barberProfileId,
    service?.barberProfile?._id,
    service?.barberProfile?.id,
    service?.barberId,
  ];

  for (const candidate of candidates) {
    const id = getReferenceId(candidate);
    if (id) return id;
  }

  return "";
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getInitialCart);

  // Persist cart changes.
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(cartItems)
        );
      }
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems]);

  /**
   * Add a service.
   *
   * addService(service, salonSlug, salonName, salonMetadata)
   */
  const addService = useCallback(
    (
      service,
      salonSlug,
      salonName = "Selected salon",
      salonMetadata = {}
    ) => {
      if (!service) return;

      const serviceId = getReferenceId(
        service.serviceId ?? service._id ?? service.id
      );

      if (!serviceId) {
        console.error(
          "Cannot add service: missing MongoDB service ID.",
          service
        );
        return;
      }

      const barberProfileId = getBarberProfileId(
        service,
        salonMetadata
      );

      if (!barberProfileId) {
        console.error(
          "Cannot add service: missing BarberProfile ID.",
          { service, salonMetadata }
        );
        return;
      }

      const staffId = getReferenceId(
        service.staffId ??
          service.staff?._id ??
          service.staff?.id ??
          salonMetadata.staffId
      );

      const barberLocation = normalizeLocation(
        salonMetadata.barberLocation,
        salonMetadata.salonLocation,
        salonMetadata.location,
        salonMetadata.barberProfile?.location,
        service.barberLocation,
        service.salonLocation,
        service.location,
        service.barberProfile?.location
      );

      const itemId = getCartItemId(salonSlug, serviceId);

      const normalizedItem = {
        id: itemId,
        serviceId,

        // Salon identity.
        salonSlug: salonSlug || "",
        salon: salonName || "Selected salon",
        salonName: salonName || "Selected salon",

        // Actual BarberProfile MongoDB ID.
        barberId: barberProfileId,
        barberProfileId,

        ...(staffId ? { staffId } : {}),

        ...(barberLocation ? { barberLocation } : {}),

        name:
          service.title ||
          service.name ||
          service.serviceName ||
          "Salon Service",

        description: service.description || "",

        image:
          service.imageUrl ||
          service.image ||
          service.url ||
          "",

        price: Math.max(0, Number(service.price) || 0),
        duration: Math.max(0, Number(service.duration) || 0),
        quantity: 1,
      };

      setCartItems((previousItems) => {
        const existingItem = previousItems.find(
          (item) => item.id === itemId
        );

        if (!existingItem) {
          return [...previousItems, normalizedItem];
        }

        return previousItems.map((item) => {
          if (item.id !== itemId) return item;

          // Refresh salon metadata even when the service already
          // exists in the cart.
          const updatedItem = {
            ...item,
            ...normalizedItem,
            quantity: (Number(item.quantity) || 1) + 1,
          };

          // Preserve an existing valid location if no new location
          // was supplied by the salon page.
          const existingLocation = normalizeLocation(
            item.barberLocation,
            item.salonLocation,
            item.location
          );

          if (!barberLocation && existingLocation) {
            updatedItem.barberLocation = existingLocation;
          }

          return updatedItem;
        });
      });
    },
    []
  );

  /**
   * Update metadata on an existing cart item.
   */
  const updateItemMetadata = useCallback(
    (itemId, metadata = {}) => {
      if (!itemId || !metadata) return;

      const barberProfileId = getBarberProfileId(
        metadata,
        metadata
      );

      const staffId = getReferenceId(metadata.staffId);

      const barberLocation = normalizeLocation(
        metadata.barberLocation,
        metadata.salonLocation,
        metadata.location,
        metadata.barberProfile?.location
      );

      setCartItems((previousItems) =>
        previousItems.map((item) => {
          if (item.id !== itemId) return item;

          return {
            ...item,
            ...(barberProfileId
              ? {
                  barberId: barberProfileId,
                  barberProfileId,
                }
              : {}),
            ...(staffId ? { staffId } : {}),
            ...(barberLocation
              ? { barberLocation }
              : {}),
          };
        })
      );
    },
    []
  );

  const removeItem = useCallback((itemId) => {
    setCartItems((previousItems) =>
      previousItems.filter((item) => item.id !== itemId)
    );
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    const nextQuantity = Math.floor(Number(quantity));

    if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
      return;
    }

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: nextQuantity }
          : item
      )
    );
  }, []);

  const removeSalonItems = useCallback((salonSlug) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => item.salonSlug !== salonSlug
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + (Number(item.quantity) || 1),
        0
      ),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          (Number(item.price) || 0) *
            (Number(item.quantity) || 1),
        0
      ),
    [cartItems]
  );

  const cartDuration = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          (Number(item.duration) || 0) *
            (Number(item.quantity) || 1),
        0
      ),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotal,
      cartDuration,
      addService,
      updateItemMetadata,
      removeItem,
      updateQuantity,
      removeSalonItems,
      clearCart,
    }),
    [
      cartItems,
      cartCount,
      cartTotal,
      cartDuration,
      addService,
      updateItemMetadata,
      removeItem,
      updateQuantity,
      removeSalonItems,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider."
    );
  }

  return context;
};