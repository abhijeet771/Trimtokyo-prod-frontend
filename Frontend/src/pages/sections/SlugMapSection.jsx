
import {
  MapPin,
  Navigation,
  Phone,
  ExternalLink,
  MapPinned,
} from "lucide-react";

import "./SlugMapSection.scss";

const SlugMapSection = ({
  address = "",
  city = "",
  state = "",
  postalCode = "",
  phone = "",
  latitude,
  longitude,
  mapUrl = "",
}) => {
  const fullAddress = [
    address,
    city,
    state,
    postalCode,
  ]
    .filter((value) => value !== undefined && value !== null && String(value).trim())
    .join(", ");

  const hasCoordinates =
    latitude !== undefined &&
    latitude !== null &&
    longitude !== undefined &&
    longitude !== null &&
    String(latitude).trim() !== "" &&
    String(longitude).trim() !== "" &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude)) &&
    Number(latitude) >= -90 &&
    Number(latitude) <= 90 &&
    Number(longitude) >= -180 &&
    Number(longitude) <= 180;

  const locationQuery = hasCoordinates
    ? `${Number(latitude)},${Number(longitude)}`
    : fullAddress;

  const directionsUrl = locationQuery
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationQuery)}`
    : "";

  const embedUrl = mapUrl || (
    locationQuery
      ? `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&output=embed`
      : ""
  );

  const normalizedPhone = String(phone).replace(/[^\d+]/g, "");
  const phoneUrl = normalizedPhone
    ? `tel:${normalizedPhone}`
    : "";

  if (!fullAddress && !hasCoordinates && !mapUrl && !phone) {
    return null;
  }

  return (
    <section className="slug-map" id="salon-location">
      <div className="slug-map__header">
        <div className="slug-map__heading">
          <span className="slug-map__heading-icon">
            <MapPinned size={20} />
          </span>

          <div>
            <h2>Find Our Salon</h2>
            <p>Visit us for your next grooming experience.</p>
          </div>
        </div>
      </div>

      <div className="slug-map__layout">
        <div className="slug-map__details">
          <div className="slug-map__detail-icon">
            <MapPin size={21} />
          </div>

          <div className="slug-map__detail-content">
            <span className="slug-map__eyebrow">SALON ADDRESS</span>

            <h3>Visit Us</h3>

            {fullAddress ? (
              <p className="slug-map__address">{fullAddress}</p>
            ) : (
              <p className="slug-map__muted">
                The salon address is not available.
              </p>
            )}

            {directionsUrl && (
              <a
                className="slug-map__directions"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation size={16} />
                Get directions
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          {phone && (
            <div className="slug-map__contact">
              <span className="slug-map__contact-icon">
                <Phone size={17} />
              </span>

              <div className="slug-map__contact-info">
                <span>Contact the salon</span>

                {phoneUrl ? (
                  <a href={phoneUrl}>{phone}</a>
                ) : (
                  <p>{phone}</p>
                )}
              </div>
            </div>
          )}

          <div className="slug-map__note">
            <MapPin size={15} />
            <span>
              Use the directions link to navigate to the salon.
            </span>
          </div>
        </div>

        <div className="slug-map__map-wrap">
          {embedUrl ? (
            <iframe
              className="slug-map__iframe"
              src={embedUrl}
              title="Salon location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="slug-map__map-placeholder">
              <span>
                <MapPinned size={34} />
              </span>
              <h3>Map unavailable</h3>
              <p>Add a salon address or coordinates to show the map.</p>
            </div>
          )}

          {directionsUrl && (
            <a
              className="slug-map__map-link"
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open salon location in Google Maps"
            >
              <Navigation size={16} />
              Open in Maps
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default SlugMapSection;
