
import axios from "axios";

/* -------------------------------------------------------------------------- */
/*                              API BASE URL                                  */
/* -------------------------------------------------------------------------- */

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* -------------------------------------------------------------------------- */
/*                                Axios Instance                              */
/* -------------------------------------------------------------------------- */

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/* -------------------------------------------------------------------------- */
/*                          Global Response Interceptor                       */
/* -------------------------------------------------------------------------- */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - possibly expired session");
    }

    return Promise.reject(error);
  }
);

/* -------------------------------------------------------------------------- */
/*                                   AUTH APIs                                */
/* -------------------------------------------------------------------------- */

export const registerUser = (data) =>
  api.post("/api/auth/register", data);

export const loginUser = (data) =>
  api.post("/api/auth/login", data);

/*
export const sendOtp = (data) =>
  api.post("/api/auth/send-otp", data);

export const verifyOtp = (data) =>
  api.post("/api/auth/verify-otp", data);

export const forgotPassword = (data) =>
  api.post("/api/auth/forgot-password", data);

export const resetPassword = (data) =>
  api.post("/api/auth/reset-password", data);
*/

export const logoutUser = () =>
  api.post("/api/auth/logout");

export const getCurrentUser = () =>
  api.get("/api/auth/me");

/* -------------------------------------------------------------------------- */
/*                           FCM TOKEN APIs                                   */
/* -------------------------------------------------------------------------- */

export const saveFCMToken = (token) =>
  api.post("/api/auth/save-token", { token });

/* -------------------------------------------------------------------------- */
/*                             USER / PROFILE APIs                            */
/* -------------------------------------------------------------------------- */

export const getProfile = () =>
  api.get("/api/user/profile");

export const updateUserProfile = (data) =>
  api.put("/api/user/profile", data);

