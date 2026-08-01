import {
  Clock3,
  IndianRupee,
  Scissors,
} from "lucide-react";

import "./SlugServicesSection.scss";

const SlugServicesSection = ({
  services = [],
}) => {
  if (!services.length) {
    return null;
  }

  return (
    <section className="slug-services-section">
      <div className="slug-container">
        <div className="section-header">
          <span>
            What We Offer
          </span>

          <h2>
            Our Premium Services
          </h2>

          <p>
            Choose from a wide
            range of professional
            grooming services
            tailored to your style.
          </p>
        </div>

        <div className="services-grid">
          {services.map(
            (service) => (
              <div
                key={service._id}
                className="service-card"
              >
                <div className="service-icon">
                  <Scissors
                    size={28}
                  />
                </div>

                <h3>
                  {service.name}
                </h3>

                <p className="description">
                  Professional
                  grooming service
                  delivered by our
                  experienced
                  barbers using
                  premium products.
                </p>

                <div className="service-meta">
                  <div className="meta-item">
                    <IndianRupee
                      size={18}
                    />

                    <span>
                      ₹
                      {service.price}
                    </span>
                  </div>

                  <div className="meta-item">
                    <Clock3
                      size={18}
                    />

                    <span>
                      {
                        service.duration
                      }{" "}
                      mins
                    </span>
                  </div>
                </div>

                <button className="book-btn">
                  Book
                  Appointment
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default SlugServicesSection;