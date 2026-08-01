import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import "./SlugMapSection.scss";

const SlugMapSection = ({
  details,
  others,
}) => {
  if (
    !details &&
    !others
  ) {
    return null;
  }

  return (
    <section className="slug-map-section">
      <div className="slug-container">
        <div className="section-header">
          <span>Visit Us</span>

          <h2>
            Find Our Salon
          </h2>

          <p>
            We'd love to welcome
            you. Visit us or get in
            touch using the details
            below.
          </p>
        </div>

        <div className="map-wrapper">
          <div className="contact-card">
            <div className="contact-item">
              <MapPin size={20} />

              <div>
                <h4>
                  Address
                </h4>

                <p>
                  {details?.address ||
                    "Not available"}
                </p>
              </div>
            </div>

            <div className="contact-item">
              <Phone size={20} />

              <div>
                <h4>
                  Phone
                </h4>

                <p>
                  {details?.phone ||
                    "Not available"}
                </p>
              </div>
            </div>

            <div className="contact-item">
              <Mail size={20} />

              <div>
                <h4>
                  Email
                </h4>

                <p>
                  {details?.email ||
                    "Not available"}
                </p>
              </div>
            </div>

            <div className="contact-item">
              <Clock size={20} />

              <div>
                <h4>
                  Working Hours
                </h4>

                <p>
                  {details?.openingTime ||
                    "--:--"}{" "}
                  -{" "}
                  {details?.closingTime ||
                    "--:--"}
                </p>
              </div>
            </div>
          </div>

          <div className="map-card">
            {others?.googleMaps ? (
              <iframe
                title="Google Map"
                src={others.googleMaps}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="map-placeholder">
                Google Map not
                available.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlugMapSection;