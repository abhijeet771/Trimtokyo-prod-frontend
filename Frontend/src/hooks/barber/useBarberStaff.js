
import { useCallback, useState } from "react";

import {
  createBarberStaff as createBarberStaffAPI,
  getBarberStaff as getBarberStaffAPI,
  getBarberStaffById as getBarberStaffByIdAPI,
  updateBarberStaff as updateBarberStaffAPI,
  deleteBarberStaff as deleteBarberStaffAPI,
} from "../../services/barberStaff.service";

const useBarberStaff = () => {
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || fallback;

  /* ------------------------------ GET STAFF ------------------------------ */

  const fetchBarberStaff = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getBarberStaffAPI(params);
      const data = response?.data;

      const staffList = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.staff)
          ? data.staff
          : Array.isArray(data)
            ? data
            : [];

      setStaff(staffList);

      if (data?.pagination) {
        setPagination(data.pagination);
      } else {
        setPagination((previous) => ({
          ...previous,
          total: staffList.length,
        }));
      }

      return staffList;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to fetch staff members."
      );

      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------------------- GET STAFF BY ID -------------------------- */

  const fetchBarberStaffById = useCallback(async (staffId) => {
    try {
      setLoading(true);
      setError("");

      const response = await getBarberStaffByIdAPI(staffId);
      const data = response?.data?.data ?? response?.data;

      setSelectedStaff(data);
      return data;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to fetch staff details."
      );

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ------------------------------ CREATE STAFF --------------------------- */

  const createBarberStaff = useCallback(async (formData) => {
    try {
      setCreating(true);
      setError("");

      const response = await createBarberStaffAPI(formData);
      const createdStaff = response?.data?.data ?? response?.data;

      setStaff((previous) => [createdStaff, ...previous]);

      setPagination((previous) => ({
        ...previous,
        total: previous.total + 1,
      }));

      return {
        success: true,
        data: createdStaff,
        message:
          response?.data?.message || "Staff created successfully.",
      };
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to create staff member."
      );

      setError(message);
      return { success: false, message };
    } finally {
      setCreating(false);
    }
  }, []);

  /* ------------------------------ UPDATE STAFF --------------------------- */

  const updateBarberStaff = useCallback(async (staffId, formData) => {
    try {
      setUpdating(true);
      setError("");

      const response = await updateBarberStaffAPI(staffId, formData);
      const updatedStaff = response?.data?.data ?? response?.data;

      setStaff((previous) =>
        previous.map((item) =>
          (item._id || item.id) === staffId ? updatedStaff : item
        )
      );

      setSelectedStaff((previous) =>
        previous && (previous._id || previous.id) === staffId
          ? updatedStaff
          : previous
      );

      return {
        success: true,
        data: updatedStaff,
        message:
          response?.data?.message || "Staff updated successfully.",
      };
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to update staff member."
      );

      setError(message);
      return { success: false, message };
    } finally {
      setUpdating(false);
    }
  }, []);

  /* ------------------------------ DELETE STAFF --------------------------- */

  const removeBarberStaff = useCallback(async (staffId) => {
    try {
      setDeletingId(staffId);
      setError("");

      const response = await deleteBarberStaffAPI(staffId);

      setStaff((previous) =>
        previous.filter(
          (item) => (item._id || item.id) !== staffId
        )
      );

      setSelectedStaff((previous) =>
        previous && (previous._id || previous.id) === staffId
          ? null
          : previous
      );

      setPagination((previous) => ({
        ...previous,
        total: Math.max(0, previous.total - 1),
      }));

      return {
        success: true,
        message:
          response?.data?.message || "Staff deleted successfully.",
      };
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to delete staff member."
      );

      setError(message);
      return { success: false, message };
    } finally {
      setDeletingId(null);
    }
  }, []);

  const clearError = useCallback(() => setError(""), []);

  return {
    staff,
    selectedStaff,
    pagination,
    loading,
    creating,
    updating,
    deletingId,
    error,

    fetchBarberStaff,
    fetchBarberStaffById,
    createBarberStaff,
    updateBarberStaff,
    removeBarberStaff,
    clearError,
  };
};

export default useBarberStaff;
