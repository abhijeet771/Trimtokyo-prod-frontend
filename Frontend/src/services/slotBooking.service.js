
import apik from "./apik";

/* ============================================================
   CUSTOMER APPOINTMENT BOOKING APIs
============================================================ */

// Create a customer appointment
// Expected data: { slotId, serviceId, phone }
export const createBooking = (data) =>
  apik.post("/api/user/bookings", data);

// Get bookings for the authenticated customer
export const getBookings = (params = {}) =>
  apik.get("/api/user/bookings", {
    params,
  });

// Get a single booking by ID
export const getSingleBooking = (bookingId) =>
  apik.get(`/api/user/bookings/${bookingId}`);
