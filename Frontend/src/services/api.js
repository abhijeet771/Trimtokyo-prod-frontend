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
  api.post("/api/v1/auth/register", data);

export const loginUser = (data) =>
  api.post("/api/v1/auth/login", data);

export const sendOtp = (data) =>
  api.post("/api/v1/auth/send-otp", data);

export const verifyOtp = (data) =>
  api.post("/api/v1/auth/verify-otp", data);

export const forgotPassword = (data) =>
  api.post("/api/v1/auth/forgot-password", data);

export const resetPassword = (data) =>
  api.post("/api/v1/auth/reset-password", data);

export const logoutUser = () =>
  api.post("/api/v1/auth/logout");

export const getCurrentUser = () =>
  api.get("/api/v1/auth/me");

/* -------------------------------------------------------------------------- */
/*                           FCM TOKEN APIs                                   */
/* -------------------------------------------------------------------------- */

export const saveFCMToken = (token) =>
  api.post("/api/v1/auth/save-token", { token });

/* -------------------------------------------------------------------------- */
/*                             USER / PROFILE APIs                            */
/* -------------------------------------------------------------------------- */

export const getProfile = () =>
  api.get("/api/v1/user/profile");

export const updateUserProfile = (data) =>
  api.put("/api/v1/user/profile", data);

export const uploadAvatar = (formData) =>
  api.post("/api/v1/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/* -------------------------------------------------------------------------- */
/*                            BARBER PROFILE APIs                             */
/* -------------------------------------------------------------------------- */

export const getMyProfile = () =>
  api.get("/api/v1/barber/me");

export const addProfile = (data) =>
  api.post("/api/v1/barber/add", data);

export const updateProfile = (data) =>
  api.put("/api/v1/barber/update", data);

export const deleteProfile = () =>
  api.delete("/api/v1/barber/delete");

export const getApprovedBarbers = () =>
  api.get("/api/v1/barber/approved");

export const toggleAutoConfirm = (  autoConfirmOrders) =>
  api.patch("/api/v1/barber/auto-confirm",{
      autoConfirmOrders,
    }
  );

/* -------------------------------------------------------------------------- */
/*                                   SHOP APIs                                */
/* -------------------------------------------------------------------------- */

export const getShopBarbers = (query) =>
  api.get(`/api/v1/shop?${query}`);

/* -------------------------------------------------------------------------- */
/*                             BARBER SERVICE APIs                            */
/* -------------------------------------------------------------------------- */

export const addBarberService = (data) =>
  api.post("/api/v1/services/add", data);

export const getMyBarberServices = () =>
  api.get("/api/v1/services/me");

export const getApprovedServicesByBarber = (id) =>
  api.get(`/api/v1/services/approved/${id}`);

/* -------------------------------------------------------------------------- */
/*                         ADMIN BARBER APPROVAL APIs                         */
/* -------------------------------------------------------------------------- */

export const getPendingApprovals = () =>
  api.get("/api/v1/admin/approvals");

export const approveBarber = (id) =>
  api.patch(`/api/v1/admin/approve/${id}`);

export const declineBarber = (id) =>
  api.patch(`/api/v1/admin/decline/${id}`);

/* -------------------------------------------------------------------------- */
/*                          ADMIN ORDER MANAGEMENT APIs                       */
/* -------------------------------------------------------------------------- */

export const getAdminOrders = (page = 1, limit = 10) =>
  api.get(`/api/v1/admin/orders?page=${page}&limit=${limit}`);

/* -------------------------------------------------------------------------- */
/*                        ADMIN SERVICE APPROVAL APIs                         */
/* -------------------------------------------------------------------------- */

export const getPendingServices = () =>
  api.get("/api/v1/services/admin/pending");

export const approveService = (id) =>
  api.patch(`/api/v1/services/admin/approve/${id}`);

export const rejectService = (id) =>
  api.patch(`/api/v1/services/admin/reject/${id}`);

/* -------------------------------------------------------------------------- */
/*                                  ORDER APIs                                */
/* -------------------------------------------------------------------------- */

export const createOrder = (data) =>
  api.post("/api/v1/orders", data);

export const getMyOrders = () =>
  api.get("/api/v1/orders/my");

export const getBarberOrders = () =>
  api.get("/api/v1/orders/barber");

export const updateOrderStatus = (id, status) =>
  api.patch(`/api/v1/orders/${id}/status`, { status });

/* -------------------------------------------------------------------------- */
/*                               NOTIFICATION APIs                            */
/* -------------------------------------------------------------------------- */

export const getMyNotifications = () =>
  api.get("/api/v1/notifications/my");

export const markNotificationRead = (id) =>
  api.patch(`/api/v1/notifications/read/${id}`);

/* -------------------------------------------------------------------------- */
/*                                  BLOG APIs                                 */
/* -------------------------------------------------------------------------- */

export const getAllBlogs = () =>
  api.get("/api/v1/blogs");

export const getBlogBySlug = (slug) =>
  api.get(`/api/v1/blogs/${slug}`);

export const createBlog = (data) =>
  api.post("/api/v1/blogs", data);

export const updateBlog = (id, data) =>
  api.put(`/api/v1/blogs/${id}`, data);

export const deleteBlog = (id) =>
  api.delete(`/api/v1/blogs/${id}`);

/* -------------------------------------------------------------------------- */
/*                                   MAP APIs                                 */
/* -------------------------------------------------------------------------- */

export const getOrderRoute = (orderId) =>
  api.get(`/api/v1/map/order/${orderId}`);


/* -------------------------------------------------------------------------- */
/*                               TIMESLOT APIs                                */
/* -------------------------------------------------------------------------- */

export const createSlots = (data) =>
  api.post("/api/v1/timeslots/availability", data);

export const getAdminBookings = () =>
  api.get("/api/v1/admin-slots/bookings"); 

export const bookSlot = (data) =>
  api.post("/api/v1/timeslots/book", data);

export const getSlots = (date, barberId) =>
  api.get("/api/v1/timeslots", {
    params: { date, barberId },
  });

/* -------------------------------------------------------------------------- */
/*                                 REVIEW APIs                                */
/* -------------------------------------------------------------------------- */

export const createReview = (data) =>
  api.post("/api/v1/reviews", data);

// Get Reviews (Paginated)
export const getReviews = (  barberId,  page = 1,  limit = 10) =>
  api.get(
    `/api/v1/reviews/shop/${barberId}?page=${page}&limit=${limit}`
  );

// Get Rating Summary
export const getReviewSummary = (barberId) =>
  api.get(`/api/v1/reviews/summary/${barberId}`);

// Update Review
export const updateReview = (reviewId, data) =>
  api.put(`/api/v1/reviews/${reviewId}`, data);

// Delete Review
export const deleteReview = (reviewId) =>
  api.delete(`/api/v1/reviews/${reviewId}`);

/* -------------------------------------------------------------------------- */
/*                               ADMIN KPI APIs HISTORY                       */
/* -------------------------------------------------------------------------- */

export const getAdminKPIs = () =>
  api.get("/api/v1/admin-kpis");

export const getLatestUsers = () =>
  api.get("/api/v1/admin-kpis/latest-users");

export const getAdminBarbers = ({  page = 1,  limit = 5,
  search = "",} = {}) => api.get("/api/v1/admin-kpis/barbers", {
    params: {page, limit, search, },});

/* -------------------------------------------------------------------------- */
/*                            ADMIN KPI USERS APIs                            */
/* -------------------------------------------------------------------------- */


export const getAdminUsers = ({  page = 1,  limit = 10,  search = "",} = {}) =>
  api.get("/api/v1/admin-kpis/users", {
    params: {page,limit,search,},});

export const exportAdminUsersCSV = (search = "") =>
  api.get("/api/v1/admin-kpis/users/export", {
    params: {      search,    },    responseType: "blob",  });


/* -------------------------------------------------------------------------- */
/*                               BARBER KPI APIs HISTORY                      */
/* -------------------------------------------------------------------------- */

export const getBarberKPIs = () =>
  api.get("/api/v1/barber-kpis");

/* -------------------------------------------------------------------------- */
/*                              BOOKINGS APIs                                 */
/* -------------------------------------------------------------------------- */

export const createBooking = (data) =>
  api.post("/api/v1/bookings", data);

export const getBookings = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/api/v1/bookings?${query}`);
};


// ================= CAMPAIGNS =================

export const getCampaigns = () =>
  api.get("/api/v1/campaigns");

export const createCampaign = (data) =>
  api.post("/api/v1/campaigns/send",data);

export const deleteCampaign = (  id) =>
  api.delete(  `/api/v1/campaigns/${id}`);

/* -------------------------------------------------------------------------- */
/*                         FEATURED BARBERS APIs                              */
/* -------------------------------------------------------------------------- */

export const getFeaturedBarbers = ({  businessType,  limit = 6,}) =>
  api.get(`/api/v1/featured-barbers?businessType=${businessType}&limit=${limit}`
  );

/* -------------------------------------------------------------------------- */
/*                              SETTINGS APIs                                 */
/* -------------------------------------------------------------------------- */

export const getSettings = () =>
  api.get("/api/settings");

export const updateSettings = (data) =>
  api.patch("/api/settings", data);

/* -------------------------------------------------------------------------- */
/*                               REELS APIs                                   */
/* -------------------------------------------------------------------------- */

export const getReels = () =>
  api.get("/api/v1/reels");

export const getAdminReels = () =>
  api.get("/api/v1/reels/admin");

export const getReelById = (id) =>
  api.get(`/api/v1/reels/admin/${id}`);

export const createReel = (data) =>
  api.post("/api/v1/reels/admin", data, {
    headers: {      "Content-Type": "multipart/form-data",    },  });

export const updateReel = (id, data) =>
  api.put(`/api/v1/reels/admin/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteReel = (id) =>
  api.delete(`/api/v1/reels/admin/${id}`);

/* -------------------------------------------------------------------------- */
/*                             BARBER CMS APIs                                */
/* -------------------------------------------------------------------------- */

export const createBarberCms = () =>
  api.post("/api/v1/barber-cms");

export const getBarberCms = () =>
  api.get("/api/v1/barber-cms");

export const getPublicBarberCms = (slug) =>
  api.get(`/api/v1/barber-cms/public/${slug}`);

export const updateBarberCmsImages = (images) =>
  api.put("/api/v1/barber-cms/images", {
    images,
  });

export const updateBarberCmsDetails = (details) =>
  api.put("/api/v1/barber-cms/details", {
    details,
  });

export const updateBarberCmsServices = (services) =>
  api.put("/api/v1/barber-cms/services", {
    services,
  });

export const updateBarberCmsBarbers = (barbers) =>
  api.put("/api/v1/barber-cms/barbers", {
    barbers,
  });

export const updateBarberCmsOthers = (others) =>
  api.put("/api/v1/barber-cms/others", {
    others,
  });

export default api;