export const uploadAvatar = (formData) =>
  api.post("/api/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/* -------------------------------------------------------------------------- */
/*                            BARBER PROFILE APIs                             */
/* -------------------------------------------------------------------------- */

export const getMyProfile = () =>
  api.get("/api/barber/me");

export const addProfile = (data) =>
  api.post("/api/barber/add", data);

export const updateProfile = (data) =>
  api.put("/api/barber/update", data);

export const deleteProfile = () =>
  api.delete("/api/barber/delete");

export const getApprovedBarbers = () =>
  api.get("/api/barber/approved");

export const toggleAutoConfirm = (autoConfirmOrders) =>
  api.patch("/api/barber/auto-confirm", {
    autoConfirmOrders,
  });

/* -------------------------------------------------------------------------- */
/*                                   SHOP APIs                                */
/* -------------------------------------------------------------------------- */

export const getShopBarbers = (query = "") =>
  api.get(`/api/shops${query ? `?${query}` : ""}`);

/* -------------------------------------------------------------------------- */
/*                             BARBER SERVICE APIs                            */
/* -------------------------------------------------------------------------- */

export const addBarberService = (data) =>
  api.post("/api/barber/services", data);

export const getMyBarberServices = () =>
  api.get("/api/barber/services/me");

export const getApprovedServicesByBarber = (id) =>
  api.get(`/api/services/approved/${id}`);

/* -------------------------------------------------------------------------- */
/*                         ADMIN BARBER APPROVAL APIs                         */
/* -------------------------------------------------------------------------- */

export const getPendingApprovals = () =>
  api.get("/api/admin/approvals");

export const approveBarber = (id) =>
  api.patch(`/api/admin/approvals/approve/${id}`);

export const declineBarber = (id) =>
  api.patch(`/api/admin/approvals/decline/${id}`);

/* -------------------------------------------------------------------------- */
/*                          ADMIN ORDER MANAGEMENT APIs                       */
/* -------------------------------------------------------------------------- */

export const getAdminOrders = (page = 1, limit = 10) =>
  api.get("/api/admin/orders", {
    params: { page, limit },
  });

/* -------------------------------------------------------------------------- */
/*                        ADMIN SERVICE APPROVAL APIs                         */
/* -------------------------------------------------------------------------- */

export const getPendingServices = () =>
  api.get("/api/services/admin/pending");

export const approveService = (id) =>
  api.patch(`/api/services/admin/approve/${id}`);

export const rejectService = (id) =>
  api.patch(`/api/services/admin/reject/${id}`);

/* -------------------------------------------------------------------------- */
/*                                  ORDER APIs                                */
/* -------------------------------------------------------------------------- */

export const createOrder = (data) =>
  api.post("/api/orders", data);

export const getMyOrders = () =>
  api.get("/api/orders/my");

export const getBarberOrders = () =>
  api.get("/api/orders/barber");

export const updateOrderStatus = (id, status) =>
  api.patch(`/api/orders/${id}/status`, { status });

/* -------------------------------------------------------------------------- */
/*                               NOTIFICATION APIs                            */
/* -------------------------------------------------------------------------- */

export const getMyNotifications = () =>
  api.get("/api/notifications/my");

export const markNotificationRead = (id) =>
  api.patch(`/api/notifications/read/${id}`);

/* -------------------------------------------------------------------------- */
/*                                  BLOG APIs                                 */
/* -------------------------------------------------------------------------- */

export const getAllBlogs = () =>
  api.get("/api/blogs");

export const getBlogBySlug = (slug) =>
  api.get(`/api/blogs/${slug}`);

export const createBlog = (data) =>
  api.post("/api/blogs", data);

export const updateBlog = (id, data) =>
  api.put(`/api/blogs/${id}`, data);

export const deleteBlog = (id) =>
  api.delete(`/api/blogs/${id}`);

/* -------------------------------------------------------------------------- */
/*                                   MAP APIs                                 */
/* -------------------------------------------------------------------------- */

export const getOrderRoute = (orderId) =>
  api.get(`/api/map/order/${orderId}`);

/* -------------------------------------------------------------------------- */
/*                               TIMESLOT APIs                                */
/* -------------------------------------------------------------------------- */

export const createSlots = (data) =>
  api.post("/api/timeslots/availability", data);

export const getAdminBookings = () =>
  api.get("/api/admin/slots/bookings");

export const bookSlot = (data) =>
  api.post("/api/timeslots/book", data);

export const getSlots = (date, barberId) =>
  api.get("/api/timeslots", {
    params: { date, barberId },
  });

/* -------------------------------------------------------------------------- */
/*                                 REVIEW APIs                                */
/* -------------------------------------------------------------------------- */

export const createReview = (data) =>
  api.post("/api/reviews", data);

export const getReviews = (barberId, page = 1, limit = 10) =>
  api.get(`/api/reviews/shop/${barberId}`, {
    params: { page, limit },
  });

export const getReviewSummary = (barberId) =>
  api.get(`/api/reviews/summary/${barberId}`);

export const updateReview = (reviewId, data) =>
  api.put(`/api/reviews/${reviewId}`, data);

export const deleteReview = (reviewId) =>
  api.delete(`/api/reviews/${reviewId}`);

/* -------------------------------------------------------------------------- */
/*                               ADMIN KPI APIs                               */
/* -------------------------------------------------------------------------- */

// Retained temporarily for compatibility during migration.

export const getAdminKPIs = () =>
  api.get("/api/admin-kpis");

export const getLatestUsers = () =>
  api.get("/api/admin-kpis/latest-users");

export const getAdminBarbers = ({
  page = 1,
  limit = 5,
  search = "",
} = {}) =>
  api.get("/api/admin-kpis/barbers", {
    params: { page, limit, search },
  });

export const getAdminUsers = ({
  page = 1,
  limit = 10,
  search = "",
} = {}) =>
  api.get("/api/admin-kpis/users", {
    params: { page, limit, search },
  });

export const exportAdminUsersCSV = (search = "") =>
  api.get("/api/admin-kpis/users/export", {
    params: { search },
    responseType: "blob",
  });

/* -------------------------------------------------------------------------- */
/*                              BARBER KPI APIs                               */
/* -------------------------------------------------------------------------- */

export const getBarberKPIs = () =>
  api.get("/api/barber/kpis");

/* -------------------------------------------------------------------------- */
/*                              BOOKINGS APIs                                 */
/* -------------------------------------------------------------------------- */

export const createBooking = (data) =>
  api.post("/api/user/bookings", data);

export const getBookings = (params = {}) =>
  api.get("/api/user/bookings", { params });

/* -------------------------------------------------------------------------- */
/*                                 CAMPAIGNS                                  */
/* -------------------------------------------------------------------------- */

export const getCampaigns = () =>
  api.get("/api/campaigns");

export const createCampaign = (data) =>
  api.post("/api/campaigns/send", data);

export const deleteCampaign = (id) =>
  api.delete(`/api/campaigns/${id}`);

/* -------------------------------------------------------------------------- */
/*                           FEATURED BARBERS APIs                            */
/* -------------------------------------------------------------------------- */

export const getFeaturedBarbers = ({
  businessType,
  limit = 6,
} = {}) =>
  api.get("/api/featured-barbers", {
    params: { businessType, limit },
  });

/* -------------------------------------------------------------------------- */
/*                                SETTINGS APIs                               */
/* -------------------------------------------------------------------------- */

export const getSettings = () =>
  api.get("/api/settings");

export const updateSettings = (data) =>
  api.patch("/api/settings", data);

/* -------------------------------------------------------------------------- */
/*                                  REELS APIs                                */
/* -------------------------------------------------------------------------- */

export const getReels = () =>
  api.get("/api/reels");

export const getAdminReels = () =>
  api.get("/api/admin/reels");

export const getReelById = (id) =>
  api.get(`/api/admin/reels/${id}`);

export const createReel = (data) =>
  api.post("/api/admin/reels", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateReel = (id, data) =>
  api.put(`/api/admin/reels/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteReel = (id) =>
  api.delete(`/api/admin/reels/${id}`);

/* -------------------------------------------------------------------------- */
/*                              BARBER CMS APIs                               */
/* -------------------------------------------------------------------------- */

export const createBarberCms = () =>
  api.post("/api/barber/cms");

export const getBarberCms = () =>
  api.get("/api/barber/cms");

export const getPublicBarberCms = (slug) =>
  api.get(`/api/barber/cms/public/${slug}`);

export const updateBarberCmsImages = (images) =>
  api.put("/api/barber/cms/images", { images });

export const updateBarberCmsDetails = (details) =>
  api.put("/api/barber/cms/details", { details });

export const updateBarberCmsServices = (services) =>
  api.put("/api/barber/cms/services", { services });

export const updateBarberCmsBarbers = (barbers) =>
  api.put("/api/barber/cms/barbers", { barbers });

export const updateBarberCmsOthers = (others) =>
  api.put("/api/barber/cms/others", { others });

/* -------------------------------------------------------------------------- */
/*                                 SEARCH APIs                                */
/* -------------------------------------------------------------------------- */

export const searchBarbers = (params = {}) =>
  api.get("/api/search", { params });

export const getSearchFilters = () =>
  api.get("/api/search/filters");

export const getSearchSuggestions = (search, limit = 10) =>
  api.get("/api/search/suggestions", {
    params: { search, limit },
  });

/* -------------------------------------------------------------------------- */
/*                                DEFAULT EXPORT                              */
/* -------------------------------------------------------------------------- */

export default api;
