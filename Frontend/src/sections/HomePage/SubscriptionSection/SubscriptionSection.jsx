
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Check,
  ArrowRight,
  CalendarDays,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import useSubscriptions from "../../../hooks/website/useSubscriptions";
import "./SubscriptionSection.scss";

const formatPrice = (price, currency = "INR") => {
  const currencyCode = currency === "₹" ? "INR" : currency;

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode || "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  } catch {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  }
};

const getDurationLabel = (months) => {
  const duration = Number(months) || 1;

  if (duration === 1) return "per month";
  if (duration === 12) return "per year";
  return `for ${duration} months`;
};

const getSavings = (originalPrice, price) => {
  const original = Number(originalPrice);
  const current = Number(price);

  if (!original || original <= current || current < 0) return null;

  const percentage = Math.round(((original - current) / original) * 100);

  return percentage > 0 ? `${percentage}% OFF` : null;
};

const SubscriptionSection = () => {
  const navigate = useNavigate();
  const { subscriptions = [], loading, error, refetch } = useSubscriptions();

  const handleChoosePlan = (plan) => {
    const planId = plan._id || plan.id;

    if (!planId) return;

    navigate(`/auth?plan=${encodeURIComponent(planId)}`);
  };

  return (
    <section className="subscription-section">
      <div className="subscription-section__container">
        {/* SECTION HEADER */}
        <div className="subscription-section__header">
          <span className="subscription-section__badge">
            <Crown size={15} />
            Premium Membership
          </span>

          <h2 className="subscription-section__title">
            Choose Your <span>Perfect Plan</span>
          </h2>

          <p className="subscription-section__subtitle">
            Discover membership plans designed to fit your grooming routine.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="subscription-section__state">
            <RefreshCw
              size={25}
              className="subscription-section__loader"
            />
            <p>Loading subscription plans...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="subscription-section__state subscription-section__state--error">
            <p>We couldn't load subscription plans. Please try again.</p>

            <button type="button" onClick={refetch}>
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && subscriptions.length === 0 && (
          <div className="subscription-section__state">
            <Crown size={28} />
            <p>No subscription plans are available right now.</p>
          </div>
        )}

        {/* SUBSCRIPTION PLANS */}
        {!loading && !error && subscriptions.length > 0 && (
          <div className="subscription-section__plans">
            {subscriptions.map((plan) => {
              const features = [...(plan.benefits || [])]
                .filter((benefit) => benefit.isIncluded !== false)
                .sort(
                  (a, b) =>
                    (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
                );

              const savings = getSavings(
                plan.originalPrice,
                plan.price
              );

              const popular = Boolean(plan.isPopular);

              return (
                <article
                  key={plan._id || plan.id}
                  className={`subscription-section__card subscription-section__card--${plan.theme || "green"} ${
                    popular
                      ? "subscription-section__card--popular"
                      : ""
                  }`}
                >
                  {popular && (
                    <div className="subscription-section__popular">
                      <Crown size={14} />
                      MOST POPULAR
                    </div>
                  )}

                  <div className="subscription-section__card-body">
                    {/* PLAN HEADER */}
                    <div className="subscription-section__plan-header">
                      <div className="subscription-section__plan-info">
                        <h3>{plan.name}</h3>
                        <p>{plan.description}</p>
                      </div>

                      <div className="subscription-section__plan-icon">
                        {Number(plan.durationMonths) === 1 ? (
                          <CalendarDays
                            size={30}
                            strokeWidth={1.7}
                          />
                        ) : (
                          <Crown size={30} strokeWidth={1.7} />
                        )}
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="subscription-section__pricing">
                      <div className="subscription-section__price-line">
                        <span className="subscription-section__price">
                          {formatPrice(plan.price, plan.currency)}
                        </span>

                        {Number(plan.originalPrice) >
                          Number(plan.price) && (
                          <span className="subscription-section__original-price">
                            {formatPrice(
                              plan.originalPrice,
                              plan.currency
                            )}
                          </span>
                        )}
                      </div>

                      <span className="subscription-section__price-label">
                        {getDurationLabel(plan.durationMonths)}
                      </span>

                      {savings && (
                        <span className="subscription-section__savings">
                          {savings}
                        </span>
                      )}
                    </div>

                    {/* BENEFITS */}
                    <ul className="subscription-section__features">
                      {features.map((feature, index) => (
                        <li
                          key={
                            feature._id ||
                            `${plan._id || plan.id}-benefit-${index}`
                          }
                        >
                          <span className="subscription-section__check">
                            <Check size={13} strokeWidth={3} />
                          </span>

                          <span>{feature.label}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      type="button"
                      className="subscription-section__button"
                      onClick={() => handleChoosePlan(plan)}
                    >
                      <span>Choose Plan</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* FOOTNOTE */}
        <p className="subscription-section__note">
          <Sparkles size={14} />
          Choose a plan that fits your grooming routine.
        </p>
      </div>
    </section>
  );
};

export default SubscriptionSection;