
import { useMemo } from "react";
import {
  Users,
  Star,
  MapPin,
  Scissors,
  ArrowRight,
} from "lucide-react";

import "./SlugTeamSection.scss";

const getBarberName = (barber) =>
  barber?.name ||
  barber?.fullName ||
  barber?.user?.name ||
  barber?.profile?.name ||
  "Professional Barber";

const getBarberImage = (barber) =>
  barber?.profileImage ||
  barber?.avatar ||
  barber?.imageUrl ||
  barber?.image ||
  barber?.user?.profileImage ||
  "";

const getBarberRole = (barber) =>
  barber?.specialization ||
  barber?.designation ||
  barber?.roleTitle ||
  "Professional Barber";

const getBarberRating = (barber) => {
  const rating = Number(barber?.rating ?? barber?.averageRating);
  return Number.isFinite(rating) && rating > 0
    ? rating.toFixed(1)
    : null;
};

const SlugTeamSection = ({ barbers = [], onSelectBarber }) => {
  const teamMembers = useMemo(
    () => (Array.isArray(barbers) ? barbers : []),
    [barbers]
  );

  if (teamMembers.length === 0) {
    return null;
  }

  const handleSelectBarber = (barber) => {
    if (typeof onSelectBarber === "function") {
      onSelectBarber(barber);
      return;
    }

    document
      .getElementById("salon-services")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="slug-team" id="salon-team">
      <div className="slug-team__header">
        <div className="slug-team__heading">
          <span className="slug-team__heading-icon">
            <Users size={20} />
          </span>

          <div>
            <h2>Meet Our Barbers</h2>
            <p>
              Skilled professionals ready to help you look your best.
            </p>
          </div>
        </div>

        <span className="slug-team__count">
          {teamMembers.length}{" "}
          {teamMembers.length === 1 ? "professional" : "professionals"}
        </span>
      </div>

      <div className="slug-team__grid">
        {teamMembers.map((barber, index) => {
          const barberId =
            barber?._id || barber?.id || `barber-${index}`;

          const name = getBarberName(barber);
          const image = getBarberImage(barber);
          const rating = getBarberRating(barber);
          const role = getBarberRole(barber);

          return (
            <article className="slug-team__card" key={barberId}>
              <div className="slug-team__image-wrap">
                {image ? (
                  <img
                    className="slug-team__image"
                    src={image}
                    alt={name}
                    loading="lazy"
                  />
                ) : (
                  <div className="slug-team__image-placeholder">
                    <Scissors size={34} />
                    <span>Barber</span>
                  </div>
                )}

                <span className="slug-team__image-label">
                  <span className="slug-team__status-dot" />
                  Professional
                </span>
              </div>

              <div className="slug-team__body">
                <div className="slug-team__name-row">
                  <h3>{name}</h3>

                  {rating && (
                    <span className="slug-team__rating">
                      <Star size={14} fill="currentColor" />
                      {rating}
                    </span>
                  )}
                </div>

                <p className="slug-team__role">
                  <Scissors size={14} />
                  {role}
                </p>

                {barber?.experience && (
                  <p className="slug-team__experience">
                    {barber.experience} experience
                  </p>
                )}

                {barber?.address && (
                  <p className="slug-team__location">
                    <MapPin size={14} />
                    <span>{barber.address}</span>
                  </p>
                )}

                <button
                  type="button"
                  className="slug-team__button"
                  onClick={() => handleSelectBarber(barber)}
                >
                  Choose barber
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default SlugTeamSection;
