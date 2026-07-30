import {
  Bell,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";

import "./BarberSettingSection.scss";

const BarberSettingSection = () => {
  return (
    <section className="barber-setting-section">
      <div className="page-header">
        <h2>Settings</h2>

        <p>
          Manage your account preferences and
          dashboard settings.
        </p>
      </div>

      <div className="settings-grid">
        {/* Account */}

        <div className="setting-card">
          <div className="card-header">
            <User size={22} />

            <h3>Account</h3>
          </div>

          <p>
            Update your profile information and
            password.
          </p>

          <button>Manage Account</button>
        </div>

        {/* Notifications */}

        <div className="setting-card">
          <div className="card-header">
            <Bell size={22} />

            <h3>Notifications</h3>
          </div>

          <p>
            Configure email and order
            notifications.
          </p>

          <button>Coming Soon</button>
        </div>

        {/* Security */}

        <div className="setting-card">
          <div className="card-header">
            <ShieldCheck size={22} />

            <h3>Security</h3>
          </div>

          <p>
            Manage password, sessions and account
            protection.
          </p>

          <button>Coming Soon</button>
        </div>

        {/* Privacy */}

        <div className="setting-card">
          <div className="card-header">
            <Lock size={22} />

            <h3>Privacy</h3>
          </div>

          <p>
            Control your account privacy and data
            preferences.
          </p>

          <button>Coming Soon</button>
        </div>
      </div>
    </section>
  );
};

export default BarberSettingSection;