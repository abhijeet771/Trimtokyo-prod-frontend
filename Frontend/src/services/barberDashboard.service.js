
import apik from "./apik";

/* ============================================================
   BARBER DASHBOARD APIs
============================================================ */

// Get complete barber dashboard: KPIs and charts
export const getBarberDashboard = () =>
  apik.get("/api/barber/dashboard");

// Get barber KPIs only (optional compatibility endpoint)
export const getBarberKPIs = () =>
  apik.get("/api/barber/dashboard/kpis");
