
import React, { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  ArrowRight,
} from "lucide-react";

import "./Help.scss";
import HeaderSection from "../sections/HomePage/HeaderSection/HeaderSection";
import MainFooter from "../components/website/MainFooter/MainFooter";

const Help = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Help form data:", formData);

    // Connect your help/contact API here.
  };

  return (
    <>
      <HeaderSection />

      <main className="help-page">
        <section className="help-hero">
          <span className="help-hero__badge">HELP CENTER</span>

          <h1>
            We're Here to <span>Help</span>
          </h1>

          <p>
            Have a question or need support? Send us a message
            and our team will get back to you.
          </p>
        </section>

        <section className="help-contact">
          <div className="help-contact__card">
            <div className="help-contact__heading">
              <h2>Get in Touch</h2>
              <p>
                We'd love to hear from you. Fill out the form below.
              </p>
            </div>

            <form
              className="help-form"
              onSubmit={handleSubmit}
            >
              <div className="help-form__field">
                <label htmlFor="help-name">Full Name</label>

                <div className="help-form__input-wrap">
                  <UserRound size={19} />

                  <input
                    id="help-name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="help-form__field">
                <label htmlFor="help-email">Email Address</label>

                <div className="help-form__input-wrap">
                  <Mail size={19} />

                  <input
                    id="help-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="help-form__field">
                <label htmlFor="help-phone">Phone Number</label>

                <div className="help-form__input-wrap">
                  <Phone size={19} />

                  <input
                    id="help-phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="help-form__field">
                <label htmlFor="help-title">Title</label>

                <div className="help-form__input-wrap">
                  <FileText size={19} />

                  <input
                    id="help-title"
                    type="text"
                    name="title"
                    placeholder="Enter the subject"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="help-form__field help-form__field--full">
                <label htmlFor="help-message">Message</label>

                <div className="help-form__input-wrap help-form__input-wrap--textarea">
                  <MessageSquare size={19} />

                  <textarea
                    id="help-message"
                    name="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                className="help-form__submit"
                type="submit"
              >
                Send Message
                <ArrowRight size={19} />
              </button>
            </form>
          </div>
        </section>
      </main>

      <MainFooter />
    </>
  );
};

export default Help;
