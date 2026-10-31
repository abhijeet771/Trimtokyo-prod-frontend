import React, { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import {
  PAYMENT_OVERVIEW_TEXT,
  PAYMENT_DATE_PRESETS,
  PAYMENT_SUMMARY_CARDS,
  PAYMENT_METHOD_BREAKDOWN,
  PAYMENT_STATUS_CARDS,
  PAYMENT_OVERVIEW_ICONS,
  PAYMENT_DATE_RANGE,
  formatPaymentCurrency,
} from "../../../constants/barberPaymentsOverview";

import "./BarberPaymentsOverview.scss";

const BarberPaymentsOverview = () => {
  const [period, setPeriod] = useState("7days");
  const [dateMenuOpen, setDateMenuOpen] = useState(false);

  const SummaryIcon = PAYMENT_OVERVIEW_ICONS.summary;
  const BreakdownIcon = PAYMENT_OVERVIEW_ICONS.breakdown;
  const StatusIcon = PAYMENT_OVERVIEW_ICONS.status;

  const selectedPreset =
    PAYMENT_DATE_PRESETS.find((item) => item.value === period) ??
    PAYMENT_DATE_PRESETS[0];

  const formatDate = (dateString) => {
    return new Date(`${dateString}T12:00:00`).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const dateRangeLabel = `${formatDate(
    PAYMENT_DATE_RANGE.start
  )} - ${formatDate(PAYMENT_DATE_RANGE.end)}`;

  const handlePeriodChange = (value) => {
    setPeriod(value);
    setDateMenuOpen(false);
  };

  return (
    <section className="barber-payments-overview">
      {/* Page heading */}
      <header className="barber-payments-overview__heading">
        <div>
          <span className="barber-payments-overview__eyebrow">
            EARNINGS
          </span>

          <h1>{PAYMENT_OVERVIEW_TEXT.title}</h1>

          <p>
            Review your received payments, pending amounts, and
            payment methods.
          </p>
        </div>
      </header>

      {/* Date range */}
      <div className="barber-payments-overview__date-wrapper">
        <CalendarDays
          className="barber-payments-overview__date-icon"
          size={22}
        />

        <span className="barber-payments-overview__date-label">
          {dateRangeLabel}
        </span>

        <ChevronDown
          className="barber-payments-overview__date-chevron"
          size={21}
        />
      </div>

      {/* Payment summary */}
      <section className="barber-payments-overview__panel">
        <div className="barber-payments-overview__panel-heading">
          <div className="barber-payments-overview__section-title">
            <span className="barber-payments-overview__section-icon barber-payments-overview__section-icon--purple">
              <SummaryIcon size={23} />
            </span>

            <h2>{PAYMENT_OVERVIEW_TEXT.summaryTitle}</h2>
          </div>

          <div className="barber-payments-overview__period">
            <button
              type="button"
              className="barber-payments-overview__period-button"
              aria-expanded={dateMenuOpen}
              onClick={() => setDateMenuOpen((open) => !open)}
            >
              {selectedPreset.label}
              <ChevronDown size={17} />
            </button>

            {dateMenuOpen && (
              <div className="barber-payments-overview__period-menu">
                {PAYMENT_DATE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={
                      period === preset.value
                        ? "barber-payments-overview__period-option is-active"
                        : "barber-payments-overview__period-option"
                    }
                    onClick={() =>
                      handlePeriodChange(preset.value)
                    }
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="barber-payments-overview__summary-grid">
          {PAYMENT_SUMMARY_CARDS.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.id}
                className="barber-payments-overview__summary-card"
              >
                <div
                  className={`barber-payments-overview__card-icon barber-payments-overview__card-icon--${card.accent}`}
                >
                  <Icon size={25} />
                </div>

                <div className="barber-payments-overview__card-content">
                  <p className="barber-payments-overview__card-label">
                    {card.title}
                  </p>

                  <h3>
                    {formatPaymentCurrency(card.value)}
                  </h3>

                  <span className="barber-payments-overview__card-description">
                    {card.description}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Payment method breakdown */}
      <section className="barber-payments-overview__panel">
        <div className="barber-payments-overview__panel-heading">
          <div className="barber-payments-overview__section-title">
            <span className="barber-payments-overview__section-icon barber-payments-overview__section-icon--purple">
              <BreakdownIcon size={23} />
            </span>

            <h2>{PAYMENT_OVERVIEW_TEXT.breakdownTitle}</h2>
          </div>
        </div>

        <div className="barber-payments-overview__breakdown-list">
          {PAYMENT_METHOD_BREAKDOWN.map((method) => {
            const Icon = method.icon;

            return (
              <article
                key={method.id}
                className="barber-payments-overview__breakdown-row"
              >
                <div
                  className={`barber-payments-overview__breakdown-icon barber-payments-overview__breakdown-icon--${method.accent}`}
                >
                  <Icon size={25} />
                </div>

                <div className="barber-payments-overview__breakdown-info">
                  <h3>{method.title}</h3>
                  <p>{method.count} payments</p>
                </div>

                <div className="barber-payments-overview__progress">
                  <div className="barber-payments-overview__progress-track">
                    <div
                      className={`barber-payments-overview__progress-fill barber-payments-overview__progress-fill--${method.accent}`}
                      style={{
                        width: `${method.percentage}%`,
                      }}
                    />
                  </div>
                </div>

                <span className="barber-payments-overview__percentage">
                  {method.percentage}%
                </span>

                <strong className="barber-payments-overview__breakdown-amount">
                  {formatPaymentCurrency(method.amount)}
                </strong>
              </article>
            );
          })}
        </div>
      </section>

      {/* Payment status */}
      <section className="barber-payments-overview__panel">
        <div className="barber-payments-overview__panel-heading">
          <div className="barber-payments-overview__section-title">
            <span className="barber-payments-overview__section-icon barber-payments-overview__section-icon--purple">
              <StatusIcon size={23} />
            </span>

            <h2>{PAYMENT_OVERVIEW_TEXT.statusTitle}</h2>
          </div>
        </div>

        <div className="barber-payments-overview__status-grid">
          {PAYMENT_STATUS_CARDS.map((status) => {
            const Icon = status.icon;

            return (
              <article
                key={status.id}
                className={`barber-payments-overview__status-card barber-payments-overview__status-card--${status.accent}`}
              >
                <div className="barber-payments-overview__status-heading">
                  <Icon size={23} />
                  <span>{status.title}</span>
                </div>

                <h3>{status.count}</h3>

                <p>
                  {formatPaymentCurrency(status.amount)}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
};

export default BarberPaymentsOverview;
