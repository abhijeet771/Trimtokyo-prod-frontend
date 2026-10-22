
import { useCallback, useEffect, useState } from "react";

import { createSlots, getBarberSlots, deleteBarberSlot,} from "../../services/timeslot.service";

/* ============================================================
   CREATE AVAILABILITY SLOTS
============================================================ */

export const useCreateSlots = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const generateSlots = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createSlots(data);

      setSuccess(
        response?.data?.message || "Slots generated successfully."
      );

      return response.data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to generate slots.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    generateSlots,
    loading,
    error,
    success,
    resetMessages,
  };
};

/* ============================================================
   FETCH BARBER AVAILABILITY SLOTS
============================================================ */

export const useBarberSlots = (initialParams = {}) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlots = useCallback(
    async (params = initialParams) => {
      setLoading(true);
      setError(null);

      try {
        const response = await getBarberSlots(params);

        const data = response?.data;

        const slotList = Array.isArray(data)
          ? data
          : Array.isArray(data?.slots)
            ? data.slots
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setSlots(slotList);

        return slotList;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load availability slots.";

        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [initialParams]
  );

  useEffect(() => {
    let active = true;

    const loadSlots = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getBarberSlots(initialParams);

        if (!active) return;

        const data = response?.data;

        const slotList = Array.isArray(data)
          ? data
          : Array.isArray(data?.slots)
            ? data.slots
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setSlots(slotList);
      } catch (err) {
        if (!active) return;

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to load availability slots."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSlots();

    return () => {
      active = false;
    };
  }, [initialParams]);

  const refreshSlots = useCallback(
    (params = initialParams) => fetchSlots(params),
    [fetchSlots, initialParams]
  );

  return {
    slots,
    setSlots,
    loading,
    error,
    fetchSlots,
    refreshSlots,
  };
};

/* ============================================================
   DELETE AN AVAILABLE SLOT
============================================================ */

export const useDeleteBarberSlot = (refreshSlots) => {
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const removeSlot = useCallback(
    async (slotId) => {
      if (!slotId) {
        const message = "A valid slot ID is required.";
        setError(message);
        throw new Error(message);
      }

      setDeletingId(slotId);
      setError(null);
      setSuccess(null);

      try {
        const response = await deleteBarberSlot(slotId);

        setSuccess(
          response?.data?.message || "Slot deleted successfully."
        );

        if (typeof refreshSlots === "function") {
          await refreshSlots();
        }

        return response.data;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to delete slot.";

        setError(message);
        throw err;
      } finally {
        setDeletingId(null);
      }
    },
    [refreshSlots]
  );

  const resetMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    removeSlot,
    deletingId,
    error,
    success,
    resetMessages,
  };
};
