
import apik from "../apik";

/* ============================================================
   ADMIN EVENT BOOKING APIs
============================================================ */

// Get paginated event bookings with filters
export const getAdminEventBookings = (
  page = 1,
  limit = 10,
  search = "",
  status = "",
  eventCategory = "",
  startDate = "",
  endDate = ""
) =>
  apik.get("/api/admin/event-bookings", {
    params: {
      page,
      limit,
      search,
      status,
      eventCategory,
      startDate,
      endDate,
    },
  });

// Get event booking dashboard statistics
export const getAdminEventBookingDashboard = () =>
  apik.get("/api/admin/event-bookings/dashboard");

// Get single event booking by ID
export const getAdminEventBookingById = (id) =>
  apik.get(`/api/admin/event-bookings/${id}`);

// Create event booking
export const createAdminEventBooking = (bookingData) =>
  apik.post("/api/admin/event-bookings", bookingData);

// Update event booking
export const updateAdminEventBooking = (id, bookingData) =>
  apik.put(`/api/admin/event-bookings/${id}`, bookingData);

// Update event booking status
export const updateAdminEventBookingStatus = (id, status) =>
  apik.patch(`/api/admin/event-bookings/${id}/status`, {
    status,
  });

// Delete event booking
export const deleteAdminEventBooking = (id) =>
  apik.delete(`/api/admin/event-bookings/${id}`);

/* ============================================================
   EVENT CATEGORY API
   Reuse existing GET API for dropdown
============================================================ */

// Get active event categories for dropdown
export const getActiveEventCategories = () =>
  apik.get("/api/admin/event-categories", {
    params: {
      page: 1,
      limit: 100,
      status: "ACTIVE",
    },
  });
