import { useState, useMemo } from "react";

// Cart logic (single barber enforced)
const useCart = () => {
  const [barberId, setBarberId] = useState(null);
  const [items, setItems] = useState([]);

  const addToCart = (barberProfileId, service) => {
    // Enforce single barber rule
    if (barberId && barberId !== barberProfileId) {
      alert("You can only order from one barber at a time.");
      return;
    }

    if (!barberId) {
      setBarberId(barberProfileId);
    }

    setItems((prev) => {
      const existing = prev.find(
        (item) => item.serviceId === service._id
      );

      if (existing) {
        return prev.map((item) =>
          item.serviceId === service._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          serviceId: service._id,
          title: service.title,
          price: service.price,
          duration: service.duration,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQty = (serviceId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.serviceId === serviceId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (serviceId) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.serviceId === serviceId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
    setBarberId(null);
  };

  const totalAmount = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }, [items]);

  const totalDuration = useMemo(() => {
    return items.reduce(
      (acc, item) =>
        acc + item.duration * item.quantity,
      0
    );
  }, [items]);

  return {
    barberId,
    items,
    addToCart,
    increaseQty,
    decreaseQty,
    clearCart,
    totalAmount,
    totalDuration,
  };
};

export default useCart;