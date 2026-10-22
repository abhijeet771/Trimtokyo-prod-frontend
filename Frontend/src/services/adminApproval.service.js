import apik from "./apik";

/* ============================================================
   ADMIN BARBER APPROVAL APIs
============================================================ */

// Get pending barber approvals
export const getPendingApprovals = () =>
  apik.get("/api/admin/approvals/approvals");

// Approve a barber
export const approveBarber = (id) =>
  apik.patch(`/api/admin/approvals/approve/${id}`);

// Decline a barber
export const declineBarber = (id) =>
  apik.patch(`/api/admin/approvals/decline/${id}`);

// Toggle featured status
export const featureBarber = (id, isFeatured) =>
  apik.patch(`/api/admin/approvals/feature/${id}`, {
    isFeatured,
  });
