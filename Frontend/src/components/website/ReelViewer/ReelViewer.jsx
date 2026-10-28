import React, { useEffect, useRef } from "react";

import {
  DEFAULT_REEL_VIEWS,
  REEL_VIEWER_CLOSE_TEXT,
} from "../../../constants/reel";

import "./ReelViewer.scss";

const ReelViewer = ({
  open,
  reel,
  onClose,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [open]);

  if (!open || !reel) return null;

  return (
    <div
      className="reel-viewer-overlay"
      onClick={onClose}
    >
      <div
        className="reel-viewer"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="reel-viewer__close"
          onClick={onClose}
        >
          {REEL_VIEWER_CLOSE_TEXT}
        </button>

        <div className="reel-viewer__video">
          <video
            ref={videoRef}
            src={reel.videoUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            controlsList="nodownload"
          />
        </div>

        <div className="reel-viewer__info">
          <h2>{reel.title}</h2>

          <p>
            {reel.description ||
              "No description available."}
          </p>

          <div className="reel-viewer__stats">
            <span>
              👁{" "}
              {reel.views ??
                DEFAULT_REEL_VIEWS}{" "}
              Views
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelViewer;