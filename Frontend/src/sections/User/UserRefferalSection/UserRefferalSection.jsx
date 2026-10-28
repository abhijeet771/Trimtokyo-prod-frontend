import React, { useState } from "react";
import {  Gift,  Copy,  Check,Share2,  ShieldCheck,  Users,Clock3,  Coins,TrendingUp,} from "lucide-react";
import useUserReferral from "../../../hooks/user/useRefferal.js";
import "./UserRefferalSection.scss";

/* ==============================
        CONSTANTS
================================= */

const STATUS_LABELS = { pending: "Pending Review", approved: "Approved", declined: "Declined",};

/* ==============================
        HELPERS
================================= */

const getReferredUserName = (referral) => {
  const referredUser = referral.referredUserId;

  if (referredUser && typeof referredUser === "object") {
    return referredUser.name || "Referred User";
  }
  return "Referred User";
};

const getInitials = (name) => {
  return name.split(" ").filter(Boolean)
    .slice(0, 2).map((part) => part[0].toUpperCase()).join("");
};

const formatDate = (date) => {
  if (!date) return "—";
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric",});
};

const getRewardLabel = (referral) => {
  if (referral.status === "approved") {
    return `+${referral.rewardPoints ?? 50} pts`;
  }

  if (referral.status === "pending") {
    return `+${referral.rewardPoints ?? 50} pts (pending)`;
  }

  return "—";
};

/* ============================================================
   USER REFERRAL SECTION
============================================================ */

