import { useCallback, useEffect } from "react";
import useBarberSlots from "./useBarberSlots";

const useBarberGeneratedSlots = (initialParams = {}) => {
  const {
    slots,
    loading,
    deletingId,
    error,
    fetchBarberSlots,
    deleteBarberSlot,
    clearError,
  } = useBarberSlots();

  const refreshSlots = useCallback(
    (params = initialParams) => fetchBarberSlots(params),
    [fetchBarberSlots, initialParams]
  );

  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  return {
    slots,
    loading,
    deletingId,
    error,
    refreshSlots,
    deleteBarberSlot,
    clearError,
  };
};

export default useBarberGeneratedSlots;