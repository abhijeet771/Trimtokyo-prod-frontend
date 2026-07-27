import { useEffect, useState } from "react";
import {
  getMyNotifications,
  markNotificationRead,
} from "../services/api";

const useNotifications = () => {
  const [notifications, setNotifications] =
    useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getMyNotifications();
      setNotifications(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    markAsRead,
    refresh: fetchNotifications,
  };
};

export default useNotifications;