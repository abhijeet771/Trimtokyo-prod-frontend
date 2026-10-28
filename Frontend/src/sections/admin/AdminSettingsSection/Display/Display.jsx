import React, { useEffect, useState } from "react";
import useDisplay from "../../../../hooks/admin/useDisplay";
import "./Display.scss";

const Display = () => {
  const { settings, loading, saving, error, updateSettings } = useDisplay();

  const [zoomPercentage, setZoomPercentage] = useState(100);
  const [defaultSidebarOpen, setDefaultSidebarOpen] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const savedZoom = Number(settings?.zoomPercentage ?? 100);

    // Keep existing saved values within the supported slider range.
    setZoomPercentage(Math.min(100, Math.max(50, savedZoom)));
    setDefaultSidebarOpen(settings?.defaultSidebarOpen ?? false);
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess("");

    try {
      await updateSettings({
        zoomPercentage,
        defaultSidebarOpen,
      });

      setSuccess("Display settings saved successfully.");
    } catch {
      // Error is handled by the useDisplay hook.
    }
  };

  if (loading) {
    return <div className="display-settings">Loading settings...</div>;
  }

  return (
    <section className="display-settings">
      <div className="display-settings__header">
        <h2>Display Settings</h2>
        <p>Customize your dashboard appearance.</p>
      </div>

      <form onSubmit={handleSave} className="display-settings__form">
        <div className="display-settings__field">
          <div className="display-settings__label">
            <label htmlFor="zoomPercentage">Zoom Percentage</label>
            <span>{zoomPercentage}%</span>
          </div>

          <input
            id="zoomPercentage"
            name="zoomPercentage"
            type="range"
            min="50"
            max="100"
            step="5"
            value={zoomPercentage}
            onChange={(e) => {
              setZoomPercentage(Number(e.target.value));
              setSuccess("");
            }}
          />

          <p className="display-settings__hint">
            Adjust the dashboard display size. 100% is the normal size.
          </p>
        </div>

        <div className="display-settings__field display-settings__sidebar">
          <div>
            <label htmlFor="defaultSidebarOpen">Default Sidebar</label>
            <p>
              {defaultSidebarOpen
                ? "Sidebar opens by default"
                : "Sidebar closes by default"}
            </p>
          </div>

          <input
            id="defaultSidebarOpen"
            name="defaultSidebarOpen"
            type="checkbox"
            checked={defaultSidebarOpen}
            onChange={(e) => {
              setDefaultSidebarOpen(e.target.checked);
              setSuccess("");
            }}
          />
        </div>

        {error && <p className="display-settings__error">{error}</p>}
        {success && <p className="display-settings__success">{success}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </section>
  );
};

export default Display;
