
import React from "react";
import {
  Users,
  Gift,
  ArrowRight,
  Share2,
  BadgePercent,
} from "lucide-react";

import "./ReferralProgram.scss";
import HeaderSection from "../sections/HomePage/HeaderSection/HeaderSection";
import MainFooter from "../components/website/MainFooter/MainFooter";

const ReferralProgram = () => {
  return (
    <>
      <HeaderSection />

      <main className="referral-program">
        <div className="referral-program__container">
          <div className="referral-program__content">
            <span className="referral-program__eyebrow">
              TRIMTOKYO REFERRAL PROGRAM
            </span>

            <h1 className="referral-program__title">
              Refer 2 People
              <br />
              <span>Get Up to 10% Off</span>
            </h1>

            <p className="referral-program__description">
              Share the love! Invite two people to TrimTokyo and
              get up to 10% discount on your next order.
            </p>

            <div className="referral-program__steps">
              <div className="referral-program__step">
                <div className="referral-program__step-icon">
                  <Share2 size={23} />
                </div>

                <span className="referral-program__step-number">
                  STEP 01
                </span>

                <h3>Refer 2 People</h3>

                <p>
                  Share your referral link with two friends.
                </p>
              </div>

              <div className="referral-program__step-arrow">
                <ArrowRight size={23} />
              </div>

              <div className="referral-program__step">
                <div className="referral-program__step-icon">
                  <Gift size={23} />
                </div>

                <span className="referral-program__step-number">
                  STEP 02
                </span>

                <h3>Get Your Reward</h3>

                <p>
                  Get up to 10% off your next order when both
                  referrals qualify.
                </p>
              </div>
            </div>

            <div className="referral-program__offer">
              <div className="referral-program__offer-icon">
                <BadgePercent size={27} />
              </div>

              <div className="referral-program__offer-text">
                <span>Your next order gets better</span>
                <strong>Up to 10% Discount</strong>
              </div>

              <div className="referral-program__offer-value">
                10%
              </div>
            </div>
          </div>

          <div className="referral-program__side">
            <div className="referral-program__side-card">
              <div className="referral-program__side-icon">
                <Users size={29} />
              </div>

              <span className="referral-program__side-label">
                TWO FRIENDS
              </span>

              <h2>Good things are better shared.</h2>

              <p>
                Invite your friends to discover TrimTokyo. When
                both referrals qualify, you can unlock a discount
                on your next order.
              </p>

              <div className="referral-program__side-footer">
                <span />
                <span />
                <span />
                <p>Share. Refer. Save.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </>
  );
};

export default ReferralProgram;
