
import React from "react";
import {
  Store,
  Wallet,
  Users,
  CalendarDays,
  Package,
  ChartNoAxesCombined,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Scissors,
  TrendingUp,
  CalendarCheck,
  ClipboardList,
} from "lucide-react";

import "./BarberCreateSection.scss";

const features = [
  {
    icon: Store,
    title: "Manage Your Shop",
    description: "Control your shop profile, services, and timings.",
  },
  {
    icon: Wallet,
    title: "Track Expenses",
    description: "Monitor daily expenses and keep finances organized.",
  },
  {
    icon: Users,
    title: "Manage Staff",
    description: "Organize your team, roles, and work schedules.",
  },
  {
    icon: CalendarDays,
    title: "Salary Cycles",
    description: "Manage staff salaries and payment cycles with ease.",
  },
  {
    icon: Package,
    title: "Manage Orders",
    description: "Keep track of product orders and inventory.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Business Insights",
    description: "Track performance and discover growth opportunities.",
  },
];

const BarberCreateSection = () => {
  return (
    <section className="barber-create">
      <div className="barber-create__background">
        <span className="barber-create__orb barber-create__orb--one" />
        <span className="barber-create__orb barber-create__orb--two" />
      </div>

      <div className="barber-create__container">
        {/* Hero Content */}
        <div className="barber-create__hero">
          <div className="barber-create__content">
            <div className="barber-create__eyebrow">
              <span className="barber-create__eyebrow-icon">
                <Scissors size={16} />
              </span>
              GROW YOUR BUSINESS WITH TRIMTOKYO
            </div>

            <h1 className="barber-create__title">
              Your Shop.
              <br />
              Your Team.
              <br />
              <span>Your Success.</span>
            </h1>

            <p className="barber-create__description">
              Take your barbershop to the next level with TrimTokyo.
              Manage your shop, staff, expenses, salary cycles, and
              orders — all from one powerful platform.
            </p>

            <div className="barber-create__highlights">
              <div className="barber-create__highlight">
                <span className="barber-create__highlight-icon">
                  <CheckCircle2 size={18} />
                </span>
                Simple shop management
              </div>

              <div className="barber-create__highlight">
                <span className="barber-create__highlight-icon">
                  <CheckCircle2 size={18} />
                </span>
                Complete business control
              </div>

              <div className="barber-create__highlight">
                <span className="barber-create__highlight-icon">
                  <CheckCircle2 size={18} />
                </span>
                Built for growth
              </div>
            </div>

            <a
              href="#barber-application"
              className="barber-create__cta"
            >
              Become a Partner
              <ArrowRight size={19} />
            </a>

            <p className="barber-create__cta-note">
              <Clock3 size={15} />
              Submit your details and connect with our team.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="barber-create__visual">
            <div className="barber-create__visual-glow" />

            <div className="barber-create__shop-badge">
              <span className="barber-create__shop-badge-icon">
                <Store size={19} />
              </span>

              <span>
                <strong>Your business, simplified</strong>
                <small>Everything in one place</small>
              </span>

              <span className="barber-create__online-dot" />
            </div>

            <div className="barber-create__dashboard">
              <aside className="barber-create__sidebar">
                <div className="barber-create__brand">
                  <span className="barber-create__brand-icon">
                    <Scissors size={19} />
                  </span>
                  <span>TRIMTOKYO</span>
                </div>

                <div className="barber-create__nav-item barber-create__nav-item--active">
                  <ChartNoAxesCombined size={16} />
                  <span>Dashboard</span>
                </div>

                <div className="barber-create__nav-item">
                  <CalendarCheck size={16} />
                  <span>Appointments</span>
                </div>

                <div className="barber-create__nav-item">
                  <Users size={16} />
                  <span>Staff</span>
                </div>

                <div className="barber-create__nav-item">
                  <Wallet size={16} />
                  <span>Expenses</span>
                </div>

                <div className="barber-create__nav-item">
                  <CalendarDays size={16} />
                  <span>Salary</span>
                </div>

                <div className="barber-create__nav-item">
                  <Package size={16} />
                  <span>Orders</span>
                </div>
              </aside>

              <div className="barber-create__dashboard-main">
                <div className="barber-create__dashboard-header">
                  <div>
                    <span className="barber-create__dashboard-kicker">
                      BUSINESS OVERVIEW
                    </span>
                    <h3>Welcome, Partner!</h3>
                    <p>Here is how your shop is doing.</p>
                  </div>

                  <div className="barber-create__avatar">
                    <Store size={20} />
                  </div>
                </div>

                <div className="barber-create__stats">
                  <div className="barber-create__stat">
                    <span className="barber-create__stat-icon barber-create__stat-icon--blue">
                      <Wallet size={16} />
                    </span>
                    <span className="barber-create__stat-label">
                      Revenue
                    </span>
                    <strong>₹24,850</strong>
                    <small>
                      <TrendingUp size={12} />
                      Business overview
                    </small>
                  </div>

                  <div className="barber-create__stat">
                    <span className="barber-create__stat-icon barber-create__stat-icon--purple">
                      <Users size={16} />
                    </span>
                    <span className="barber-create__stat-label">
                      Your Staff
                    </span>
                    <strong>08</strong>
                    <small>Team members</small>
                  </div>

                  <div className="barber-create__stat">
                    <span className="barber-create__stat-icon barber-create__stat-icon--cyan">
                      <ClipboardList size={16} />
                    </span>
                    <span className="barber-create__stat-label">
                      Appointments
                    </span>
                    <strong>24</strong>
                    <small>Booking overview</small>
                  </div>
                </div>

                <div className="barber-create__dashboard-bottom">
                  <div className="barber-create__activity">
                    <div className="barber-create__panel-heading">
                      <strong>Business Activity</strong>
                      <span>Overview</span>
                    </div>

                    <div className="barber-create__chart">
                      <div className="barber-create__chart-grid">
                        <span />
                        <span />
                        <span />
                      </div>

                      <svg
                        viewBox="0 0 300 100"
                        preserveAspectRatio="none"
                        role="img"
                        aria-label="Illustrative upward business performance chart"
                      >
                        <defs>
                          <linearGradient
                            id="barberChartFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3984f7"
                              stopOpacity="0.24"
                            />
                            <stop
                              offset="100%"
                              stopColor="#3984f7"
                              stopOpacity="0.01"
                            />
                          </linearGradient>
                        </defs>

                        <path
                          d="M0 80 C25 74 30 56 55 63 S85 78 110 47 S150 61 175 35 S220 47 240 20 S275 27 300 8 L300 100 L0 100 Z"
                          fill="url(#barberChartFill)"
                        />

                        <path
                          d="M0 80 C25 74 30 56 55 63 S85 78 110 47 S150 61 175 35 S220 47 240 20 S275 27 300 8"
                          fill="none"
                          stroke="#2878ed"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="barber-create__chart-labels">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>
                  </div>

                  <div className="barber-create__quick-actions">
                    <div className="barber-create__panel-heading">
                      <strong>Quick Access</strong>
                    </div>

                    <div className="barber-create__quick-item">
                      <span className="barber-create__quick-icon barber-create__quick-icon--blue">
                        <Store size={16} />
                      </span>
                      <span>Shop Details</span>
                      <ArrowRight size={14} />
                    </div>

                    <div className="barber-create__quick-item">
                      <span className="barber-create__quick-icon barber-create__quick-icon--purple">
                        <Users size={16} />
                      </span>
                      <span>Manage Team</span>
                      <ArrowRight size={14} />
                    </div>

                    <div className="barber-create__quick-item">
                      <span className="barber-create__quick-icon barber-create__quick-icon--cyan">
                        <Wallet size={16} />
                      </span>
                      <span>Track Expenses</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="barber-create__floating-card">
              <span className="barber-create__floating-icon">
                <TrendingUp size={20} />
              </span>
              <span>
                <strong>One platform. More control.</strong>
                <small>Run your business with confidence.</small>
              </span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="barber-create__features-heading">
          <span>BUILT FOR BARBERSHOP OWNERS</span>
          <h2>Everything Your Shop Needs to Grow</h2>
          <p>
            Spend less time managing operations and more time building
            your business.
          </p>
        </div>

        <div className="barber-create__features">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className="barber-create__feature-card"
                key={feature.title}
              >
                <div className="barber-create__feature-icon">
                  <Icon size={23} strokeWidth={1.9} />
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BarberCreateSection;
