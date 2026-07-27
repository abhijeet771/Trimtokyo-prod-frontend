import { useState } from "react";
import { getAdminBookings } from "../services/api";

const useAdminSlots = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await getAdminBookings();

      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(
        "❌ Error fetching admin bookings:",
        err.response?.data || err
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    fetchBookings,
  };
};

export default useAdminSlots;