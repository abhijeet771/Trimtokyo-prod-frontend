
import React from "react";
import {
  FileText,
  UserCheck,
  CalendarCheck,
  CreditCard,
  Ban,
  ShieldCheck,
  RefreshCw,
  Mail,
} from "lucide-react";

import "./Terms.scss";
import HeaderSection from "../sections/HomePage/HeaderSection/HeaderSection";
import MainFooter from "../components/website/MainFooter/MainFooter";

const Terms = () => {
  return (
    <>
      <HeaderSection />

      <main className="terms-page">
        <section className="terms-hero">
          <div className="terms-hero__content">
            <div className="terms-hero__badge">
              <FileText size={16} />
              <span>TERMS & CONDITIONS</span>
            </div>

            <h1>
              Terms of <span>Service</span>
            </h1>

            <p>
              Please read these terms carefully before using
              TrimTokyo's website, mobile application, and services.
            </p>

            <span className="terms-hero__updated">
              Last updated: October 28, 2026
            </span>
          </div>
        </section>

        <section className="terms-content">
          <div className="terms-content__layout">
            <aside className="terms-sidebar">
              <h3>On this page</h3>

              <a href="#acceptance">Acceptance of Terms</a>
              <a href="#services">Our Services</a>
              <a href="#accounts">User Accounts</a>
              <a href="#bookings">Bookings and Cancellations</a>
              <a href="#payments">Payments and Pricing</a>
              <a href="#conduct">User Responsibilities</a>
              <a href="#referrals">Referral Programs</a>
              <a href="#liability">Limitation of Liability</a>
              <a href="#changes">Changes to Terms</a>
              <a href="#contact">Contact Us</a>
            </aside>

            <div className="terms-document">
              <section className="terms-section" id="acceptance">
                <div className="terms-section__heading">
                  <FileText size={22} />
                  <h2>1. Acceptance of Terms</h2>
                </div>

                <p>
                  Welcome to TrimTokyo. These Terms of Service govern
                  your access to and use of our website, mobile
                  application, booking features, and related services.
                </p>

                <p>
                  By accessing or using our services, you agree to
                  these terms and any applicable policies referenced
                  here. If you do not agree, please discontinue use
                  of the services.
                </p>
              </section>

              <section className="terms-section" id="services">
                <div className="terms-section__heading">
                  <CalendarCheck size={22} />
                  <h2>2. Our Services</h2>
                </div>

                <p>
                  TrimTokyo provides digital features that may help
                  users discover participating salons and barbers,
                  explore services, make bookings, manage orders,
                  and access available offers.
                </p>

                <p>
                  Service availability, participating businesses,
                  prices, and features may vary by location and may
                  change over time.
                </p>
              </section>

              <section className="terms-section" id="accounts">
                <div className="terms-section__heading">
                  <UserCheck size={22} />
                  <h2>3. User Accounts</h2>
                </div>

                <p>
                  You are responsible for providing accurate
                  information when creating or updating your account
                  and for maintaining the security of your login
                  credentials.
                </p>

                <ul>
                  <li>
                    Keep your account information current and accurate.
                  </li>
                  <li>
                    Do not impersonate another person or misuse another
                    user's account.
                  </li>
                  <li>
                    Notify us if you suspect unauthorized access to
                    your account.
                  </li>
                </ul>
              </section>

              <section className="terms-section" id="bookings">
                <div className="terms-section__heading">
                  <CalendarCheck size={22} />
                  <h2>4. Bookings and Cancellations</h2>
                </div>

                <p>
                  When making a booking, you are responsible for
                  reviewing the selected service, participating
                  business, appointment time, and any displayed
                  booking conditions.
                </p>

                <p>
                  Bookings are subject to availability and confirmation.
                  Cancellation, rescheduling, late-arrival, and
                  no-show policies may vary by participating business.
                  Please review the applicable conditions before
                  confirming your booking.
                </p>

                <p>
                  If a booking needs to be changed or cancelled,
                  please use the available booking controls or contact
                  the relevant business or TrimTokyo support.
                </p>
              </section>

              <section className="terms-section" id="payments">
                <div className="terms-section__heading">
                  <CreditCard size={22} />
                  <h2>5. Payments and Pricing</h2>
                </div>

                <p>
                  Prices, fees, taxes, and payment methods applicable
                  to a service or order will be displayed where
                  available before confirmation.
                </p>

                <p>
                  Payments may be processed by third-party payment
                  providers. Their terms and privacy policies may
                  apply to the processing of your payment information.
                </p>

                <p>
                  Refunds, adjustments, and payment disputes are
                  handled according to the applicable service
                  conditions and relevant law.
                </p>
              </section>

              <section className="terms-section" id="conduct">
                <div className="terms-section__heading">
                  <ShieldCheck size={22} />
                  <h2>6. User Responsibilities</h2>
                </div>

                <p>
                  You agree to use TrimTokyo lawfully and respectfully.
                  You must not:
                </p>

                <ul>
                  <li>
                    Use the platform for fraudulent, unlawful, or
                    misleading activities.
                  </li>
                  <li>
                    Submit false information or manipulate bookings,
                    payments, reviews, or rewards.
                  </li>
                  <li>
                    Attempt to disrupt, damage, or gain unauthorized
                    access to our systems.
                  </li>
                  <li>
                    Abuse promotions, referral benefits, or other
                    platform features.
                  </li>
                </ul>
              </section>

              <section className="terms-section" id="referrals">
                <div className="terms-section__heading">
                  <RefreshCw size={22} />
                  <h2>7. Referrals and Promotions</h2>
                </div>

                <p>
                  TrimTokyo may offer referral programs, discounts,
                  loyalty points, and promotional benefits subject
                  to specific eligibility requirements.
                </p>

                <p>
                  Offers may have limits, expiry dates, and additional
                  conditions. Referral rewards may be subject to
                  verification and approval. Fraudulent, duplicate,
                  or otherwise ineligible activity may result in
                  rewards being withheld or cancelled, subject to
                  applicable law.
                </p>

                <p>
                  Please review the conditions displayed for each
                  promotion before participating.
                </p>
              </section>

              <section className="terms-section" id="liability">
                <div className="terms-section__heading">
                  <Ban size={22} />
                  <h2>8. Limitation of Liability</h2>
                </div>

                <p>
                  To the extent permitted by applicable law, TrimTokyo
                  is not responsible for interruptions caused by
                  circumstances outside our reasonable control,
                  unauthorized use resulting from your failure to
                  protect your account, or the independent acts of
                  third parties.
                </p>

                <p>
                  Services may occasionally be unavailable for
                  maintenance, technical issues, or other operational
                  reasons. Nothing in these terms excludes or limits
                  liability that cannot legally be excluded or
                  limited.
                </p>
              </section>

              <section className="terms-section" id="changes">
                <div className="terms-section__heading">
                  <RefreshCw size={22} />
                  <h2>9. Changes to These Terms</h2>
                </div>

                <p>
                  We may update these terms to reflect changes to our
                  services, business practices, or legal obligations.
                  The updated version will be published on this page
                  with a revised date.
                </p>

                <p>
                  Where required by law, we will provide notice of
                  material changes. Continued use of our services
                  after changes take effect will be subject to the
                  updated terms, as permitted by applicable law.
                </p>
              </section>

              <section className="terms-section" id="contact">
                <div className="terms-section__heading">
                  <Mail size={22} />
                  <h2>10. Contact Us</h2>
                </div>

                <p>
                  If you have questions about these Terms of Service,
                  please contact the TrimTokyo team through our
                  Help page.
                </p>

                <a className="terms-contact-link" href="/help">
                  Contact Support
                  <Mail size={16} />
                </a>
              </section>

              <div className="terms-notice">
                <ShieldCheck size={19} />
                <p>
                  These terms should be reviewed against TrimTokyo's
                  actual operating practices and applicable laws
                  before publication.
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

export default Terms;
