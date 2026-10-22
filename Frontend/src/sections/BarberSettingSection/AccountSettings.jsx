
import { useState } from "react";
import { LockKeyhole, Phone, Eye, EyeOff } from "lucide-react";
import api from "../../services/api";
import "./AccountSettings.scss";

const AccountSettings = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [phoneForm, setPhoneForm] = useState({
    phone: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  const [phoneMessage, setPhoneMessage] = useState({
    type: "",
    text: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordMessage({ type: "", text: "" });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setPhoneForm({ phone: value });
    setPhoneMessage({ type: "", text: "" });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } =
      passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "New password must contain at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordMessage({
        type: "error",
        text: "Your new password must differ from your current password.",
      });
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordMessage({ type: "", text: "" });

      // Replace with your actual backend endpoint if different.
      const res = await api.patch(
        "/api/v1/auth/change-password",
        {
          currentPassword,
          newPassword,
        }
      );

      setPasswordMessage({
        type: "success",
        text: res.data?.message || "Password changed successfully.",
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Unable to change password. Please try again.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(phoneForm.phone)) {
      setPhoneMessage({
        type: "error",
        text: "Enter a valid 10-digit Indian mobile number.",
      });
      return;
    }

    try {
      setPhoneLoading(true);
      setPhoneMessage({ type: "", text: "" });

      // Replace with your actual backend endpoint if different.
      const res = await api.patch(
        "/api/v1/auth/change-phone",
        {
          phone: phoneForm.phone,
        }
      );

      setPhoneMessage({
        type: "success",
        text: res.data?.message || "Phone number updated successfully.",
      });

      setPhoneForm({ phone: "" });
    } catch (err) {
      setPhoneMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Unable to update phone number. Please try again.",
      });
    } finally {
      setPhoneLoading(false);
    }
  };

  const renderPasswordField = (name, label, visibilityKey, placeholder) => (
    <div className="account-form-group" key={name}>
      <label htmlFor={name}>{label}</label>

      <div className="account-input-wrapper">
        <input
          id={name}
          type={showPasswords[visibilityKey] ? "text" : "password"}
          name={name}
          value={passwordForm[name]}
          onChange={handlePasswordChange}
          placeholder={placeholder}
          autoComplete={
            name === "currentPassword"
              ? "current-password"
              : "new-password"
          }
          required
        />

        <button
          type="button"
          className="account-password-toggle"
          onClick={() => togglePasswordVisibility(visibilityKey)}
          aria-label={
            showPasswords[visibilityKey]
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
        >
          {showPasswords[visibilityKey] ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <section className="account-settings">
      <div className="account-settings-header">
        <h3>Account & Security</h3>
        <p>Update your password and registered mobile number.</p>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="account-settings-card">
        <div className="account-card-header">
          <div className="account-card-icon">
            <LockKeyhole size={20} />
          </div>

          <div>
            <h4>Change Password</h4>
            <p>Choose a strong password to protect your account.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit}>
          {renderPasswordField(
            "currentPassword",
            "Current Password",
            "current",
            "Enter current password"
          )}

          {renderPasswordField(
            "newPassword",
            "New Password",
            "new",
            "Enter new password"
          )}

          {renderPasswordField(
            "confirmPassword",
            "Confirm New Password",
            "confirm",
            "Re-enter new password"
          )}

          {passwordMessage.text && (
            <div
              className={`account-message ${passwordMessage.type}`}
              role="status"
            >
              {passwordMessage.text}
            </div>
          )}

          <button
            type="submit"
            className="account-submit-btn"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* CHANGE PHONE NUMBER */}
      <div className="account-settings-card">
        <div className="account-card-header">
          <div className="account-card-icon">
            <Phone size={20} />
          </div>

          <div>
            <h4>Change Phone Number</h4>
            <p>Update the mobile number associated with your account.</p>
          </div>
        </div>

        <form onSubmit={handlePhoneSubmit}>
          <div className="account-form-group">
            <label htmlFor="account-phone">New Phone Number</label>

            <div className="account-phone-input">
              <span>+91</span>

              <input
                id="account-phone"
                type="tel"
                inputMode="numeric"
                value={phoneForm.phone}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                autoComplete="tel-national"
                required
              />
            </div>

            <small>
              Use a valid 10-digit Indian mobile number.
            </small>
          </div>

          {phoneMessage.text && (
            <div
              className={`account-message ${phoneMessage.type}`}
              role="status"
            >
              {phoneMessage.text}
            </div>
          )}

          <button
            type="submit"
            className="account-submit-btn"
            disabled={phoneLoading}
          >
            {phoneLoading ? "Updating..." : "Update Phone Number"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AccountSettings;
