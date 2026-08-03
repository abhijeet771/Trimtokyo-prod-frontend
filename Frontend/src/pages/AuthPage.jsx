import React, {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLock,
} from "react-icons/md";

import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";

import { toast } from "sonner";

import authBg from "../assets/images/auth-bg.jpg";

import { useAuth } from "../context/AuthContext";

import useLogin from "../hooks/useLogin";
import useRegister from "../hooks/useRegister";

import "./AuthPage.scss";

const AuthPage = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { login } = useLogin();
  const { register } = useRegister();

  const [mode, setMode] =
    useState("login");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "user",
    });

  /* ======================================================
      REDIRECT
  ====================================================== */

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/admin/dashboard", {
        replace: true,
      });

      return;
    }

    if (user.role === "barber") {
      navigate("/barber/dashboard", {
        replace: true,
      });

      return;
    }

    navigate("/shop", {
      replace: true,
    });
  }, [user, navigate]);

  /* ======================================================
      INPUT CHANGE
  ====================================================== */

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  /* ======================================================
      RESET FORM
  ====================================================== */

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "user",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  /* ======================================================
      LOGIN
  ====================================================== */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.phone.trim()) {
      toast.error(
        "Phone number is required."
      );
      return;
    }

    if (!formData.password.trim()) {
      toast.error(
        "Password is required."
      );
      return;
    }

    try {
      setLoading(true);

      await login({
        phone: formData.phone,
        password: formData.password,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
      REGISTER
  ====================================================== */

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error(
        "Enter a valid phone number."
      );
      return;
    }

    if (
      formData.email &&
      !/^\S+@\S+\.\S+$/.test(
        formData.email
      )
    ) {
      toast.error(
        "Enter a valid email."
      );
      return;
    }

    if (formData.password.length < 6) {
      toast.error(
        "Password should be at least 6 characters."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.error(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "user",
      });

      resetForm();
    } finally {
      setLoading(false);
    }
  };
  /* ======================================================
      RETURN
  ====================================================== */

  return (
    <div className="auth-page">
      <div
        className="auth-left"
        style={{
          backgroundImage: `url(${authBg})`,
        }}
      >
        <div className="auth-overlay">
          <div className="brand-content">
            <h1>TrimTokyo</h1>

            <p>
              Book premium barber
              services instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">

          <div className="auth-header">

            <h2>
              {mode === "login"
                ? "Welcome Back"
                : "Create Account"}
            </h2>

            <p>
              {mode === "login"
                ? "Login to continue."
                : "Create your account to get started."}
            </p>

          </div>

          <div className="auth-toggle">

            <button
              className={
                mode === "login"
                  ? "active"
                  : ""
              }
              onClick={() => {
                resetForm();
                setMode("login");
              }}
            >
              Login
            </button>

            <button
              className={
                mode === "register"
                  ? "active"
                  : ""
              }
              onClick={() => {
                resetForm();
                setMode("register");
              }}
            >
              Register
            </button>

          </div>
          <form
            className="auth-form"
            onSubmit={
              mode === "login"
                ? handleLogin
                : handleRegister
            }
          >
            {mode === "register" && (
              <div className="input-group">
                <MdPerson className="input-icon" />

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}

            {mode === "register" && (
              <div className="input-group">
                <MdEmail className="input-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Email (Optional)"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="input-group">
              <MdPhone className="input-icon" />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <MdLock className="input-icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </button>
            </div>

            {mode === "register" && (
              <div className="input-group">
                <MdLock className="input-icon" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </button>
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading
                ? mode === "login"
                  ? "Logging In..."
                  : "Creating Account..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            {mode === "login" ? (
              <>
                <span>
                  Don't have an account?
                </span>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setMode("register");
                  }}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <span>
                  Already have an account?
                </span>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setMode("login");
                  }}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;