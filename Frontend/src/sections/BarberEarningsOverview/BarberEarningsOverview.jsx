import React, { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  TrendingUp,
  ArrowUpRight,
  Wallet,
  ChartNoAxesColumn,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";

import {
  EARNINGS_TEXT,
  EARNINGS_PERIODS,
  EARNINGS_CHART_DATA,
  EARNINGS_DATE_PRESETS,
} from "../../constants/earningsOverview";

import "./BarberEarningsOverview.scss";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const getDateRange = (period) => {
  const end = new Date();
  const start = new Date(end);

  if (period === "7days") {
    start.setDate(end.getDate() - 6);
  } else if (period === "30days") {
    start.setDate(end.getDate() - 29);
  } else {
    start.setMonth(end.getMonth() - 2);
    start.setDate(1);
  }

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return `${formatDate(start)} - ${formatDate(end)}`;
};

const BarberEarningsOverview = () => {
  const [period, setPeriod] = useState("7days");
  const [datePreset, setDatePreset] = useState("7days");
  const [dateMenuOpen, setDateMenuOpen] = useState(false);

  const cards = EARNINGS_TEXT.cards;
  const chartData = EARNINGS_CHART_DATA[period] || [];

  const selectedPreset = EARNINGS_DATE_PRESETS.find(
    (preset) => preset.value === datePreset
  );

  const handleDatePresetChange = (value) => {
    setDatePreset(value);
    setPeriod(value);
    setDateMenuOpen(false);
  };

  return (
    <section className="barber-earnings">
      <header className="barber-earnings__heading">
        <div>
          <span className="barber-earnings__eyebrow">
            BARBER WORKSPACE
          </span>

          <h1>{EARNINGS_TEXT.title}</h1>

          <p>{EARNINGS_TEXT.subtitle}</p>
        </div>

        <div className="barber-earnings__heading-icon">
          <CalendarDays size={25} />
        </div>
      </header>

      <div className="barber-earnings__content">
        <div className="barber-earnings__date-wrapper">
          <button
            type="button"
            className="barber-earnings__date-button"
            onClick={() => setDateMenuOpen((open) => !open)}
            aria-expanded={dateMenuOpen}
          >
            <CalendarDays size={19} />

            <span>{getDateRange(datePreset)}</span>

            <ChevronDown
              size={18}
              className={dateMenuOpen ? "is-open" : ""}
            />
          </button>

          {dateMenuOpen && (
            <div className="barber-earnings__date-menu">
              {EARNINGS_DATE_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.value}
                  className={
                    datePreset === preset.value ? "active" : ""
                  }
                  onClick={() => handleDatePresetChange(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="barber-earnings__section-heading">
          <div>
            <h2>{EARNINGS_TEXT.overviewTitle}</h2>
            <p>Your earnings at a glance</p>
          </div>

          <span className="barber-earnings__period-label">
            {selectedPreset?.label}
          </span>
        </div>

        <div className="barber-earnings__kpis">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.id}
                className={`earnings-card earnings-card--${card.accent}`}
              >
                <div className="earnings-card__top">
                  <div className="earnings-card__icon">
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  <span className="earnings-card__trend">
                    <TrendingUp size={15} />
                    {card.change}%
                  </span>
                </div>

                <div className="earnings-card__body">
                  <span className="earnings-card__title">
                    {card.title}
                  </span>

                  <h3>{formatCurrency(card.value)}</h3>
                </div>

                <div className="earnings-card__footer">
                  <ArrowUpRight size={16} />

                  <span>
                    {card.change}% from previous period
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <section className="barber-earnings__chart-card">
          <div className="barber-earnings__chart-heading">
            <div className="barber-earnings__chart-title">
              <div className="barber-earnings__chart-icon">
                <ChartNoAxesColumn size={21} />
              </div>

              <div>
                <h3>{EARNINGS_TEXT.trendTitle}</h3>
                <p>Monitor your income over time</p>
              </div>
            </div>

            <div className="barber-earnings__chart-total">
              <span>Chart total</span>
              <strong>
                {formatCurrency(
                  chartData.reduce(
                    (total, item) => total + item.earnings,
                    0
                  )
                )}
              </strong>
            </div>
          </div>

          <div className="barber-earnings__period-tabs">
            {EARNINGS_PERIODS.map((item) => (
              <button
                type="button"
                key={item.value}
                className={period === item.value ? "active" : ""}
                onClick={() => setPeriod(item.value)}
                aria-pressed={period === item.value}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="barber-earnings__chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#edf2e9"
                  strokeDasharray="4 5"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7d897a",
                    fontSize: 11,
                  }}
                  dy={10}
                />

                <Tooltip
                  cursor={{ fill: "#f4faef" }}
                  formatter={(value) => [
                    formatCurrency(value),
                    "Earnings",
                  ]}
                  contentStyle={{
                    border: "1px solid #e4eddf",
                    borderRadius: "12px",
                    boxShadow: "0 5px 18px rgba(25, 55, 20, 0.08)",
                  }}
                />

                <Bar
                  dataKey="earnings"
                  name="Earnings"
                  fill="#b8e9a4"
                  activeBar={{ fill: "#65c93a" }}
                  radius={[7, 7, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="barber-earnings__chart-footer">
            <span className="barber-earnings__legend-dot" />
            <span>Earnings</span>
            <span className="barber-earnings__chart-note">
              Values shown in INR
            </span>
          </div>
        </section>

        <div className="barber-earnings__note">
          <Wallet size={18} />

          <p>
            Earnings figures are illustrative. Connect your earnings API
            to display actual transactions and revenue.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BarberEarningsOverview;