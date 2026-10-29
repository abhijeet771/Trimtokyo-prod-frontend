
import { useState } from "react";
import {
  createEventRequest,
} from "../../services/shared/eventRequest.service.js";

const useGuestEventRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitEventRequest = async (formData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await createEventRequest({
        eventName: formData.eventName,
        totalMembers: Number(formData.totalMembers),
        description: formData.description || "",
        address: formData.address,
        phone: formData.phone,
      });

      setSuccess(
        response.message || "Event enquiry submitted successfully"
      );

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit event enquiry"
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
    submitEventRequest,
    resetStatus,
  };
};

export default useGuestEventRequest;
