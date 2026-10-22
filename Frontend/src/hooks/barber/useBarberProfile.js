
import {  useEffect,useState,  useCallback,} from "react";
import {  getMyProfile,  addProfile as addProfileService,  updateProfile as updateProfileService,} from "../../services/barberProfile.service";

const useBarberProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the logged-in barber's profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMyProfile();
      setProfile(res?.data?.data ?? null);
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to fetch barber profile"
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Create barber profile
  const addProfile = useCallback(async (data) => {
    try {
      setError(null);

      const res = await addProfileService(data);
      setProfile(res?.data?.data ?? null);

      return res;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add barber profile"
      );
      throw err;
    }
  }, []);

  // Update barber profile
  const updateProfile = useCallback(async (data) => {
    try {
      setError(null);

      const res = await updateProfileService(data);
      setProfile(res?.data?.data ?? null);

      return res;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update barber profile"
      );
      throw err;
    }
  }, []);

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
