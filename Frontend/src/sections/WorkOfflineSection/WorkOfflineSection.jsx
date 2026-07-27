import React from "react";
import { OFFLINE_CONTENT } from "../../constants/offline";
import {
  FaClock,
  FaCheckCircle,
  FaHome,
} from "react-icons/fa";
import "./WorkOfflineSection.scss";

const iconMap = {
  clock: <FaClock />,
  check: <FaCheckCircle />,
  home: <FaHome />,
};

const WorkOfflineSection = () => {
  return (
    <section className="work-offline">
      <h3>{OFFLINE_CONTENT.title}</h3>

      <div className="work-offline__grid">
        {OFFLINE_CONTENT.steps.map((step) => (
          <div key={step.id} className="card">
            <div className="icon">
              {iconMap[step.icon]}
            </div>

            <h4>{step.title}</h4>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkOfflineSection;