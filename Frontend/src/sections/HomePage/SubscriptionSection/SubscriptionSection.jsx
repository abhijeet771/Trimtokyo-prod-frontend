
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Check,
  ArrowRight,
  CalendarDays,
  Sparkles,
} from "lucide-react";

import { SUBSCRIPTION_CONTENT } from "../../../constants/subscription";
import "./SubscriptionSection.scss";

const SubscriptionSection = () => {
  const navigate = useNavigate();

  const handleChoosePlan = (plan) => {
    navigate(`/auth?plan=${encodeURIComponent(plan.id)}`);
  };

  return (
    <section className="subscription-section">
      <div className="subscription-section__container">
        {/* SECTION HEADER */}
        <div className="subscription-section__header">
          <span className="subscription-section__badge">
            <Crown size={15} />
            {SUBSCRIPTION_CONTENT.badge}
          </span>

          <h2 className="subscription-section__title">
            {SUBSCRIPTION_CONTENT.title.line1}{" "}
            <span>{SUBSCRIPTION_CONTENT.title.highlight}</span>
          </h2>

          <p className="subscription-section__subtitle">
            {SUBSCRIPTION_CONTENT.subtitle}
          </p>
        </div>

        {/* SUBSCRIPTION PLANS */}
        <div className="subscription-section__plans">
          {SUBSCRIPTION_CONTENT.plans.map((plan) => (
            <article
              key={plan.id}
              className={`subscription-section__card subscription-section__card--${plan.theme} ${
                plan.popular
                  ? "subscription-section__card--popular"
                  : ""
              }`}
            >
              {plan.popular && (
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
                    {plan.id === "monthly" ? (
                      <CalendarDays size={30} strokeWidth={1.7} />
                    ) : (
                      <Crown size={30} strokeWidth={1.7} />
                    )}
                  </div>
                </div>

                {/* PRICE */}
                <div className="subscription-section__pricing">
                  <div className="subscription-section__price-line">
                    <span className="subscription-section__price">
                      ₹{plan.price.toLocaleString("en-IN")}
                    </span>

                    {plan.originalPrice && (
                      <span className="subscription-section__original-price">
                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <span className="subscription-section__price-label">
                    {plan.priceLabel}
                  </span>

                  {plan.savings && (
                    <span className="subscription-section__savings">
                      {plan.savings.label}
                    </span>
                  )}
                </div>

                {/* FEATURES */}
                <ul className="subscription-section__features">
                  {plan.features.map((feature, index) => (
                    <li key={`${plan.id}-${index}`}>
                      <span className="subscription-section__check">
                        <Check size={13} strokeWidth={3} />
                      </span>

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  type="button"
                  className="subscription-section__button"
                  onClick={() => handleChoosePlan(plan)}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>

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
