
import apik from "./apik";

/* ============================================================
   ADMIN SERVICE APPROVAL APIs
============================================================ */

// Get pending service approvals
export const getPendingServices = () =>
  apik.get("/api/services/admin/pending");

// Approve a service
export const approveService = (id) =>
  apik.patch(`/api/services/admin/approve/${id}`);

// Reject a service
export const rejectService = (id) =>
  apik.patch(`/api/services/admin/reject/${id}`);
