
import { useState, useCallback } from "react";
import { createGuestSupportTicket } from "../../services/shared/guestSupport.services.js";

const useGuestSupport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitTicket = useCallback(async (payload) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await createGuestSupportTicket(payload);

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to submit support request."
        );
      }

      setSuccess(
        response?.message || "Support request submitted successfully."
      );

      return {
        success: true,
        data: response?.data,
        message: response?.message,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit support request.";

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  return {
    loading,
    error,
    success,
    submitTicket,
    resetMessages,
  };
};

export default useGuestSupport;
