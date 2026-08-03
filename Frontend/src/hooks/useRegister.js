import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const useRegister = () => {
  const { setUser } = useAuth();

  const register = async (formData) => {
    const loadingToast = toast.loading(
      "Creating Account..."
    );

    try {
      const payload = {
        name: formData.name,
        email:
          formData.email || undefined,
        phone: formData.phone,
        password: formData.password,
        role: "user",
      };

      const res = await registerUser(
        payload
      );

      toast.dismiss(
        loadingToast
      );

      setUser(res.data.data);

      toast.success(
        "Account created successfully."
      );

      return res.data;
    } catch (error) {
      toast.dismiss(
        loadingToast
      );

      toast.error(
        error?.response?.data
          ?.message ||
          "Registration failed."
      );

      throw error;
    }
  };

  return { register };
};

export default useRegister;

/* -------------------------------------------------------------------------- */
/*                              OLD OTP VERSION                               */
/* -------------------------------------------------------------------------- */

/*
const register = async (formData) => {
  const loadingToast = toast.loading(
    "Creating Account..."
  );

  try {
    const payload = {
      name: formData.name,
      email:
        formData.email || undefined,
      password: formData.password,
      phone: formData.phone,
      role: formData.role || "user",
      tenantId:
        formData.tenantId ||
        import.meta.env
          .VITE_DEFAULT_TENANT_ID,
    };

    const res = await registerUser(
      payload
    );

    toast.dismiss(
      loadingToast
    );

    const user = res.data.data;
    const role = user?.role;

    if (role === "barber") {
      toast.success(
        "Barber Account Created Successfully"
      );
    } else {
      toast.success(
        "User Account Created Successfully"
      );
    }

    setUser(user);

    return res.data;
  } catch (error) {
    toast.dismiss(
      loadingToast
    );

    toast.error(
      error?.response?.data
        ?.message ||
        error?.message ||
        "Registration Failed"
    );

    throw (
      error?.response?.data ||
      error
    );
  }
};
*/