const UserRefferalSection = () => {
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState("");
  const { referralCode, totalPoints, totalReferrals, referrals, loading, error, fetchReferralData, } = useUserReferral();

  const approvedReferrals = referrals.filter((referral) => referral.status === "approved").length;

  /* ----------------------------------------------------------
     COPY REFERRAL CODE
  ---------------------------------------------------------- */

  const handleCopyCode = async () => {
    if (!referralCode) return;

    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setShareError("");

      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setShareError("Unable to copy the referral code.");
    }
  };

  /* ----------------------------------------------------------
     SHARE INVITATION
  ---------------------------------------------------------- */

  const handleShareInvite = async () => {
    if (!referralCode) return;

    const shareData = {
      title: "Join TrimTokyo",
      text: `Join me on TrimTokyo! Use my referral code ${referralCode}. Referrals are reviewed by our team before rewards are credited.`,
    };

    try {
      setShareError("");

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        setCopied(true);

        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setShareError("Unable to share the referral invitation.");
      }
    }
  };

  return (
    <section className="user-referral">
      {/* Page heading */}
      <header className="user-referral__header">
        <div>
          <span className="user-referral__eyebrow">
            YOUR PERSONAL GROOMING SPACE
          </span>

          <h1>Refer &amp; Earn</h1>

          <p>
            Share your code with friends and earn rewards when
            referrals are approved.
          </p>
        </div>

        <div className="user-referral__reward-badge">
          <Coins size={18} />
          <span>50 points per approved referral</span>
        </div>
      </header>

      {/* API error */}
      {error && (
        <div className="user-referral__error" role="alert">
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchReferralData}
            disabled={loading}
          >
            Retry
          </button>
        </div>
      )}

      {/* Referral hero */}
      <section className="user-referral__hero">
        <div className="user-referral__hero-main">
          <div className="user-referral__illustration">
            <div className="user-referral__gift-circle">
              <Gift size={88} strokeWidth={1.5} />
            </div>

            <span className="user-referral__spark user-referral__spark--one">
              ✦
            </span>

            <span className="user-referral__spark user-referral__spark--two">
              ✦
            </span>

            <span className="user-referral__spark user-referral__spark--three">
              ✧
            </span>
          </div>

          <div className="user-referral__hero-content">
            <h2>Good grooming is better shared</h2>

            <p>
              Invite friends to TrimTokyo. Once your referral is
              reviewed and approved, your reward can be earned.
            </p>

            <label
              className="user-referral__code-label"
              htmlFor="user-referral-code"
            >
              YOUR REFERRAL CODE
            </label>

            <div className="user-referral__code-actions">
              <div className="user-referral__code-box">
                <span id="user-referral-code">
                  {loading && !referralCode
                    ? "Loading..."
                    : referralCode || "Unavailable"}
                </span>

                <button
                  type="button"
                  className="user-referral__copy-button"
                  onClick={handleCopyCode}
                  disabled={!referralCode || loading}
                  aria-label="Copy referral code"
                  title="Copy referral code"
                >
                  {copied ? (
                    <Check size={20} />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>

              <button
                type="button"
                className="user-referral__share-button"
                onClick={handleShareInvite}
                disabled={!referralCode || loading}
              >
                <Share2 size={20} />
                <span>Share Invite</span>
              </button>
            </div>

            {copied && (
              <p className="user-referral__copy-feedback" role="status">
                Copied successfully.
              </p>
            )}

            {shareError && (
              <p role="alert">{shareError}</p>
            )}
          </div>
        </div>

        <div className="user-referral__benefits">
          <div className="user-referral__benefit">
            <span className="user-referral__benefit-icon">
              <Gift size={23} />
            </span>

            <div>
              <h3>Earn 50 points</h3>
              <p>Get 50 points for each approved referral.</p>
            </div>
          </div>

          <div className="user-referral__benefit">
            <span className="user-referral__benefit-icon">
              <ShieldCheck size={23} />
            </span>

            <div>
              <h3>Admin approval</h3>
              <p>
                Referrals are reviewed to keep things fair and
                prevent misuse.
              </p>
            </div>
          </div>

          <div className="user-referral__benefit">
            <span className="user-referral__benefit-icon">
              <Users size={23} />
            </span>

            <div>
              <h3>More rewards</h3>
              <p>
                Use your points for bookings, offers and exclusive
                perks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Total points KPI */}
      <section className="user-referral__points-card" aria-label="Referral points summary">
        <div className="user-referral__points-icon">
          <Coins size={27} />
        </div>

        <div className="user-referral__points-content">
          <span className="user-referral__points-label">
            Total Points Earned
          </span>

          <div className="user-referral__points-value">
            {Number(totalPoints || 0).toLocaleString("en-IN")}
            <span>pts</span>
          </div>

          <p>
            Earned from {approvedReferrals} approved{" "}
            {approvedReferrals === 1 ? "referral" : "referrals"}.
          </p>
        </div>

        <div className="user-referral__points-decoration">
          <TrendingUp size={21} />
          <span>Referral Rewards</span>
        </div>
      </section>

      {/* Referral history */}
      <section className="user-referral__history">
        <div className="user-referral__history-header">
          <div>
            <h2>Referral History</h2>
            <p>Track the status of your referrals and rewards.</p>
          </div>

          <span className="user-referral__history-count">
            {totalReferrals} referrals
          </span>
        </div>

        {loading && referrals.length === 0 ? (
          <div className="user-referral__empty">
            <p>Loading referral history...</p>
          </div>
        ) : (
          <>
            <div className="user-referral__table-wrapper">
              <table className="user-referral__table">
                <thead>
                  <tr>
                    <th>Friend</th>
                    <th>Date Submitted</th>
                    <th>Status</th>
                    <th>Reward</th>
                  </tr>
                </thead>

                <tbody>
                  {referrals.map((referral) => {
                    const name = getReferredUserName(referral);

                    return (
                      <tr key={referral._id}>
                        <td>
                          <div className="user-referral__friend">
                            <span className="user-referral__avatar">
                              {getInitials(name) || "U"}
                            </span>

                            <span className="user-referral__friend-name">
                              {name}
                            </span>
                          </div>
                        </td>

                        <td className="user-referral__date">
                          {formatDate(referral.createdAt)}
                        </td>

                        <td>
                          <span
                            className={`user-referral__status user-referral__status--${referral.status}`}
                          >
                            {referral.status === "pending" && (
                              <Clock3 size={13} />
                            )}

                            {referral.status === "approved" && (
                              <Check size={13} />
                            )}

                            {referral.status === "declined" && (
                              <span className="user-referral__status-dot" />
                            )}

                            {STATUS_LABELS[referral.status] ||
                              referral.status}
                          </span>
                        </td>

                        <td
                          className={`user-referral__reward ${
                            referral.status === "approved" ? "user-referral__reward--approved" : ""
                          }`}
                        >
                          {getRewardLabel(referral)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {referrals.length === 0 && (
              <div className="user-referral__empty">
                <span className="user-referral__empty-icon">
                  <Users size={28} />
                </span>

                <h3>No referrals yet</h3>

                <p>
                  Share your referral code with friends to get started.
                </p>

                <button type="button"
                  onClick={handleShareInvite}
                  className="user-referral__empty-button"
                  disabled={!referralCode}>
                  Invite a Friend
                  <Share2 size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </section>
  );
};

export default UserRefferalSection;