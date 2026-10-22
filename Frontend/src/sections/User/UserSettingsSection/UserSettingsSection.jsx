import React from "react";
import {
  UserRound,
  Monitor,
  BellRing,
  ShieldCheck,
  ChevronRight,
  Settings,
} from "lucide-react";

import { USER_SETTINGS_ITEMS } from "../../../constants/userSettingsConstants";

import "./UserSettingsSection.scss";

const SETTINGS_ICONS = {
  "user-round": UserRound,
  monitor: Monitor,
  "bell-ring": BellRing,
  "shield-check": ShieldCheck,
};

const UserSettingsSection = ({ onSettingSelect }) => {
  const handleSettingClick = (setting) => {
    if (setting.status === "Coming Soon") {
      return;
    }

    if (onSettingSelect) {
      onSettingSelect(setting.id);
    }
  };

  return (
    <section className="user-settings-section">
      <header className="user-settings-section__header">
        <div className="user-settings-section__heading">
          <div className="user-settings-section__heading-icon">
            <Settings size={23} />
          </div>

          <div>
            <h1>Settings</h1>
            <p>
              Manage your account preferences and personalize your
              TrimTokyo experience.
            </p>
          </div>
        </div>
      </header>

      <div className="user-settings-section__intro">
        <h2>General Preferences</h2>
        <p>
          Choose a setting below to manage your account and preferences.
        </p>
      </div>

      <div className="user-settings-section__grid">
        {USER_SETTINGS_ITEMS.map((setting) => {
          const IconComponent = SETTINGS_ICONS[setting.icon];
          const isComingSoon = setting.status === "Coming Soon";

          return (
            <article
              key={setting.id}
              className={`user-settings-section__card ${
                isComingSoon
                  ? "user-settings-section__card--coming-soon"
                  : ""
              }`}
            >
              <div className="user-settings-section__card-top">
                <div
                  className={`user-settings-section__card-icon user-settings-section__card-icon--${setting.category}`}
                >
                  <IconComponent size={22} />
                </div>

                <span
                  className={`user-settings-section__status ${
                    isComingSoon
                      ? "user-settings-section__status--coming-soon"
                      : "user-settings-section__status--available"
                  }`}
                >
                  {setting.status}
                </span>
              </div>

              <div className="user-settings-section__card-content">
                <h3>{setting.title}</h3>
                <p>{setting.description}</p>
              </div>

              <button
                type="button"
                className="user-settings-section__action"
                disabled={isComingSoon}
                onClick={() => handleSettingClick(setting)}
                aria-label={`${setting.actionLabel}: ${setting.title}`}
              >
                <span>{setting.actionLabel}</span>

                {!isComingSoon && <ChevronRight size={17} />}
              </button>
            </article>
          );
        })}
      </div>

      <div className="user-settings-section__footer-note">
        <ShieldCheck size={18} />
        <p>
          Your account preferences help us provide a more personalized
          experience. Additional security options will be available soon.
        </p>
      </div>
    </section>
  );
};

export default UserSettingsSection;
