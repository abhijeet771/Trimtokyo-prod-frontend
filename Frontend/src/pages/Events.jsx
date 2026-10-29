import React, { useState } from "react";
import {  Users,  CalendarCheck,  Headset,  CalendarDays,  MapPin,Phone,  FileText,  ArrowRight,} from "lucide-react";

import "./Events.scss";
import HeaderSection from "../sections/HomePage/HeaderSection/HeaderSection";
import MainFooter from "../components/website/MainFooter/MainFooter";
import useGuestEventRequest from "../hooks/website/useGuestEventRequest.js";

const Event = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    totalMembers: "",
    description: "",
    address: "",
    phone: "",
  });

  const { loading, error, success, submitEventRequest, resetStatus, } = useGuestEventRequest();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, }));
    if (error || success) { resetStatus(); }
  };

  const handleSubmit = async (e) => { e.preventDefault(); resetStatus();

    try { await submitEventRequest(formData);
      setFormData({ eventName: "", totalMembers: "", description: "", address: "", phone: "",
      });
    } catch {}
  };
  return (
    <>
      <HeaderSection />
      <main className="event-page">
        <div className="event-page__container">
          <section className="event-hero">
            <div className="event-hero__brand">TRIMTOKYO</div>

            <span className="event-hero__badge">
              EVENT BOOKING
            </span>

            <h1>
              Make Your
              <br />
              <span>Event Special</span>
            </h1>

            <p className="event-hero__description">
              Planning a groom event, office session, or group
              booking? Tell us about your event and we'll help you
              make it a memorable experience with TrimTokyo.
            </p>

            <div className="event-features">
              <div className="event-features__item">
                <div className="event-features__icon">
                  <Users size={31} />
                </div>

                <div>
                  <h3>Group Bookings</h3>
                  <p>
                    Perfect for corporate events, weddings,
                    parties, and more.
                  </p>
                </div>
              </div>

              <div className="event-features__item">
                <div className="event-features__icon">
                  <CalendarCheck size={31} />
                </div>

                <div>
                  <h3>Customized Experience</h3>
                  <p>
                    We'll help you plan the right services
                    for your event.
                  </p>
                </div>
              </div>

              <div className="event-features__item">
                <div className="event-features__icon">
                  <Headset size={31} />
                </div>

                <div>
                  <h3>Dedicated Support</h3>
                  <p>
                    Our team will get in touch with you
                    after receiving your details.
                  </p>
                </div>
              </div>
            </div>

            <div className="event-hero__decoration" aria-hidden="true">
              <div className="event-hero__calendar">
                <div className="event-hero__calendar-top">
                  <span />
                  <span />
                </div>

                <div className="event-hero__calendar-grid">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <span key={index} />
                  ))}
                </div>

                <div className="event-hero__check">
                  <CalendarCheck size={43} />
                </div>
              </div>
            </div>
          </section>

          <section className="event-form-section">
            <div className="event-form-section__card">
              <div className="event-form-section__heading">
                <h2>Event Enquiry</h2>
                <p>
                  Fill out the form below and our team will get
                  back to you with the next steps.
                </p>
              </div>

              <form className="event-form" onSubmit={handleSubmit}>
                <div className="event-form__field">
                  <label htmlFor="eventName">Name of Event</label>

                  <div className="event-form__input-wrap">
                    <CalendarDays size={19} />

                    <input
                      id="eventName"
                      type="text"
                      name="eventName"
                      placeholder="Enter event name"
                      value={formData.eventName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="event-form__field">
                  <label htmlFor="totalMembers">
                    Total Members Involved
                  </label>

                  <div className="event-form__input-wrap">
                    <Users size={19} />

                    <input
                      id="totalMembers"
                      type="number"
                      name="totalMembers"
                      min="1"
                      step="1"
                      placeholder="Enter total number of members"
                      value={formData.totalMembers}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="event-form__field">
                  <label htmlFor="description">
                    Description <span>(Optional)</span>
                  </label>

                  <div className="event-form__input-wrap event-form__input-wrap--textarea">
                    <FileText size={19} />

                    <textarea id="description" name="description"
                      rows={3} placeholder="Tell us more about your event"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="event-form__field">
                  <label htmlFor="address">Address</label>

                  <div className="event-form__input-wrap">
                    <MapPin size={19} />

                    <input
                      id="address"
                      type="text"
                      name="address"
                      placeholder="Enter event location / address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="event-form__field">
                  <label htmlFor="phone">Phone Number</label>

                  <div className="event-form__input-wrap">
                    <Phone size={19} />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="event-form__error" role="alert">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="event-form__success" role="status">
                    {success}
                  </p>
                )}

                <button type="submit" className="event-form__submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Enquiry"}

                  {!loading && <ArrowRight size={20} />}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
      <MainFooter />
    </>
  );
};

export default Event;