import { useState } from "react";
import { Sun, Moon, Palette, Monitor, Save } from "lucide-react";
import "./ThemeSettings.scss";

const COLOR_OPTIONS = [
  { name: "Green", value: "#287747" },
  { name: "Blue", value: "#2563eb" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Orange", value: "#ea580c" },
  { name: "Rose", value: "#e11d48" },
  { name: "Teal", value: "#0f766e" },
];

const ThemeSettings = () => {
  const [displayZoom, setDisplayZoom] = useState(100);
  const [themeMode, setThemeMode] = useState("light");
  const [accentColor, setAccentColor] = useState("#287747");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    // Save locally for now. Backend persistence can be added later.
    try {
      localStorage.setItem(
        "trimtokyo-theme-settings",
        JSON.stringify({
          displayZoom,
          themeMode,
          accentColor,
        })
      );

      document.documentElement.style.setProperty(
        "--tt-accent-color",
        accentColor
      );

      document.documentElement.style.setProperty(
        "--tt-display-zoom",
        `${displayZoom / 100}`
      );

      document.documentElement.dataset.theme = themeMode;

      setMessage("Theme settings saved successfully.");
    } catch (error) {
      console.error("Unable to save theme settings:", error);
      setMessage("Unable to save settings. Please try again.");
    }
  };

  return (
    <section className="theme-settings">
      <div className="theme-settings__header">
        <div className="theme-settings__header-icon">
          <Palette size={21} />
        </div>

        <div>
          <h3>Theme Settings</h3>
          <p>
            Customize your dashboard display and appearance preferences.
          </p>
        </div>
      </div>

      {/* DISPLAY ZOOM */}
      <div className="theme-settings__card">
        <div className="theme-settings__section-heading">
          <div className="theme-settings__icon">
            <Monitor size={19} />
          </div>

          <div>
            <h4>Display Zoom</h4>
            <p>Adjust the dashboard display scale.</p>
          </div>
        </div>

        <div className="theme-settings__zoom-control">
          <label htmlFor="display-zoom">Display percentage</label>

          <div className="theme-settings__zoom-value">
            {displayZoom}%
          </div>

          <input
            id="display-zoom"
            type="range"
            min="80"
            max="120"
            step="5"
            value={displayZoom}
            onChange={(e) => {
              setDisplayZoom(Number(e.target.value));
              setMessage("");
            }}
          />

          <div className="theme-settings__range-labels">
            <span>80%</span>
            <span>100%</span>
            <span>120%</span>
          </div>
        </div>
      </div>

      {/* LIGHT / DARK MODE */}
      <div className="theme-settings__card">
        <div className="theme-settings__section-heading">
          <div className="theme-settings__icon">
            {themeMode === "light" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </div>

          <div>
            <h4>Appearance Mode</h4>
            <p>Choose your preferred dashboard appearance.</p>
          </div>
        </div>

        <div className="theme-settings__mode-options">
          <button
            type="button"
            className={`theme-settings__mode-option ${
              themeMode === "light" ? "selected" : ""
            }`}
            onClick={() => {
              setThemeMode("light");
              setMessage("");
            }}
            aria-pressed={themeMode === "light"}
          >
            <Sun size={20} />
            <span>Light Mode</span>
          </button>

          <button
            type="button"
            className={`theme-settings__mode-option ${
              themeMode === "dark" ? "selected" : ""
            }`}
            onClick={() => {
              setThemeMode("dark");
              setMessage("");
            }}
            aria-pressed={themeMode === "dark"}
          >
            <Moon size={20} />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      {/* ACCENT COLOR */}
      <div className="theme-settings__card">
        <div className="theme-settings__section-heading">
          <div className="theme-settings__icon">
            <Palette size={19} />
          </div>

          <div>
            <h4>Accent Color</h4>
            <p>Choose the primary accent color for your dashboard.</p>
          </div>
        </div>

        <div className="theme-settings__colors">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.value}
              type="button"
              className={`theme-settings__color-option ${
                accentColor === color.value ? "selected" : ""
              }`}
              onClick={() => {
                setAccentColor(color.value);
                setMessage("");
              }}
              aria-label={`${color.name} accent color`}
              aria-pressed={accentColor === color.value}
              title={color.name}
            >
              <span
                className="theme-settings__color-circle"
                style={{ backgroundColor: color.value }}
              />

              <span>{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {message && (
        <p className="theme-settings__message" role="status">
          {message}
        </p>
      )}

      <div className="theme-settings__footer">
        <button
          type="button"
          className="theme-settings__save"
          onClick={handleSave}
        >
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </section>
  );
};

export default ThemeSettings;