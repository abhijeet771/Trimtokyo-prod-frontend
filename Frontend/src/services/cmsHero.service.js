
import api from "./api";

// Get public hero content
export const getHeroContent = () =>
  api.get("/api/cms/hero");

// Update hero content
export const updateHeroContent = (data) =>
  api.put("/api/cms/hero", data);
