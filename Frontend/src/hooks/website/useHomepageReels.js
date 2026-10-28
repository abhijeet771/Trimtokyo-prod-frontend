
import { useState, useCallback } from "react";
import { getReels } from "../../services/reel.services.js";

const useHomepageReels = () => {
  const [loading, setLoading] = useState(false);
  const [reels, setReels] = useState([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);

  /* ===========================
     FETCH PUBLIC REELS
  =========================== */

  const fetchReels = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await getReels();

      const reelData = Array.isArray(data?.data) ? data.data : [];

      setReels(reelData);
    } catch (error) {
      console.error(
        "Failed to fetch homepage reels:",
        error.response?.data || error.message || error
      );

      setReels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ===========================
     OPEN VIEWER
  =========================== */

  const openViewer = useCallback((reel) => {
    setSelectedReel(reel);
    setViewerOpen(true);
  }, []);

  /* ===========================
     CLOSE VIEWER
  =========================== */

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    setSelectedReel(null);
  }, []);

  return {
    loading,
    reels,
    viewerOpen,
    selectedReel,
    fetchReels,
    openViewer,
    closeViewer,
  };
};

export default useHomepageReels;
