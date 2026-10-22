
import api from "./api";

// Get public footer content
export const getFooterContent = () =>
  api.get("/api/cms/footer");

// Update footer content
export const updateFooterContent = (data) =>
  api.put("/api/cms/footer", data);
