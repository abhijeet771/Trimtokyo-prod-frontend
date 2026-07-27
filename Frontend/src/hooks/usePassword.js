import {
  forgotPassword,
  resetPassword,
} from "../services/api";

import { toast } from "sonner";

const usePassword = () => {
  const forgot = async (
    phone,
    tenantId
  ) => {
    const loadingToast = toast.loading(
      "Sending OTP..."
    );

    try {
      const res =
        await forgotPassword({
          phone,
          tenantId:
            tenantId ||
            import.meta.env
              .VITE_DEFAULT_TENANT_ID,
        });

      toast.dismiss(loadingToast);

      toast.success(
        res.data.message ||
          "OTP sent successfully."
      );

      return res.data;
    } catch (error) {
      toast.dismiss(loadingToast);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send OTP."
      );

      throw (
        error?.response?.data ||
        error
      );
    }
  };

  const reset = async (
    phone,
    password,
    tenantId
  ) => {
    const loadingToast = toast.loading(
      "Resetting password..."
    );

    try {
      const res =
        await resetPassword({
          phone,
          password,
          tenantId:
            tenantId ||
            import.meta.env
              .VITE_DEFAULT_TENANT_ID,
        });

      toast.dismiss(loadingToast);

      toast.success(
        res.data.message ||
          "Password reset successfully."
      );

      return res.data;
    } catch (error) {
      toast.dismiss(loadingToast);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Password reset failed."
      );

      throw (
        error?.response?.data ||
        error
      );
    }
  };

  return {
    forgotPassword: forgot,
    resetPassword: reset,
  };
};

export default usePassword;