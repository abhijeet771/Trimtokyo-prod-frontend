
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const useRegister = () => {
  const { setUser } = useAuth();

  const register = async (formData) => {
    const loadingToast = toast.loading("Creating Account...");

    try {
      const payload = {
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        password: formData.password,
        role: "user",
        ...(formData.referralCode?.trim()
          ? { referralCode: formData.referralCode.trim().toUpperCase() }
          : {}),
      };

      const res = await registerUser(payload);

      toast.dismiss(loadingToast);

      setUser(res.data.data);

      toast.success("Account created successfully.");

      return res.data;
    } catch (error) {
      toast.dismiss(loadingToast);

      toast.error(
        error?.response?.data?.message ||
          "Registration failed."
      );

      throw error;
    }
  };

  return { register };
};

export default useRegister;
