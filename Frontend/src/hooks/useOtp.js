import {
  sendOtp,
  verifyOtp,
} from "../services/api";

import { toast } from "sonner";

const useOtp = () => {
  const send = async (phone, tenantId) => {
    const loadingToast = toast.loading(
      "Sending OTP..."
    );

    try {
      const res = await sendOtp({
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

  const verify = async (
    phone,
    otp,
    tenantId
  ) => {
    const loadingToast = toast.loading(
      "Verifying OTP..."
    );

    try {
      const res = await verifyOtp({
        phone,
        otp,
        tenantId:
          tenantId ||
          import.meta.env
            .VITE_DEFAULT_TENANT_ID,
      });

      toast.dismiss(loadingToast);

      toast.success(
        res.data.message ||
          "OTP verified successfully."
      );

      return res.data;
    } catch (error) {
      toast.dismiss(loadingToast);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "OTP verification failed."
      );

      throw (
        error?.response?.data ||
        error
      );
    }
  };

  return {
    sendOtp: send,
    verifyOtp: verify,
  };
};

export default useOtp;