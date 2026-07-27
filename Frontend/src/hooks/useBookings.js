import { useEffect, useState } from "react";
import { getBookings } from "../services/api"; 

export default function useBookings(filters = {}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await getBookings({
        page,
        limit: 10,
        ...filters,
      });

      setBookings(res?.data?.bookings || []);
      setTotalPages(res?.data?.totalPages || 1);

    } catch (err) {
      console.error("Error fetching bookings", err);
      setBookings([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, JSON.stringify(filters)]);

  return {
    bookings,
    loading,
    page,
    setPage,
    totalPages,
    refetch: fetchBookings,
  };
}