
import apik from "./apik";

/* ============================================================
   BARBER TIMESLOT APIs
============================================================ */

// Generate barber availability slots
export const createSlots = (data) =>
  apik.post("/api/timeslots/availability", data);

// Get generated slots for the authenticated barber
export const getBarberSlots = (params = {}) =>
  apik.get("/api/timeslots/barber/managed", {
    params,
  });

// Delete an available slot belonging to the authenticated barber
export const deleteBarberSlot = (slotId) =>
  apik.delete(`/api/timeslots/barber/managed/${slotId}`);

// Get bookings for the authenticated barber
export const getBarberBookings = () =>
  apik.get("/api/timeslots/barber-bookings");

/* ============================================================
   CUSTOMER TIMESLOT APIs
============================================================ */

// Get available slots for a date, optionally filtered by barber
export const getSlots = (date, barberId) =>
  apik.get("/api/timeslots", {
    params: { date, barberId },
  });

// Legacy endpoint: use only if the backend route is still enabled
export const bookSlot = (data) =>
  apik.post("/api/timeslots/book", data);
