import React, {  useEffect,  useState,} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {  MdEmail,  MdLock,  MdPerson,  MdPhone,} from "react-icons/md";
import {  AiOutlineEye,  AiOutlineEyeInvisible,} from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import useLogin from "../hooks/useLogin";
import useRegister from "../hooks/useRegister";
import useOtp from "../hooks/useOtp";
import usePassword from "../hooks/usePassword";

import "./AuthPage.scss";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { login } = useLogin();
  const { register } = useRegister();
  const {sendOtp,verifyOtp,} = useOtp();
  const {forgotPassword, resetPassword,  } = usePassword();
  const [mode, setMode] =    useState("login");
  /*      login      register      forgot  */

  /* =======================================================
      REGISTER STEP
  ======================================================= */

  const [ registerStep, setRegisterStep, ] = useState(1);

  /* =======================================================
      FORGOT PASSWORD STEP
  ======================================================= */

  const [ forgotStep, setForgotStep,  ] = useState(1);
  const [ showPassword, setShowPassword, ] = useState(false);
  const [otp, setOtp] =    useState("");

  const [formData, setFormData] =    useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "user",
      tenantId: import.meta.env.VITE_DEFAULT_TENANT_ID ||        "",
    });

  /* =======================================================
      REDIRECT AFTER LOGIN
  ======================================================= */

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate(
        "/admin/dashboard",
        {
          replace: true,
        }
      );
    } else if (
      user.role === "barber"
    ) {
      navigate(
        "/barber/dashboard",
        {
          replace: true,
        }
      );
    } else {
      navigate("/shop", {
        replace: true,
      });
    }
  }, [user, navigate]);

  /* =======================================================
      INPUT CHANGE
  ======================================================= */

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  /* =======================================================
      SEND OTP
  ======================================================= */

  const handleSendOtp =
    async () => {
      if (!/^[6-9]\d{9}$/.test(
          formData.phone
        )
      ) {
        toast.error(
          "Enter a valid phone number."
        );

        return;
      }

      try {
        if (mode === "register") {
          await sendOtp(
            formData.phone,
            formData.tenantId
          );

          setRegisterStep(2);
        } else {
          await forgotPassword(
            formData.phone,
            formData.tenantId
          );

          setForgotStep(2);
        }
      } catch {}
    };

  /* =======================================================
      VERIFY OTP
  ======================================================= */

  const handleVerifyOtp =async () => {
      if (otp.trim().length !== 6) {
        toast.error("Enter valid OTP.");

        return;
      }

      try {
        await verifyOtp(
          formData.phone,
          otp,
          formData.tenantId
        );

        if (
          mode === "register"
        ) {
          setRegisterStep(3);
        } else {
          setForgotStep(3);
        }
      } catch {}
    };

  /* =======================================================
      LOGIN
  ======================================================= */

  const handleLogin =
    async (e) => {
      e.preventDefault();

      try {
        await login({
          phone:formData.phone,
          password:formData.password,
          tenantId: formData.tenantId,
        });
      } catch {}
    };

  /* =======================================================
      REGISTER
  ======================================================= */

  const handleRegister =
    async (e) => {
      e.preventDefault();

      try {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: formData.role,
          tenantId: formData.tenantId,
        });
      } catch {}
    };

  /* =======================================================
      RESET PASSWORD
  ======================================================= */

  const handleResetPassword =
    async (e) => {
      e.preventDefault();

      try {
        await resetPassword(
          formData.phone,
          formData.password,
          formData.tenantId
        );

        setMode("login");
        setForgotStep(1);
        setOtp("");

        toast.success(
          "Password reset successfully."
        );
      } catch {}
    };

  /* =======================================================
      RESET PAGE
  ======================================================= */

  const resetPage = () => {
    setOtp("");
    setRegisterStep(1);
    setForgotStep(1);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "user",
      tenantId:
        import.meta.env
          .VITE_DEFAULT_TENANT_ID ||
        "",
    });
  };

  /* =======================================================
      RETURN
  ======================================================= */

  return (
<>
  <div className="auth-page">
    <div className="auth-bg">
      <div className="bg-shape bg-shape--one"></div>
      <div className="bg-shape bg-shape--two"></div>
    </div>

    <div className="auth-container">
      <div className="auth-card">

        {/* ================= LOGO ================= */}

        <div  className="auth-logo" onClick={() => navigate("/")}>
          <img src="/scissor.png" alt="TrimTokyo"/>
          <h2>Trim
            <span>Tokyo</span>
          </h2>
        </div>

        {/* ================= TITLE ================= */}

        <h3 className="auth-title">
          {mode === "login" && "Welcome Back"}

          {mode === "register" &&
            (registerStep === 1
              ? "Create Account"
              : registerStep === 2
              ? "Verify OTP"
              : "Complete Registration")}

          {mode === "forgot" &&
            (forgotStep === 1
              ? "Forgot Password"
              : forgotStep === 2
              ? "Verify OTP"
              : "Reset Password")}
        </h3>

        {/* ================= LOGIN ================= */}

        {mode === "login" && (
          <form
            className="auth-form"
            onSubmit={
              handleLogin
            }
          >
            <div className="form-group">
              <MdPhone className="input-icon" />

              <input type="tel" name="phone" placeholder="Phone Number"
                value={ formData.phone}
                onChange={ handleChange}
                required
              />
            </div>

            <div className="form-group password-group">
              <MdLock className="input-icon" />

              <input type={ showPassword? "text": "password"}
                name="password" placeholder="Password"
                value={formData.password}
                onChange={handleChange}required
              />

              <span className="password-toggle" onClick={() =>
                  setShowPassword(!showPassword)
                }>
                {showPassword ? (<AiOutlineEyeInvisible />) : (
                  <AiOutlineEye />
                )}
              </span>
            </div>

            <div className="forgot-password">
              <span onClick={() => { resetPage();
                  setMode("forgot");
                }}
                style={{cursor:"pointer",}}>
                Forgot Password?
              </span>
            </div>

            <button className="auth-button" type="submit">
              Login
            </button>
          </form>
        )}
        {/* ================= REGISTER ================= */}

        {mode === "register" &&
          registerStep === 1 && (
            <form
              className="auth-form"
              onSubmit={(e) =>
                e.preventDefault()
              }
            >
              <div className="form-group">
                <MdPhone className="input-icon" />

                <input type="tel" name="phone" placeholder="Phone Number"
                  value={ formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="button" className="auth-button" onClick={  handleSendOtp}>
                Send OTP
              </button>

              <p className="auth-switch"
                style={{  marginTop: 20,}}>
                Already have an account?
                <span  onClick={() => {    resetPage();    setMode(  "login");}}>
                  Login
                </span>
              </p>
            </form>
          )}

        {/* ================= REGISTER STEP 2 ================= */}

        {mode === "register" &&
          registerStep === 2 && (
            <form
              className="auth-form"
              onSubmit={(e) =>
                e.preventDefault()
              }
            >
              <div className="form-group">
                <MdLock className="input-icon" />

                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  maxLength={6}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <button
                type="button"
                className="auth-button"
                onClick={
                  handleVerifyOtp
                }
              >
                Verify OTP
              </button>

              <button
                type="button"
                className="auth-button"
                style={{
                  marginTop: 10,
                  background:
                    "#6b7280",
                }}
                onClick={() =>
                  setRegisterStep(
                    1
                  )
                }
              >
                Back
              </button>
            </form>
          )}
        {/* ================= REGISTER STEP 3 ================= */}

        {mode === "register" &&
          registerStep === 3 && (
            <form
              className="auth-form"
              onSubmit={
                handleRegister
              }
            >
              <div className="form-group">
                <MdPerson className="input-icon" />

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <MdEmail className="input-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Email (Optional)"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group password-group">
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
                  required
                />

                <span
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
                </span>
              </div>

              <div className="form-group">
                <MdPerson className="input-icon" />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Role
                  </option>

                  <option value="USER">
                    Customer
                  </option>

                  <option value="BARBER">
                    Barber
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="auth-button"
              >
                Create Account
              </button>

              <button
                type="button"
                className="auth-button"
                style={{
                  marginTop: 10,
                  background:
                    "#6b7280",
                }}
                onClick={() =>
                  setRegisterStep(2)
                }
              >
                Back
              </button>

              <p
                className="auth-switch"
                style={{
                  marginTop: 20,
                }}
              >
                Already have an account?

                <span
                  onClick={() => {
                    resetPage();
                    setMode("login");
                  }}
                >
                  Login
                </span>
              </p>
            </form>
          )}
        {/* ================= FORGOT PASSWORD STEP 1 ================= */}

        {mode === "forgot" &&
          forgotStep === 1 && (
            <form
              className="auth-form"
              onSubmit={(e) =>
                e.preventDefault()
              }
            >
              <div className="form-group">
                <MdPhone className="input-icon" />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="button"
                className="auth-button"
                onClick={handleVerifyOtp}
              >
                Send OTP
              </button>

              <p
                className="auth-switch"
                style={{ marginTop: 20 }}
              >
                Remember your password?

                <span
                  onClick={() => {
                    resetPage();
                    setMode("login");
                  }}
                >
                  Login
                </span>
              </p>
            </form>
          )}

        {/* ================= FORGOT PASSWORD STEP 2 ================= */}

        {mode === "forgot" &&
          forgotStep === 2 && (
            <form
              className="auth-form"
              onSubmit={(e) =>
                e.preventDefault()
              }
            >
              <div className="form-group">
                <MdLock className="input-icon" />

                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  maxLength={6}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="button"
                className="auth-button"
                onClick={
                  handleVerifyForgotOtp
                }
              >
                Verify OTP
              </button>

              <button
                type="button"
                className="auth-button"
                style={{
                  marginTop: 10,
                  background: "#6b7280",
                }}
                onClick={() =>
                  setForgotStep(1)
                }
              >
                Back
              </button>
            </form>
          )}

        {/* ================= FORGOT PASSWORD STEP 3 ================= */}

        {mode === "forgot" &&
          forgotStep === 3 && (
            <form
              className="auth-form"
              onSubmit={
                handleResetPassword
              }
            >
              <div className="form-group password-group">
                <MdLock className="input-icon" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="New Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <span
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
                </span>
              </div>

              <button
                type="submit"
                className="auth-button"
              >
                Reset Password
              </button>

              <button
                type="button"
                className="auth-button"
                style={{
                  marginTop: 10,
                  background: "#6b7280",
                }}
                onClick={() =>
                  setForgotStep(2)
                }
              >
                Back
              </button>
            </form>
          )}
        {/* ================= MODE SWITCHES ================= */}

        {mode === "login" && (
          <p className="auth-switch">
            Don't have an account?

            <span
              onClick={() => {
                resetPage();
                setMode("register");
              }}
            >
              Register
            </span>
          </p>
        )}

        {mode === "register" && (
          <p className="auth-switch">
            Already have an account?

            <span
              onClick={() => {
                resetPage();
                setMode("login");
              }}
            >
              Login
            </span>
          </p>
        )}

        {mode === "forgot" && (
          <p className="auth-switch">
            Back to

            <span
              onClick={() => {
                resetPage();
                setMode("login");
              }}
            >
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  </div>
</>
);
};

export default AuthPage;