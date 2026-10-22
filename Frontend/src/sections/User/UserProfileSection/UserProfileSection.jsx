import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  UsersRound,
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import useUserProfile from "../../../hooks/user/useUserProfile";
import "./UserProfileSection.scss";

const UserProfileSection = () => {
  const {
    profile,
    updateField,
    loading,
    saving,
    error,
    successMessage,
    fetchProfile,
    saveProfile,
  } = useUserProfile();

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    updateField(name, value);

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateProfile = () => {
    const nextErrors = {};

    if (
      profile.gender &&
      !["male", "female", "other"].includes(profile.gender)
    ) {
      nextErrors.gender = "Select a valid gender.";
    }

    if (profile.age !== "") {
      const age = Number(profile.age);

      if (!Number.isInteger(age) || age < 0) {
        nextErrors.age = "Enter a valid non-negative whole number.";
      }
    }

    if (profile.address.length > 500) {
      nextErrors.address = "Address cannot exceed 500 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateProfile() || saving) return;

    try {
      await saveProfile();
    } catch {
      // The hook exposes the API error through its error state.
    }
  };

  if (loading) {
    return (
      <section className="user-profile">
        <div className="user-profile__state">
          <LoaderCircle className="user-profile__spinner" size={28} />
          <p>Loading your profile...</p>
        </div>
      </section>
    );
  }

  if (error && !profile.name && !profile.phone) {
    return (
      <section className="user-profile">
        <div className="user-profile__state user-profile__state--error">
          <AlertCircle size={28} />
          <h2>Unable to load your profile</h2>
          <p>{error}</p>

          <button
            type="button"
            className="user-profile__save-button"
            onClick={fetchProfile}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="user-profile">
      <div className="user-profile__header">
        <div>
          <span className="user-profile__eyebrow">
            ACCOUNT MANAGEMENT
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and contact details.
          </p>
        </div>

        <div className="user-profile__header-icon">
          <UserRound size={27} />
        </div>
      </div>

      <form
        className="user-profile__form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="user-profile__card">
          <div className="user-profile__card-heading">
            <div className="user-profile__section-icon">
              <UserRound size={19} />
            </div>

            <div>
              <h2>Personal Information</h2>
              <p>
                Your account details and personal preferences.
              </p>
            </div>
          </div>

          {error && (
            <div
              className="user-profile__message user-profile__message--error"
              role="alert"
            >
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div
              className="user-profile__message user-profile__message--success"
              role="status"
            >
              <CheckCircle2 size={17} />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="user-profile__fields">
            <div className="user-profile__field">
              <label htmlFor="profile-name">Full Name</label>

              <div className="user-profile__input-wrap user-profile__input-wrap--readonly">
                <UserRound size={17} />

                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  value={profile.name}
                  autoComplete="name"
                  readOnly
                  aria-readonly="true"
                />
              </div>

              <small className="user-profile__hint">
                Contact support if you need to change your name.
              </small>
            </div>

            <div className="user-profile__field">
              <label htmlFor="profile-email">Email Address</label>

              <div className="user-profile__input-wrap user-profile__input-wrap--readonly">
                <Mail size={17} />

                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  value={profile.email}
                  autoComplete="email"
                  readOnly
                  aria-readonly="true"
                />
              </div>
            </div>

            <div className="user-profile__field">
              <label htmlFor="profile-phone">Phone Number</label>

              <div className="user-profile__input-wrap user-profile__input-wrap--readonly">
                <Phone size={17} />

                <input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  autoComplete="tel"
                  readOnly
                  aria-readonly="true"
                />
              </div>
            </div>

            <div className="user-profile__field">
              <label htmlFor="profile-gender">Gender</label>

              <div className="user-profile__input-wrap">
                <UsersRound size={17} />

                <select
                  id="profile-gender"
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {errors.gender && (
                <small className="user-profile__error">
                  {errors.gender}
                </small>
              )}
            </div>

            <div className="user-profile__field">
              <label htmlFor="profile-age">Age</label>

              <div className="user-profile__input-wrap">
                <CalendarDays size={17} />

                <input
                  id="profile-age"
                  name="age"
                  type="number"
                  placeholder="Enter your age"
                  value={profile.age}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  disabled={saving}
                />
              </div>

              {errors.age && (
                <small className="user-profile__error">
                  {errors.age}
                </small>
              )}
            </div>

            <div className="user-profile__field user-profile__field--full">
              <label htmlFor="profile-address">Address</label>

              <div className="user-profile__input-wrap user-profile__input-wrap--textarea">
                <MapPin size={17} />

                <textarea
                  id="profile-address"
                  name="address"
                  placeholder="Enter your residential address"
                  value={profile.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  rows={4}
                  maxLength={500}
                  disabled={saving}
                />
              </div>

              <div className="user-profile__field-footer">
                {errors.address ? (
                  <small className="user-profile__error">
                    {errors.address}
                  </small>
                ) : (
                  <span />
                )}

                <small className="user-profile__character-count">
                  {profile.address.length}/500
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="user-profile__actions">
          <p>
            You can update your gender, age, and address here.
          </p>

          <button
            type="submit"
            className="user-profile__save-button"
            disabled={saving}
          >
            {saving ? (
              <>
                <LoaderCircle
                  className="user-profile__spinner"
                  size={17}
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default UserProfileSection;
