
import React, { useState } from "react";
import {
  Store,
  UserRound,
  Phone,
  Mail,
  MapPin,
  MapPinned,
  FileText,
  ArrowRight,
  ShieldCheck,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import "./BarberApplicationSection.scss";

const initialForm = {
  ownerName: "",
  shopName: "",
  phone: "",
  email: "",
  city: "",
  shopAddress: "",
  shopDescription: "",
};

const BarberApplicationSection = ({ onSubmit }) => {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!onSubmit) {
      setError(
        "Application submission is not connected yet. Please try again later."
      );
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
      setFormData(initialForm);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to submit your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="barber-application"
      id="barber-application"
    >
      <div className="barber-application__container">
        {/* Section heading */}
        <div className="barber-application__heading">
          <span className="barber-application__eyebrow">
            <span className="barber-application__eyebrow-icon">
              <Store size={16} />
            </span>
            LET'S GROW TOGETHER
          </span>

          <h2>
            Ready to Join <span>TrimTokyo?</span>
          </h2>

          <p>
            Tell us about yourself and your barbershop. Our team will
            review your application and get in touch with you.
          </p>
        </div>

        <div className="barber-application__layout">
          {/* Left information panel */}
          <aside className="barber-application__info">
            <div className="barber-application__info-top">
              <span className="barber-application__info-icon">
                <Store size={26} />
              </span>

              <span className="barber-application__info-label">
                PARTNER WITH US
              </span>
            </div>

            <h3>
              Let's put your
              <br />
              shop on the map.
            </h3>

            <p className="barber-application__info-description">
              Join a platform built to simplify salon operations,
              connect your team, and help you manage your business
              in one place.
            </p>

            <div className="barber-application__benefits">
              <div className="barber-application__benefit">
                <span>
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <strong>One place for your business</strong>
                  <p>Shop, staff, expenses, and orders.</p>
                </div>
              </div>

              <div className="barber-application__benefit">
                <span>
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <strong>Simple onboarding</strong>
                  <p>Share your details to get started.</p>
                </div>
              </div>

              <div className="barber-application__benefit">
                <span>
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <strong>Personalized assistance</strong>
                  <p>Connect with our partner support team.</p>
                </div>
              </div>
            </div>

            <div className="barber-application__info-footer">
              <div>
                <Clock3 size={17} />
                <span>Application review</span>
              </div>

              <div>
                <ShieldCheck size={17} />
                <span>Your details stay protected</span>
              </div>
            </div>

            <div
              className="barber-application__decoration"
              aria-hidden="true"
            >
              <Store size={150} strokeWidth={0.6} />
            </div>
          </aside>

          {/* Application form */}
          <div className="barber-application__form-panel">
            <div className="barber-application__form-heading">
              <div>
                <span>BARBER PARTNER APPLICATION</span>
                <h3>Tell us about your shop</h3>
                <p>
                  Fill in the details below to submit your interest.
                </p>
              </div>

              <div className="barber-application__form-icon">
                <FileText size={24} />
              </div>
            </div>

            <form
              className="barber-application__form"
              onSubmit={handleSubmit}
            >
              <div className="barber-application__fields">
                <div className="barber-application__field">
                  <label htmlFor="barber-owner-name">
                    Owner's Full Name <span>*</span>
                  </label>

                  <div className="barber-application__input-wrap">
                    <UserRound size={18} />

                    <input
                      id="barber-owner-name"
                      name="ownerName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.ownerName}
                      onChange={handleChange}
                      autoComplete="name"
                      maxLength={100}
                      required
                    />
                  </div>
                </div>

                <div className="barber-application__field">
                  <label htmlFor="barber-shop-name">
                    Shop Name <span>*</span>
                  </label>

                  <div className="barber-application__input-wrap">
                    <Store size={18} />

                    <input
                      id="barber-shop-name"
                      name="shopName"
                      type="text"
                      placeholder="Enter your shop name"
                      value={formData.shopName}
                      onChange={handleChange}
                      maxLength={120}
                      required
                    />
                  </div>
                </div>

                <div className="barber-application__field">
                  <label htmlFor="barber-phone">
                    Mobile Number <span>*</span>
                  </label>

                  <div className="barber-application__input-wrap">
                    <Phone size={18} />

                    <input
                      id="barber-phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel-national"
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      title="Enter a valid 10-digit Indian mobile number"
                      required
                    />
                  </div>
                </div>

                <div className="barber-application__field">
                  <label htmlFor="barber-email">
                    Email Address <span>*</span>
                  </label>

                  <div className="barber-application__input-wrap">
                    <Mail size={18} />

                    <input
                      id="barber-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      maxLength={150}
                      required
                    />
                  </div>
                </div>

                <div className="barber-application__field">
                  <label htmlFor="barber-city">
                    City <span>*</span>
                  </label>

                  <div className="barber-application__input-wrap">
                    <MapPin size={18} />

                    <input
                      id="barber-city"
                      name="city"
                      type="text"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleChange}
                      autoComplete="address-level2"
                      maxLength={100}
                      required
                    />
                  </div>
                </div>

                <div className="barber-application__field">
                  <label htmlFor="barber-address">
                    Shop Address <span>*</span>
                  </label>

                  <div className="barber-application__input-wrap">
                    <MapPinned size={18} />

                    <input
                      id="barber-address"
                      name="shopAddress"
                      type="text"
                      placeholder="Enter your shop address"
                      value={formData.shopAddress}
                      onChange={handleChange}
                      autoComplete="street-address"
                      maxLength={250}
                      required
                    />
                  </div>
                </div>

                <div className="barber-application__field barber-application__field--full">
                  <label htmlFor="barber-description">
                    Tell Us About Your Shop
                    <span className="barber-application__optional">
                      Optional
                    </span>
                  </label>

                  <textarea
                    id="barber-description"
                    name="shopDescription"
                    placeholder="Tell us about your shop, team size, services, or anything else you'd like us to know..."
                    value={formData.shopDescription}
                    onChange={handleChange}
                    rows={4}
                    maxLength={1000}
                  />

                  <span className="barber-application__character-count">
                    {formData.shopDescription.length}/1000
                  </span>
                </div>
              </div>

              {error && (
                <p
                  className="barber-application__error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                className="barber-application__submit"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting Application..."
                  : "Submit Partner Application"}

                {!submitting && <ArrowRight size={19} />}
              </button>

              <p className="barber-application__privacy">
                <ShieldCheck size={16} />
                Your information will be used to process your
                partner application.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BarberApplicationSection;
