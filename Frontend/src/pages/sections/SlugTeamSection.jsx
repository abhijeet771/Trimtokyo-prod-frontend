import {
  User,
  Briefcase,
  Award,
} from "lucide-react";

import "./SlugTeamSection.scss";

const SlugTeamSection = ({
  barbers = [],
}) => {
  if (!barbers.length) {
    return null;
  }

  return (
    <section className="slug-team-section">
      <div className="slug-container">
        <div className="section-header">
          <span>OUR TEAM</span>

          <h2>
            Meet Our Expert Barbers
          </h2>

          <p>
            Skilled professionals
            dedicated to providing
            exceptional grooming
            services.
          </p>
        </div>

        <div className="team-grid">
          {barbers.map(
            (barber, index) => (
              <div
                key={
                  barber._id ??
                  index
                }
                className="team-card"
              >
                <div className="team-image">
                  {barber.image ? (
                    <img
                      src={barber.image}
                      alt={
                        barber.name
                      }
                    />
                  ) : (
                    <div className="team-placeholder">
                      <User
                        size={48}
                      />
                    </div>
                  )}
                </div>

                <div className="team-content">
                  <h3>
                    {barber.name}
                  </h3>

                  {barber.designation && (
                    <div className="team-meta">
                      <Briefcase
                        size={16}
                      />

                      <span>
                        {
                          barber.designation
                        }
                      </span>
                    </div>
                  )}

                  {barber.specialization && (
                    <div className="team-meta">
                      <Award
                        size={16}
                      />

                      <span>
                        {
                          barber.specialization
                        }
                      </span>
                    </div>
                  )}

                  <div className="experience-badge">
                    {
                      barber.experience
                    }{" "}
                    Years Experience
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default SlugTeamSection;