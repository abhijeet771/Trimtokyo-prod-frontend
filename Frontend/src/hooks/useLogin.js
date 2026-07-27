import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const useLogin = () => {
  const { setUser } = useAuth();

  const login = async (formData) => {
    const loadingToast = toast.loading(
      "Logging in..."
    );

    try {
      const payload = {
        phone: formData.phone,
        password: formData.password,
        tenantId:
          formData.tenantId ||
          import.meta.env.VITE_DEFAULT_TENANT_ID,
      };

      const res = await loginUser(payload);

      toast.dismiss(loadingToast);

      const user = res.data.data;
      const role = user?.role;

      if (role === "admin") {
        toast.success(
          "Admin Login Successful"
        );
      } else if (role === "barber") {
        toast.success(
          "Barber Login Successful"
        );
      } else {
        toast.success(
          "User Login Successful"
        );
      }

      setUser(user);

      return res.data;
    } catch (error) {
      toast.dismiss(
        loadingToast
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login Failed"
      );

      throw (
        error?.response?.data ||
        error
      );
    }
  };

  return { login };
};

export default useLogin;