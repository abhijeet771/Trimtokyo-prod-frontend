
import api from "./apik";

/* ============================================================
   CAMPAIGN APIs
============================================================ */

// Get all campaigns
export const getCampaigns = () =>
  apik.get("/api/campaigns");

// Create / send a campaign
export const createCampaign = (data) =>
  apik.post("/api/campaigns/send", data);

// Delete a campaign
export const deleteCampaign = (id) =>
  apik.delete(`/api/campaigns/${id}`);
