import { useCallback, useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
} from "../../services/profile.service";

const INITIAL_PROFILE = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  age: "",
  address: "",
  avatar: "",
};

const normalizeProfile = (user) => ({
  name: user?.name ?? "",
  email: user?.email ?? "",
  phone: user?.phone ?? "",
  gender: user?.gender ?? "",
  age: user?.age == null ? "" : String(user.age),
  address: user?.address ?? "",
  avatar: user?.avatar ?? "",
});

export default function useUserProfile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await getMyProfile();
      const result = response?.data;

      if (!result?.success || !result?.data) {
        throw new Error(
          result?.message || "Failed to load your profile."
        );
      }

      setProfile(normalizeProfile(result.data));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateField = useCallback((name, value) => {
    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccessMessage("");
  }, []);

  const saveProfile = useCallback(async () => {
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const ageValue =
        profile.age === "" ? null : Number(profile.age);

      if (
        ageValue !== null &&
        (!Number.isInteger(ageValue) || ageValue < 0)
      ) {
        throw new Error("Age must be a non-negative whole number.");
      }

      const payload = {
        gender: profile.gender,
        age: ageValue,
        address: profile.address.trim(),
      };

      const response = await updateMyProfile(payload);
      const result = response?.data;

      if (!result?.success || !result?.data) {
        throw new Error(
          result?.message || "Failed to save your profile."
        );
      }

      setProfile(normalizeProfile(result.data));
      setSuccessMessage(
        result.message || "Profile updated successfully."
      );

      return result.data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to save your profile.";

      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [profile]);

  return {
    profile,
    setProfile,
    updateField,
    loading,
    saving,
    error,
    successMessage,
    fetchProfile,
    saveProfile,
  };
}
