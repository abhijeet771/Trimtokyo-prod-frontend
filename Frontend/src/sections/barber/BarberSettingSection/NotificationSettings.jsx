import { useState } from "react";
import {
  Bell,
  CalendarCheck,
  ShoppingBag,
  MessageSquare,
  Megaphone,
  Mail,
  Save,
} from "lucide-react";

import "./NotificationSettings.scss";

const INITIAL_SETTINGS = [
  {
    id: "bookingUpdates",
    title: "Booking Updates",
    description: "Get notified when a customer books, cancels, or changes an appointment.",
    icon: CalendarCheck,
    enabled: true,
  },
  {
    id: "orderUpdates",
    title: "Order Notifications",
    description: "Receive alerts about new orders and order status changes.",
    icon: ShoppingBag,
    enabled: true,
  },
  {
    id: "customerMessages",
    title: "Customer Messages",
    description: "Get notified about customer enquiries and messages.",
    icon: MessageSquare,
    enabled: true,
  },
  {
    id: "promotions",
    title: "Offers & Promotions",
    description: "Receive updates about offers, campaigns, and promotional activities.",
    icon: Megaphone,
    enabled: false,
  },
  {
    id: "emailNotifications",
    title: "Email Notifications",
    description: "Receive important account and business updates through email.",
    icon: Mail,
    enabled: true,
  },
];

const NotificationSettings = () => {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(INITIAL_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleToggle = (id) => {
    setSettings((previous) =>
      previous.map((setting) =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );

    setMessage("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      // Connect your notification preferences API here.
      // For now, save the preferences for this component session.
      setSavedSettings(settings);

      setMessage("Notification preferences saved for this session.");
    } catch (error) {
      console.error("Unable to save notification settings:", error);
      setMessage("Unable to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = settings.some(
    (setting, index) =>
      setting.enabled !== savedSettings[index]?.enabled
  );

  return (
    <section className="notification-settings">
      <div className="notification-settings__header">
        <div className="notification-settings__header-icon">
          <Bell size={21} />
        </div>

        <div>
          <h3>Notification Settings</h3>
          <p>
            Choose which updates you want to receive for your barber business.
          </p>
        </div>
      </div>

      <div className="notification-settings__list">
        {settings.map((setting) => {
          const Icon = setting.icon;

          return (
            <div className="notification-setting" key={setting.id}>
              <div className="notification-setting__icon">
                <Icon size={19} />
              </div>

              <div className="notification-setting__content">
                <h4>{setting.title}</h4>
                <p>{setting.description}</p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={setting.enabled}
                aria-label={setting.title}
                className={`notification-toggle ${
                  setting.enabled ? "is-enabled" : ""
                }`}
                onClick={() => handleToggle(setting.id)}
              >
                <span className="notification-toggle__thumb" />
              </button>
            </div>
          );
        })}
      </div>

      {message && (
        <p className="notification-settings__message" role="status">
          {message}
        </p>
      )}

      <div className="notification-settings__footer">
        <span>
          {hasChanges
            ? "You have unsaved changes."
            : "Your preferences are up to date."}
        </span>

        <button
          type="button"
          className="notification-settings__save"
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </section>
  );
};

export default NotificationSettings;
