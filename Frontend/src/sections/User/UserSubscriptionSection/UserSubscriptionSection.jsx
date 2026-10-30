import React, { useState } from "react";
import {  ArrowLeft,  ArrowRight,  Check,  CheckCircle2,  Clock,
  Copy,  Crown,  QrCode,  ShieldCheck,  Sparkles,
} from "lucide-react";

import useUserSubscription from "../../../hooks/user/useUserSubscription";
import "./UserSubscriptionSection.scss";

const BUSINESS_UPI_ID = "yourbusiness@upi";

const UserSubscriptionSection = () => {
  const { plans, plansLoading, initiatePurchase, confirmPayment, submitting, error,  } = useUserSubscription();

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
    }).format(price || 0);

  const getIncludedBenefits = (plan) =>
    (plan?.benefits || []).filter((benefit) => benefit.isIncluded !== false);

  /* ============================================================
     SELECT PLAN AND CREATE PURCHASE REQUEST
  ============================================================ */

  const handleSelectPlan = async (plan) => {
    setLocalError("");
    setSelectedPlan(plan);
    setPurchaseId(null);
    setSubmitted(false);

    try {
      const purchase = await initiatePurchase(plan._id);

      setPurchaseId(purchase._id);
      setStep("payment");
    } catch (err) {
      setLocalError( err.response?.data?.message || "Unable to initiate subscription purchase."
      );
    }
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
  ============================================================ */

  const handlePaymentCompleted = async () => {
    if (!purchaseId) {
      setLocalError("Subscription purchase request not found.");
      return;
    }

    setLocalError("");

    try {
      await confirmPayment(purchaseId);

      setSubmitted(true);
      setStep("approval");
    } catch (err) {
      setLocalError(
        err.response?.data?.message ||
          "Unable to submit payment confirmation."
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

  const displayError = localError || error;

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
          className={ step === "payment" ? "active" : step === "approval" ? "completed" : "" }>
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

      {/* SUBSCRIPTION PLANS */}

      {step === "plans" && (
        <>
          <div className="subscription-section-title">
            <h2>Membership Plans</h2>
            <p>Choose a plan that works best for you.</p>
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
                    className={`subscription-card ${plan.theme || "blue"} ${
                      plan.isPopular ? "popular" : ""
                    }`}
                    key={plan._id}
                  >
                    {plan.isPopular && (
                      <span className="popular-label">
                        <Crown size={13} />
                        MOST POPULAR
                      </span>
                    )}

                    <div className="plan-icon">
                      {plan.isPopular ? ( <Crown size={23} />) : (<Sparkles size={23} />
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

                      <del>
                        {formatPrice( plan.originalPrice, plan.currency )}
                      </del>
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
                      className="buy-plan-btn" onClick={() => handleSelectPlan(plan)}
                      disabled={submitting}
                    >
                      {submitting && selectedPlan?._id === plan._id ? "Processing..." : "Buy Now"}

                      <ArrowRight size={16} />
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
                <p>Scan using Google Pay, PhonePe or Paytm.</p>
              </div>
            </div>

            {/* BUSINESS QR IMAGE */}

            <div className="qr-container">
              <img src="/payment/QR.png" alt="TrimTokyo Business UPI QR Code" className="business-qr"/>

              <strong>Scan to Pay</strong>
              <small>
                Use any UPI application to complete payment.
              </small>
            </div>

            <div className="payment-amount">
              Pay exactly
              <strong>
                {formatPrice( selectedPlan.price, selectedPlan.currency)}
              </strong>
            </div>

            <div className="upi-box">
              <div>
                <small>Business UPI ID</small>
                <strong>{BUSINESS_UPI_ID}</strong>
              </div>

              <button onClick={handleCopyUPI}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="payment-note">
              <ShieldCheck size={18} />
              Please pay the exact amount. Your membership will
              be activated after admin approval.
            </div>

            <button className="buy-plan-btn" onClick={handlePaymentCompleted}
              disabled={submitting || !purchaseId}>
              {submitting ? "Submitting..." : "I've Completed the Payment"}

              {!submitting && <ArrowRight size={16} />}
            </button>
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
                <small>{selectedPlan.durationMonths} Months</small>
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
                {formatPrice( selectedPlan.originalPrice - selectedPlan.price, selectedPlan.currency )}
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

          <button className="buy-plan-btn" onClick={handleBack}>
            Back to Membership Plans
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserSubscriptionSection;