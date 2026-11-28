import { useState, useCallback, useRef } from "react";

import {
  getAdminEventBookings,
  getAdminEventBookingById,
  createAdminEventBooking,
  updateAdminEventBooking,
  updateAdminEventBookingStatus,
  deleteAdminEventBooking,
  getActiveEventCategories,
  getAdminEventBookingDashboard,
} from "../../services/admin/eventBooking.service";

import { toast } from "sonner";

const INITIAL_DASHBOARD = {
  summary: {
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  },
  categoryDistribution: [],
};

const useEventBooking = (initialPage = 1, initialLimit = 10) => {
  /* ============================================================
     BOOKING DATA
  ============================================================ */

  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState(null);

  // Event categories
  const [categories, setCategories] = useState([]);

  // Dashboard
  const [dashboard, setDashboard] = useState(INITIAL_DASHBOARD);

  /* ============================================================
     PAGINATION
  ============================================================ */

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /* ============================================================
     FILTERS
  ============================================================ */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ============================================================
     LOADING STATES
  ============================================================ */

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState(null);

  /* ============================================================
     STABLE FILTER REFERENCES
  ============================================================ */

  const filtersRef = useRef({
    page,
    limit,
    search,
    status,
    eventCategory,
    startDate,
    endDate,
  });

  filtersRef.current = {
    page,
    limit,
    search,
    status,
    eventCategory,
    startDate,
    endDate,
  };

  /* ============================================================
     GET ALL EVENT BOOKINGS
  ============================================================ */

  const fetchBookings = useCallback(async (options = {}) => {
    const current = filtersRef.current;

    const nextPage = options.page ?? current.page;
    const nextLimit = options.limit ?? current.limit;
    const nextSearch = options.search ?? current.search;
    const nextStatus = options.status ?? current.status;
    const nextCategory =
      options.eventCategory ?? current.eventCategory;
    const nextStartDate = options.startDate ?? current.startDate;
    const nextEndDate = options.endDate ?? current.endDate;

    setLoading(true);
    setError(null);

    try {
      const res = await getAdminEventBookings(
        nextPage,
        nextLimit,
        nextSearch,
        nextStatus,
        nextCategory,
        nextStartDate,
        nextEndDate
      );

      const responseData = res.data?.data ?? [];

      const bookingList = Array.isArray(responseData)
        ? responseData
        : responseData?.bookings ?? [];

      const pagination = res.data?.pagination ?? {};

      setBookings(bookingList);
      setPage(nextPage);
      setLimit(nextLimit);
      setSearch(nextSearch);
      setStatus(nextStatus);
      setEventCategory(nextCategory);
      setStartDate(nextStartDate);
      setEndDate(nextEndDate);

      setTotal(pagination.total ?? bookingList.length);
      setTotalPages(pagination.totalPages ?? 0);

      return responseData;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load event bookings.";

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ============================================================
     GET EVENT BOOKING BY ID
  ============================================================ */

  const fetchBookingById = useCallback(async (id) => {
    setDetailsLoading(true);
    setError(null);

    try {
      const res = await getAdminEventBookingById(id);
      const bookingData = res.data?.data;

      setBooking(bookingData);

      return bookingData;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load event booking.";

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  /* ============================================================
     GET ACTIVE EVENT CATEGORIES
  ============================================================ */

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);

    try {
      const res = await getActiveEventCategories();

      const categoryList = res.data?.data ?? [];

      const normalizedCategories = Array.isArray(categoryList)
        ? categoryList
        : [];

      setCategories(normalizedCategories);

      return normalizedCategories;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load event categories.";

      toast.error(message);
      throw err;
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  /* ============================================================
     GET EVENT BOOKING DASHBOARD
  ============================================================ */

  const fetchDashboard = useCallback(async () => {
    setDashboardLoading(true);

    try {
      const res = await getAdminEventBookingDashboard();

      const dashboardData = res.data?.data ?? {};

      const normalizedDashboard = {
        summary: {
          ...INITIAL_DASHBOARD.summary,
          ...(dashboardData.summary ?? {}),
        },
        categoryDistribution:
          dashboardData.categoryDistribution ?? [],
      };

      setDashboard(normalizedDashboard);

      return normalizedDashboard;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load event booking dashboard.";

      toast.error(message);
      throw err;
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  /* ============================================================
     CREATE EVENT BOOKING
  ============================================================ */

  const createBooking = useCallback(async (bookingData) => {
    setCreating(true);

    try {
      const res = await createAdminEventBooking(bookingData);

      toast.success(
        res.data?.message ||
          "Event booking created successfully."
      );

      return res.data?.data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create event booking.";

      toast.error(message);
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  /* ============================================================
     UPDATE EVENT BOOKING
  ============================================================ */

  const updateBooking = useCallback(
    async (id, bookingData) => {
      setUpdating(true);

      try {
        const res = await updateAdminEventBooking(
          id,
          bookingData
        );

        toast.success(
          res.data?.message ||
            "Event booking updated successfully."
        );

        setBooking(res.data?.data);

        return res.data?.data;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update event booking.";

        toast.error(message);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  /* ============================================================
     UPDATE EVENT BOOKING STATUS
  ============================================================ */

  const changeBookingStatus = useCallback(
    async (id, newStatus) => {
      setStatusUpdating(true);

      try {
        const res = await updateAdminEventBookingStatus(
          id,
          newStatus
        );

        toast.success(
          res.data?.message ||
            "Booking status updated successfully."
        );

        const updatedBooking = res.data?.data;

        setBooking((prev) =>
          prev?._id === id
            ? { ...prev, ...updatedBooking }
            : prev
        );

        return updatedBooking;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update booking status.";

        toast.error(message);
        throw err;
      } finally {
        setStatusUpdating(false);
      }
    },
    []
  );

  /* ============================================================
     DELETE EVENT BOOKING
  ============================================================ */

  const removeBooking = useCallback(async (id) => {
    setDeleting(true);

    try {
      const res = await deleteAdminEventBooking(id);

      toast.success(
        res.data?.message ||
          "Event booking deleted successfully."
      );

      setBookings((prev) =>
        prev.filter((item) => item._id !== id)
      );

      setBooking((prev) =>
        prev?._id === id ? null : prev
      );

      return res.data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete event booking.";

      toast.error(message);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, []);

  /* ============================================================
     RETURN
  ============================================================ */

  return {
    // Data
    bookings,
    booking,
    categories,
    dashboard,

    // Dashboard data
    summary: dashboard.summary,
    categoryDistribution: dashboard.categoryDistribution,

    // Pagination
    page,
    limit,
    total,
    totalPages,

    // Filters
    search,
    status,
    eventCategory,
    startDate,
    endDate,

    // Setters
    setPage,
    setLimit,
    setSearch,
    setStatus,
    setEventCategory,
    setStartDate,
    setEndDate,

    // Loading states
    loading,
    detailsLoading,
    categoriesLoading,
    dashboardLoading,
    creating,
    updating,
    statusUpdating,
    deleting,

    // Error
    error,

    // API functions
    fetchBookings,
    fetchBookingById,
    fetchCategories,
    fetchDashboard,
    createBooking,
    updateBooking,
    changeBookingStatus,
    removeBooking,
  };
};

export default useEventBooking;