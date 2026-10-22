
import { useCallback, useState } from "react";

import {
  createSlots as createBarberSlotsAPI,
  getBarberSlots as getBarberSlotsAPI,
  deleteBarberSlot as deleteBarberSlotAPI,
  getBarberBookings as getBarberBookingsAPI,
} from "../../services/timeslot.service";

const useBarberSlots = () => {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const [error, setError] = useState("");

  // Fetch generated slots for the authenticated barber
  const fetchBarberSlots = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getBarberSlotsAPI(params);
      const data = response?.data;

      const result = Array.isArray(data)
        ? data
        : data?.slots ?? data?.data?.slots ?? data?.data ?? [];

      const normalizedSlots = Array.isArray(result) ? result : [];

      setSlots(normalizedSlots);
      return normalizedSlots;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch barber slots.";

      console.error("Error fetching barber slots:", message);
      setError(message);
      setSlots([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate availability slots
  const createBarberSlots = useCallback(async (formData) => {
    try {
      setCreating(true);
      setError("");

      const response = await createBarberSlotsAPI({
        ...formData,
        duration: Number(formData.duration),
      });

      return {
        success: response?.data?.success !== false,
        data: response?.data,
        message:
          response?.data?.message ||
          "Slots generated successfully.",
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to generate barber slots.";

      console.error("Error creating barber slots:", message);
      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setCreating(false);
    }
  }, []);

  // Delete an available slot belonging to the authenticated barber
  const deleteBarberSlot = useCallback(async (slotId) => {
    try {
      setDeletingId(slotId);
      setError("");

      await deleteBarberSlotAPI(slotId);

      setSlots((previous) =>
        previous.filter(
          (slot) => String(slot._id || slot.id) !== String(slotId)
        )
      );

      return { success: true };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to delete barber slot.";

      console.error("Error deleting barber slot:", message);
      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setDeletingId(null);
    }
  }, []);

  // Upcoming bookings retained but not integrated yet
  const fetchBarberBookings = useCallback(async () => {
    try {
      setBookingsLoading(true);
      setError("");

      const response = await getBarberBookingsAPI();
      const data = response?.data;

      const result = Array.isArray(data)
        ? data
        : data?.bookings ?? data?.data?.bookings ?? data?.data ?? [];

      const normalizedBookings = Array.isArray(result) ? result : [];

      setBookings(normalizedBookings);
      return normalizedBookings;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch barber bookings.";

      console.error("Error fetching barber bookings:", message);
      setError(message);
      setBookings([]);

      return [];
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    slots,
    bookings,
    loading,
    creating,
    deletingId,
    bookingsLoading,
    error,
    fetchBarberSlots,
    createBarberSlots,
    deleteBarberSlot,
    fetchBarberBookings,
    clearError,
  };
};

export default useBarberSlots;
