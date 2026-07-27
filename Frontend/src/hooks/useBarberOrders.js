import { useEffect, useState } from "react";
import { getBarberOrders } from "../services/api";

const useBarberOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await getBarberOrders();
      setOrders(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, refresh: fetchOrders };
};

export default useBarberOrders;