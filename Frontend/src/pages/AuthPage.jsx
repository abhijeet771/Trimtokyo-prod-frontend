
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLock,
  MdContentCut,
  MdCalendarMonth,
  MdVerifiedUser,
  MdStarOutline,
  MdArrowForward,
} from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "sonner";

import { useAuth } from "../context/AuthContext";
import useLogin from "../hooks/useLogin";
import useRegister from "../hooks/useRegister";
import "./AuthPage.scss";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { login } = useLogin();
  const { register } = useRegister();

  const returnTo = location.state?.from;
  const returnPath =
    typeof returnTo === "string"
      ? returnTo
      : returnTo?.pathname
        ? `${returnTo.pathname}${returnTo.search || ""}${returnTo.hash || ""}`
        : "/";

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else if (user.role === "barber") {
      navigate("/barber/dashboard", { replace: true });
    } else {
      navigate(returnPath, { replace: true });
    }
  }, [user, navigate, returnPath]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "referralCode" ? value.toUpperCase() : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchMode = (nextMode) => {
    resetForm();
    setMode(nextMode);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required.");
      return;
    }

    try {
      setLoading(true);
      await login({
        phone: formData.phone,
        password: formData.password,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    if (
      formData.email &&
      !/^\S+@\S+\.\S+$/.test(formData.email)
    ) {
      toast.error("Enter a valid email.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        password: formData.password,
        role: "user",
        referralCode: formData.referralCode.trim() || undefined,
      });

      toast.success("Account created successfully.");
      resetForm();
      setMode("login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-left">
        <div className="auth-brand">
          <span className="auth-brand-icon">
            <MdContentCut />
          </span>
          <span>TrimTokyo</span>
        </div>

        <div className="auth-promo">
          <span className="auth-eyebrow">
            PREMIUM GROOMING. CLOSER TO YOU.
          </span>

          <h1>
            Book. Groom.
            <br />
            Look Great.
          </h1>

          <p className="auth-description">
            Discover trusted barbers, easy booking, and a premium
            grooming experience — only on TrimTokyo.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature-icon">
                <MdCalendarMonth />
              </span>
              <div>
                <strong>Easy Booking</strong>
                <p>Choose your barber and book in seconds.</p>
              </div>
            </div>

            <div className="auth-feature">
              <span className="auth-feature-icon">
                <MdVerifiedUser />
              </span>
              <div>
                <strong>Trusted Professionals</strong>
                <p>Skilled barbers committed to your comfort.</p>
              </div>
            </div>

            <div className="auth-feature">
              <span className="auth-feature-icon">
                <MdStarOutline />
              </span>
              <div>
                <strong>Premium Experience</strong>
                <p>Simple, reliable grooming at your convenience.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-decoration" aria-hidden="true">
          <span>✦</span>
          <p>SELF CARE
            <br />
            LOOKS GOOD
            <br />
            ON YOU
          </p>
        </div>
      </section>

      <section className="auth-right">
        <div className="auth-card">
          <header className="auth-header">
            <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
            <p>
              {mode === "login"
                ? "Sign in to continue to TrimTokyo."
                : "Join TrimTokyo and elevate your grooming experience."}
            </p>
          </header>

          <div className="auth-toggle">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => switchMode("register")}
            >
              Create account
            </button>
          </div>

          <form
            className="auth-form"
            onSubmit={mode === "login" ? handleLogin : handleRegister}
          >
            {mode === "register" && (
              <>
                <label htmlFor="auth-name">Full name</label>
                <div className="auth-input">
                  <MdPerson />
                  <input
                    id="auth-name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>

                <label htmlFor="auth-email">Email address (optional)</label>
                <div className="auth-input">
                  <MdEmail />
                  <input
                    id="auth-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </>
            )}

            <label htmlFor="auth-phone">Phone number</label>
            <div className="auth-input auth-phone">
              <MdPhone />
              <span className="auth-country">🇮🇳 +91</span>
              <input
                id="auth-phone"
                type="tel"
                name="phone"
                placeholder="10-digit phone number"
                maxLength={10}
                inputMode="numeric"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel-national"
                required
              />
            </div>

            <label htmlFor="auth-password">Password</label>
            <div className="auth-input">
              <MdLock />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                required
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            {mode === "register" && (
              <>
                <label htmlFor="auth-confirm-password">
                  Confirm password
                </label>
                <div className="auth-input">
                  <MdLock />
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                </div>

                <label htmlFor="auth-referral">
                  Have a referral code? <span>(Optional)</span>
                </label>
                <div className="auth-input">
                  <MdStarOutline />
                  <input
                    id="auth-referral"
                    name="referralCode"
                    placeholder="Enter referral code"
                    value={formData.referralCode}
                    onChange={handleChange}
                    autoComplete="off"
                    maxLength={40}
                  />
                </div>
              </>
            )}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Continue with phone"
                  : "Create account"}
              {!loading && <MdArrowForward />}
            </button>
          </form>

          <p className="auth-legal">
            By continuing, you agree to our{" "}
            <button type="button" onClick={() => navigate("/terms")}>
              Terms of Service
            </button>{" "}
            and{" "}
            <button type="button" onClick={() => navigate("/privacy")}>
              Privacy Policy
            </button>.
          </p>

          <div className="auth-footer">
            {mode === "login" ? (
              <>
                <span>New to TrimTokyo?</span>
                <button type="button" onClick={() => switchMode("register")}>
                  Create account <MdArrowForward />
                </button>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <button type="button" onClick={() => switchMode("login")}>
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
