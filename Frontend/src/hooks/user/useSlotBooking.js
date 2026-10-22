
import { useCallback, useState } from "react";

import {
  createBooking,
  getBookings,
  getSingleBooking,
} from "../../services/slotBooking.service";

const useSlotBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create a customer appointment
  const bookAppointment = useCallback(async (data) => {
    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const response = await createBooking(data);

      const createdBooking =
        response?.data?.booking ?? response?.data?.data ?? response?.data;

      setBooking(createdBooking);
      setBookings((previous) => [createdBooking, ...previous]);

      const message =
        response?.data?.message || "Appointment booked successfully.";

      setSuccess(message);

      return {
        success: true,
        booking: createdBooking,
        message,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to book appointment.";

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setCreating(false);
    }
  }, []);

  // Fetch bookings for the authenticated customer
  const fetchBookings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getBookings(params);
      const data = response?.data;

      const result = Array.isArray(data)
        ? data
        : data?.bookings ?? data?.data?.bookings ?? data?.data ?? [];

      const normalizedBookings = Array.isArray(result) ? result : [];

      setBookings(normalizedBookings);

      return normalizedBookings;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to fetch bookings.";

      setError(message);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch one booking by ID
  const fetchBookingById = useCallback(async (bookingId) => {
    if (!bookingId) {
      setError("Booking ID is required.");
      return null;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getSingleBooking(bookingId);
      const data = response?.data;

      const result = data?.booking ?? data?.data ?? data;

      setBooking(result);

      return result;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to fetch booking.";

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  return {
    bookings,
    booking,
    loading,
    creating,
    error,
    success,
    bookAppointment,
    fetchBookings,
    fetchBookingById,
    clearMessages,
  };
};

export default useSlotBooking;
