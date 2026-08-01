import {
  Clock3,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

import "./SlugTimingSection.scss";

const SlugTimingSection = ({
  details,
  others,
}) => {
  if (!details && !others) {
    return null;
  }

  return (
    <section className="slug-timing-section">
      <div className="slug-container">
        <div className="timing-grid">
          <div className="timing-card">
            <div className="card-header">
              <Clock3 size={22} />
              <h3>Business Hours</h3>
            </div>

            <div className="timing-row">
              <span>Opening</span>

              <strong>
                {details?.openingTime ||
                  "--:--"}
              </strong>
            </div>

            <div className="timing-row">
              <span>Closing</span>

              <strong>
                {details?.closingTime ||
                  "--:--"}
              </strong>
            </div>
          </div>

          <div className="timing-card">
            <div className="card-header">
              <Phone size={22} />
              <h3>Contact</h3>
            </div>

            <div className="contact-list">
              {details?.phone && (
                <a
                  href={`tel:${details.phone}`}
                >
                  <Phone size={16} />

                  {details.phone}
                </a>
              )}

              {details?.email && (
                <a
                  href={`mailto:${details.email}`}
                >
                  <Mail size={16} />

                  {details.email}
                </a>
              )}

              {others?.website && (
                <a
                  href={others.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Globe size={16} />

                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlugTimingSection;