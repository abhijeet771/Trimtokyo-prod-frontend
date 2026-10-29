
import { useState } from "react";
import {
  createBarberRequest,
} from "../../services/shared/barberRequest.service.js";

const useGuestBarberRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitBarberRequest = async (formData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await createBarberRequest({
        ownerName: formData.ownerName,
        shopName: formData.shopName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        city: formData.city,
        shopAddress: formData.shopAddress,
        description: formData.description || "",
      });

      setSuccess(
        response.message ||
          "Barber partner application submitted successfully"
      );

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit barber application"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetStatus = () => {
    setError("");
    setSuccess("");
  };

  return {
    loading,
    error,
    success,
    submitBarberRequest,
    resetStatus,
  };
};

export default useGuestBarberRequest;
