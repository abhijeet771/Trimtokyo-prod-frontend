import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

const useBarberProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch barber
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/api/v1/barber/me");
      setProfile(res.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null);
      } else {
        setError(err.response?.data?.message || "Failed to fetch barber");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Add barber
  const addProfile = async (data) => {
    try {
      setError(null);
      const res = await api.post("/api/v1/barber/add", data);
      setProfile(res.data.data);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add barber");
      throw err;
    }
  };

  // Update barber
  const updateProfile = async (data) => {
    try {
      setError(null);
      const res = await api.put("/api/v1/barber/update", data);
      setProfile(res.data.data);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update barber");
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    addProfile,
    updateProfile,
    refresh: fetchProfile,
  };
};

export default useBarberProfile;