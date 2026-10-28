import { useCallback, useEffect, useState } from "react";

import {
  getDisplaySettings,
  updateDisplaySettings,
} from "../../services/adminSettings/display.services.js";

/* -------------------------------------------------------------------------- */
/*                              DISPLAY SETTINGS                              */
/* -------------------------------------------------------------------------- */

const DEFAULT_SETTINGS = {
  zoomPercentage: 100,
  defaultSidebarOpen: false,
};

const useDisplay = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* ------------------------------------------------------------------------ */
  /*                            FETCH SETTINGS                                */
  /* ------------------------------------------------------------------------ */

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDisplaySettings();

      if (response?.success && response?.data) {
        setSettings({
          zoomPercentage:
            response.data.zoomPercentage ?? 100,
          defaultSidebarOpen:
            response.data.defaultSidebarOpen ?? false,
        });
      }

      return response?.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load display settings."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings().catch(() => {});
  }, [fetchSettings]);

  /* ------------------------------------------------------------------------ */
  /*                            UPDATE SETTINGS                               */
  /* ------------------------------------------------------------------------ */

  const updateSettings = useCallback(async (updates) => {
    setSaving(true);
    setError(null);

    try {
      const response = await updateDisplaySettings(updates);

      if (response?.success && response?.data) {
        setSettings({
          zoomPercentage:
            response.data.zoomPercentage ?? 100,
          defaultSidebarOpen:
            response.data.defaultSidebarOpen ?? false,
        });
      }

      return response?.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update display settings."
      );

      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                              RETURN API                                  */
  /* ------------------------------------------------------------------------ */

  return {
    settings,
    setSettings,
    loading,
    saving,
    error,
    fetchSettings,
    updateSettings,
  };
};

export default useDisplay;