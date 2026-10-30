
import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import useUserSubscription from "../../../hooks/user/useUserSubscription";
import "./UserSubscriptionSection.scss";

const BUSINESS_UPI_ID = "yourbusiness@upi";

const UserSubscriptionSection = () => {
  const {
    plans,
    plansLoading,
    initiatePurchase,
    confirmPayment,
    currentSubscription,
    subscriptionStatus,
    submitting,
    error,
    fetchCurrentSubscription,
  } = useUserSubscription();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [purchaseId, setPurchaseId] = useState(null);
  const [step, setStep] = useState("plans");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState("");

  /* ============================================================
     HELPERS
  ============================================================ */

  const formatPrice = (price, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getIncludedBenefits = (plan) =>
    (plan?.benefits || []).filter(
      (benefit) => benefit.isIncluded !== false
    );

  const activePlan = currentSubscription;

  const hasActiveSubscription =
    subscriptionStatus === "active";

  const hasUpcomingSubscription =
    subscriptionStatus === "upcoming";

  const purchaseBlocked =
    hasActiveSubscription || hasUpcomingSubscription;

  const displayError = localError || error;

  /* ============================================================
     SELECT PLAN

     IMPORTANT:
     No purchase record is created here.
  ============================================================ */

  const handleSelectPlan = (plan) => {
    if (purchaseBlocked) {
      setLocalError(
        "You already have an active or upcoming approved membership."
      );
      return;
    }

    setLocalError("");
    setSelectedPlan(plan);
    setPurchaseId(null);
    setSubmitted(false);
    setStep("payment");
  };

  /* ============================================================
     COPY UPI ID
  ============================================================ */

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(BUSINESS_UPI_ID);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      setLocalError("Unable to copy UPI ID.");
    }
  };

  /* ============================================================
     SUBMIT PAYMENT CONFIRMATION

     Purchase is created only when the user clicks this button.
     If submission fails, retain purchaseId for a safe retry.
  ============================================================ */

  const handlePaymentCompleted = async () => {
    if (!selectedPlan) {
      setLocalError("Please select a subscription plan.");
      return;
    }

    setLocalError("");

    try {
      let currentPurchaseId = purchaseId;

      // Create purchase only on payment confirmation.
      if (!currentPurchaseId) {
        const purchase = await initiatePurchase(selectedPlan._id);

        currentPurchaseId = purchase?._id;

        if (!currentPurchaseId) {
          throw new Error(
            "Purchase could not be created. Please try again."
          );
        }

        setPurchaseId(currentPurchaseId);
      }

      // Submit the payment confirmation.
      await confirmPayment(currentPurchaseId);

      setSubmitted(true);
      setStep("approval");

      if (fetchCurrentSubscription) {
        await fetchCurrentSubscription();
      }
    } catch (err) {
      setLocalError(
        err.response?.data?.message ||
          err.message ||
          "Unable to submit payment confirmation. Please try again."
      );
    }
  };

  /* ============================================================
     BACK TO PLANS
  ============================================================ */

  const handleBack = () => {
    setSelectedPlan(null);
    setPurchaseId(null);
    setStep("plans");
    setSubmitted(false);
    setLocalError("");
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="user-subscription">

      {/* HEADER */}

      <div className="subscription-header">
        <div>
          <span className="subscription-eyebrow">
            TRIMTOKYO MEMBERSHIP
          </span>

          <h1>
            {step === "plans" && "Choose Your Membership"}
            {step === "payment" && "Complete Your Payment"}
            {step === "approval" && "Payment Verification"}
          </h1>

          <p>
            {step === "plans"
              ? "Unlock exclusive benefits with TrimTokyo."
              : step === "payment"
              ? "Complete your payment to request membership."
              : "Your subscription request is awaiting approval."}
          </p>
        </div>

        {step !== "plans" && (
          <button
            className="subscription-back"
            onClick={handleBack}
            disabled={submitting}
          >
            <ArrowLeft size={17} />
            Back to Plans
          </button>
        )}
      </div>

      {/* PROGRESS */}

      <div className="subscription-steps">
        <span className={step === "plans" ? "active" : "completed"}>
          {step !== "plans" ? <Check size={14} /> : "01"}
          Choose Plan
        </span>

        <div />

        <span
          className={
            step === "payment"
              ? "active"
              : step === "approval"
              ? "completed"
              : ""
          }
        >
          {step === "approval" ? <Check size={14} /> : "02"}
          Payment
        </span>

        <div />

        <span className={step === "approval" ? "active" : ""}>
          03 Approval
        </span>
      </div>

      {/* ERROR MESSAGE */}

      {displayError && (
        <p className="subscription-error" role="alert">
          {displayError}
        </p>
      )}

      {/* PLANS SCREEN */}

      {step === "plans" && (
        <>
          {/* CURRENT SUBSCRIPTION */}

          {activePlan && (
            <div className="current-subscription-card">
              <div className="current-subscription-heading">
                <div className="current-subscription-icon">
                  <Crown size={23} />
                </div>

                <div>
                  <span className="subscription-eyebrow">
                    {hasActiveSubscription
                      ? "YOUR ACTIVE MEMBERSHIP"
                      : "YOUR UPCOMING MEMBERSHIP"}
                  </span>

                  <h2>
                    {activePlan.planName ||
                      activePlan.subscriptionId?.name ||
                      "TrimTokyo Membership"}
                  </h2>
                </div>

                <span
                  className={`subscription-status ${
                    hasActiveSubscription ? "active" : "upcoming"
                  }`}
                >
                  {hasActiveSubscription ? "Active" : "Upcoming"}
                </span>
              </div>

              <div className="current-subscription-details">
                <div>
                  <span>Amount Paid</span>
                  <strong>
                    {formatPrice(
                      activePlan.amount,
                      activePlan.currency
                    )}
                  </strong>
                </div>

                <div>
                  <span>Start Date</span>
                  <strong>{formatDate(activePlan.startDate)}</strong>
                </div>

                <div>
                  <span>Expiry Date</span>
                  <strong>{formatDate(activePlan.endDate)}</strong>
                </div>
              </div>

              <p className="current-subscription-note">
                {hasActiveSubscription
                  ? "Your membership is active. You can purchase another plan after it expires."
                  : "Your payment has been approved. Your membership will activate on the scheduled start date."}
              </p>
            </div>
          )}

          <div className="subscription-section-title">
            <h2>Membership Plans</h2>
            <p>
              {purchaseBlocked
                ? "You already have an approved membership."
                : "Choose a plan that works best for you."}
            </p>
          </div>

          {plansLoading ? (
            <div className="subscription-loading">
              Loading membership plans...
            </div>
          ) : plans.length === 0 ? (
            <div className="subscription-empty">
              No active subscription plans are available currently.
            </div>
          ) : (
            <div className="subscription-grid">
              {plans.map((plan) => {
                const benefits = getIncludedBenefits(plan);

                return (
                  <div
                    className={`subscription-card ${
                      plan.theme || "blue"
                    } ${plan.isPopular ? "popular" : ""}`}
                    key={plan._id}
                  >
                    {plan.isPopular && (
                      <span className="popular-label">
                        <Crown size={13} />
                        MOST POPULAR
                      </span>
                    )}

                    <div className="plan-icon">
                      {plan.isPopular ? (
                        <Crown size={23} />
                      ) : (
                        <Sparkles size={23} />
                      )}
                    </div>

                    <h3>{plan.name}</h3>

                    <p className="plan-description">
                      {plan.description}
                    </p>

                    <div className="plan-price">
                      <strong>
                        {formatPrice(plan.price, plan.currency)}
                      </strong>

                      {plan.originalPrice > plan.price && (
                        <del>
                          {formatPrice(
                            plan.originalPrice,
                            plan.currency
                          )}
                        </del>
                      )}
                    </div>

                    <span className="plan-duration">
                      <Clock size={14} />
                      {plan.durationMonths} Months
                    </span>

                    <div className="plan-benefits">
                      <h4>What's Included</h4>

                      {benefits.map((benefit) => (
                        <div key={benefit._id || benefit.label}>
                          <CheckCircle2 size={16} />
                          {benefit.label}
                        </div>
                      ))}
                    </div>

                    <button
                      className="buy-plan-btn"
                      onClick={() => handleSelectPlan(plan)}
                      disabled={submitting || purchaseBlocked}
                    >
                      {purchaseBlocked
                        ? "Already Subscribed"
                        : "Buy Now"}

                      {!purchaseBlocked && (
                        <ArrowRight size={16} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="subscription-trust">
            <ShieldCheck size={21} />
            Secure UPI Payment · Admin Verification · Membership Activation
          </div>
        </>
      )}

      {/* PAYMENT SCREEN */}

      {step === "payment" && selectedPlan && (
        <div className="subscription-payment-layout">
          <div className="payment-panel">
            <div className="payment-title">
              <QrCode size={23} />

              <div>
                <h2>Scan & Pay</h2>
                <p>
                  Scan using Google Pay, PhonePe or Paytm.
                </p>
              </div>
            </div>

            <div className="qr-container">
              <img
                src="/payment/QR.png"
                alt="TrimTokyo Business UPI QR Code"
                className="business-qr"
              />

              <strong>Scan to Pay</strong>

              <small>
                Use any UPI application to complete payment.
              </small>
            </div>

            <div className="payment-amount">
              Pay exactly

              <strong>
                {formatPrice(
                  selectedPlan.price,
                  selectedPlan.currency
                )}
              </strong>
            </div>

            <div className="upi-box">
              <div>
                <small>Business UPI ID</small>
                <strong>{BUSINESS_UPI_ID}</strong>
              </div>

              <button onClick={handleCopyUPI}>
                {copied ? (
                  <Check size={15} />
                ) : (
                  <Copy size={15} />
                )}

                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="payment-note">
              <ShieldCheck size={18} />

              Please pay the exact amount. Your membership will
              be activated after admin approval.
            </div>

            <button
              className="buy-plan-btn"
              onClick={handlePaymentCompleted}
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "I've Completed the Payment"}

              {!submitting && <ArrowRight size={16} />}
            </button>

            {!purchaseId && (
              <small className="payment-request-note">
                Your subscription request will be created only
                after you confirm that payment is complete.
              </small>
            )}
          </div>

          {/* ORDER SUMMARY */}

          <aside className="payment-summary">
            <h3>Order Summary</h3>

            <div className="summary-plan">
              <div className="summary-icon">
                <Crown size={22} />
              </div>

              <div>
                <strong>{selectedPlan.name} Membership</strong>
                <small>
                  {selectedPlan.durationMonths} Months
                </small>
              </div>
            </div>

            <div className="summary-row">
              <span>Original Price</span>

              <del>
                {formatPrice(
                  selectedPlan.originalPrice,
                  selectedPlan.currency
                )}
              </del>
            </div>

            <div className="summary-row">
              <span>You Save</span>

              <strong>
                {formatPrice(
                  Math.max(
                    0,
                    (selectedPlan.originalPrice || 0) -
                      selectedPlan.price
                  ),
                  selectedPlan.currency
                )}
              </strong>
            </div>

            <div className="summary-total">
              <span>Total Payable</span>

              <strong>
                {formatPrice(
                  selectedPlan.price,
                  selectedPlan.currency
                )}
              </strong>
            </div>

            <div className="summary-benefits">
              <strong>Included Benefits</strong>

              {getIncludedBenefits(selectedPlan).map((benefit) => (
                <span key={benefit._id || benefit.label}>
                  <Check size={14} />
                  {benefit.label}
                </span>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* ADMIN APPROVAL SCREEN */}

      {step === "approval" && submitted && selectedPlan && (
        <div className="subscription-success">
          <div className="success-icon">
            <Clock size={40} />
          </div>

          <span className="pending-badge">
            Pending Admin Approval
          </span>

          <h2>Waiting for Admin Approval!</h2>

          <p>
            Thank you for choosing TrimTokyo. Your payment
            confirmation has been submitted. Our team will
            review your subscription request and activate
            your membership after verification.
          </p>

          <div className="submitted-details">
            <div>
              <span>Selected Plan</span>
              <strong>{selectedPlan.name}</strong>
            </div>

            <div>
              <span>Duration</span>
              <strong>{selectedPlan.durationMonths} Months</strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>
                {formatPrice(
                  selectedPlan.price,
                  selectedPlan.currency
                )}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong className="pending-text">
                Awaiting Approval
              </strong>
            </div>
          </div>

          <div className="approval-note">
            <ShieldCheck size={19} />

            Your subscription benefits will become available
            only after the admin verifies your payment.
          </div>

          <button
            className="buy-plan-btn"
            onClick={handleBack}
          >
            Back to Membership Plans
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserSubscriptionSection;