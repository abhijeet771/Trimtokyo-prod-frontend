import React, { useEffect } from "react";

import ReelViewer from "../../components/organisms/ReelViewer/ReelViewer";

import useHomepageReels from "../../hooks/useHomepageReels";

import {
  REEL_SECTION_TITLE,
  REEL_SECTION_SUBTITLE,
  REEL_VIEW_ALL_TEXT,
  DEFAULT_REEL_VIEWS,
} from "../../constants/reel";

import "./ReelSection.scss";

const ReelSection = () => {
  const {
    loading,
    reels,
    viewerOpen,
    selectedReel,
    openViewer,
    closeViewer,
    fetchReels,
  } = useHomepageReels();

  useEffect(() => {
    fetchReels();
  }, []);

  return (
    <section className="reel-section">
      <div className="reel-section__header">
        <div>
          <h2>{REEL_SECTION_TITLE}</h2>

          <p>{REEL_SECTION_SUBTITLE}</p>
        </div>

        <button>{REEL_VIEW_ALL_TEXT}</button>
      </div>

      <div className="reel-section__list">
        {loading ? (
          <div className="reel-section__empty">
            Loading reels...
          </div>
        ) : reels.length === 0 ? (
          <div className="reel-section__empty">
            No reels available.
          </div>
        ) : (
          reels.map((reel) => (
            <div
              className="reel-card"
              key={reel._id}
              onClick={() => openViewer(reel)}
            >
              <video
                src={reel.videoUrl}
                muted
                loop
                playsInline
              />

              <div className="reel-card__overlay">
                <h4>{reel.title}</h4>

                <span>
                  ▶ {reel.views ?? DEFAULT_REEL_VIEWS}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <ReelViewer
        open={viewerOpen}
        reel={selectedReel}
        onClose={closeViewer}
      />
    </section>
  );
};

export default ReelSection;