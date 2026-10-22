
import apik from "./apik";

export const getAdminOverview = async () => {
  const response = await apik.get("/api/admin/overview");

  console.log("Admin overview API response:", response.data);

  return response;
};
