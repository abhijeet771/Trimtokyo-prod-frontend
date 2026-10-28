
import { useState } from "react";
import "./BarberSidebar.scss";

import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { BARBER_SIDEBAR_ITEMS } from "../../../constants/barberSidebar";

const BarberSidebar = () => {
  const location = useLocation();

  const [earningsOpen, setEarningsOpen] = useState(
    location.pathname.startsWith("/barber/earnings")
  );

  return (
    <aside className="barber-sidebar">
      {/* BRAND */}
      <div className="barber-sidebar__brand">
        <div className="barber-sidebar__logo">
          <span>✂</span>
        </div>

        <div className="barber-sidebar__brand-info">
          <h2>TrimTokyo</h2>
        </div>
      </div>

      <div className="barber-sidebar__section-label">
        WORKSPACE
      </div>

      {/* NAVIGATION */}
      <nav className="barber-sidebar__nav">
        {BARBER_SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const isEarningsActive = location.pathname.startsWith(
              "/barber/earnings"
            );

            return (
              <div
                key={item.id}
                className="barber-sidebar__group"
              >
                <button
                  type="button"
                  className={`barber-sidebar__item barber-sidebar__toggle ${
                    isEarningsActive ? "active" : ""
                  }`}
                  onClick={() => setEarningsOpen((prev) => !prev)}
                  aria-expanded={earningsOpen}
                >
                  <Icon size={20} strokeWidth={1.9} />

                  <span>{item.label}</span>

                  <ChevronDown
                    className={`barber-sidebar__chevron ${
                      earningsOpen ? "open" : ""
                    }`}
                    size={16}
                  />
                </button>

                {earningsOpen && (
                  <div className="barber-sidebar__submenu">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;

                      return (
                        <NavLink
                          key={child.id}
                          to={child.path}
                          end={child.path === "/barber/earnings"}
                          className={({ isActive }) =>
                            `barber-sidebar__item barber-sidebar__subitem ${
                              isActive ? "active" : ""
                            }`
                          }
                        >
                          <ChildIcon size={17} strokeWidth={1.8} />
                          <span>{child.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/barber/dashboard"}
              className={({ isActive }) =>
                `barber-sidebar__item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <Icon size={20} strokeWidth={1.9} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="barber-sidebar__footer">
        <div className="barber-sidebar__section-label">
          ACCOUNT
        </div>

        <div className="barber-sidebar__workspace-status">
          <span className="barber-sidebar__status-dot" />
          <span>Staff Workspace</span>
        </div>
      </div>
    </aside>
  );
};

export default BarberSidebar;
