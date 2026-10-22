import { useCallback, useEffect } from "react";
import useBarberSlots from "./useBarberSlots";

const useBarberUpcomingBookings = () => {
  const {
    bookings,
    bookingsLoading,
    error,
    fetchBarberBookings,
    clearError,
  } = useBarberSlots();

  useEffect(() => {
    fetchBarberBookings();
  }, [fetchBarberBookings]);

  const refreshBookings = useCallback(
    () => fetchBarberBookings(),
    [fetchBarberBookings]
  );

  return {
    bookings,
    loading: bookingsLoading,
    error,
    refreshBookings,
    clearError,
  };
};

export default useBarberUpcomingBookings;