
import React from "react";
import { ShieldCheck, LockKeyhole, UserCheck, Database, Mail } from "lucide-react";

import "./PrivacyPolicy.scss";
import HeaderSection from "../sections/HomePage/HeaderSection/HeaderSection";
import MainFooter from "../components/website/MainFooter/MainFooter";

const PrivacyPolicy = () => {
  return (
    <>
      <HeaderSection />

      <main className="privacy-page">
        <section className="privacy-hero">
          <div className="privacy-hero__content">
            <div className="privacy-hero__badge">
              <ShieldCheck size={16} />
              <span>YOUR PRIVACY MATTERS</span>
            </div>

            <h1>
              Privacy <span>Policy</span>
            </h1>

            <p>
              Your trust matters to us. Learn how TrimTokyo collects,
              uses, and protects your personal information.
            </p>

            <span className="privacy-hero__updated">
              Last updated: October 28, 2026
            </span>
          </div>
        </section>

        <section className="privacy-content">
          <div className="privacy-content__layout">
            <aside className="privacy-sidebar">
              <h3>On this page</h3>

              <a href="#introduction">Introduction</a>
              <a href="#information">Information We Collect</a>
              <a href="#usage">How We Use Information</a>
              <a href="#sharing">Information Sharing</a>
              <a href="#security">Data Security</a>
              <a href="#rights">Your Privacy Rights</a>
              <a href="#cookies">Cookies</a>
              <a href="#contact">Contact Us</a>
            </aside>

            <div className="privacy-document">
              <section
                className="privacy-section"
                id="introduction"
              >
                <div className="privacy-section__heading">
                  <ShieldCheck size={22} />
                  <h2>1. Introduction</h2>
                </div>

                <p>
                  Welcome to TrimTokyo. This Privacy Policy explains
                  how we collect, use, store, and protect information
                  when you use our website, mobile application, and
                  related services.
                </p>

                <p>
                  By using our services, you acknowledge that your
                  information may be processed as described in this
                  policy, subject to applicable laws.
                </p>
              </section>

              <section
                className="privacy-section"
                id="information"
              >
                <div className="privacy-section__heading">
                  <Database size={22} />
                  <h2>2. Information We Collect</h2>
                </div>

                <p>Depending on how you use TrimTokyo, we may collect:</p>

                <ul>
                  <li>
                    <strong>Personal information:</strong> Name,
                    phone number, email address, and profile details
                    you provide.
                  </li>
                  <li>
                    <strong>Booking information:</strong> Appointment
                    details, selected services, shop preferences,
                    and booking history.
                  </li>
                  <li>
                    <strong>Transaction information:</strong> Order
                    details, payment status, invoices, and relevant
                    transaction records.
                  </li>
                  <li>
                    <strong>Referral and rewards information:</strong>
                    Referral codes, referral activity, and eligible
                    loyalty or reward points.
                  </li>
                  <li>
                    <strong>Technical information:</strong> Device,
                    browser, log, and usage information where
                    collected through our services.
                  </li>
                </ul>
              </section>

              <section
                className="privacy-section"
                id="usage"
              >
                <div className="privacy-section__heading">
                  <UserCheck size={22} />
                  <h2>3. How We Use Your Information</h2>
                </div>

                <p>We may use collected information to:</p>

                <ul>
                  <li>Create and manage your account.</li>
                  <li>Process bookings, orders, and payments.</li>
                  <li>Provide customer support and respond to inquiries.</li>
                  <li>Manage referrals, rewards, and eligible discounts.</li>
                  <li>Send important service updates and notifications.</li>
                  <li>Improve our website, app, and customer experience.</li>
                  <li>Detect fraud, maintain security, and meet legal obligations.</li>
                </ul>
              </section>

              <section
                className="privacy-section"
                id="sharing"
              >
                <div className="privacy-section__heading">
                  <LockKeyhole size={22} />
                  <h2>4. Information Sharing</h2>
                </div>

                <p>
                  We do not sell personal information as part of our
                  ordinary business practices. We may share relevant
                  information with service providers and business
                  partners when necessary to operate our services.
                </p>

                <p>
                  Information may also be disclosed when required by
                  law, to protect users and our services, or in
                  connection with a legitimate business transaction.
                  We aim to limit disclosures to what is reasonably
                  necessary.
                </p>
              </section>

              <section
                className="privacy-section"
                id="security"
              >
                <div className="privacy-section__heading">
                  <ShieldCheck size={22} />
                  <h2>5. Data Security and Retention</h2>
                </div>

                <p>
                  We use reasonable technical and organizational
                  measures intended to protect personal information
                  from unauthorized access, alteration, disclosure,
                  or destruction.
                </p>

                <p>
                  We retain information for as long as reasonably
                  necessary to provide our services, fulfill the
                  purposes described in this policy, resolve
                  disputes, and comply with applicable legal
                  requirements.
                </p>

                <p>
                  No method of electronic storage or transmission
                  can be guaranteed to be completely secure.
                </p>
              </section>

              <section
                className="privacy-section"
                id="rights"
              >
                <div className="privacy-section__heading">
                  <UserCheck size={22} />
                  <h2>6. Your Privacy Rights</h2>
                </div>

                <p>
                  Depending on applicable law, you may have the right
                  to request access to, correction of, or deletion of
                  your personal information, and to exercise other
                  rights available to you.
                </p>

                <p>
                  You may also be able to update account information
                  through your profile settings. Some information may
                  need to be retained where required by law or for
                  legitimate business purposes.
                </p>
              </section>

              <section
                className="privacy-section"
                id="cookies"
              >
                <div className="privacy-section__heading">
                  <Database size={22} />
                  <h2>7. Cookies and Similar Technologies</h2>
                </div>

                <p>
                  Our website may use cookies and similar technologies
                  to support essential functionality, remember
                  preferences, improve performance, and understand
                  service usage where applicable.
                </p>

                <p>
                  You can manage cookies through your browser
                  settings. Disabling certain cookies may affect
                  some website features.
                </p>
              </section>

              <section className="privacy-section" id="contact">
                <div className="privacy-section__heading">
                  <Mail size={22} />
                  <h2>8. Contact Us</h2>
                </div>

                <p>
                  If you have questions about this Privacy Policy or
                  want to make a privacy-related request, please
                  contact the TrimTokyo team through our Help page.
                </p>

                <a
                  className="privacy-contact-link"
                  href="/help"
                >
                  Contact Support
                  <Mail size={16} />
                </a>
              </section>

              <div className="privacy-notice">
                <LockKeyhole size={19} />
                <p>
                  We may update this Privacy Policy from time to time.
                  Any updated version will be published on this page
                  with a revised update date.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MainFooter />
    </>
  );
};

export default PrivacyPolicy;
