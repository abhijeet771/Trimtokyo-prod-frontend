import "./Testimonial.scss";

import { TESTIMONIALS } from "../../../constants/testimonials";

import TestimonialCard from "../../molecules/TestimonialCard/TestimonialCard";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const Testimonial = () => {
  const {
    badge,
    title,
    subtitle,
    stats,
    items,
  } = TESTIMONIALS;

  // duplicate for infinite scroll illusion
  const carouselItems = [...items, ...items];

  return (
    <section className="testimonial">
      <div className="testimonial__blur testimonial__blur--one"></div>

      <div className="testimonial__blur testimonial__blur--two"></div>

      <div className="testimonial__container">
        <div className="testimonial__header">
          <div className="testimonial__badge">
            {badge}
          </div>

          <h2 className="testimonial__title">
            {title}
          </h2>

          <p className="testimonial__subtitle">
            {subtitle}
          </p>

          <div className="testimonial__stats">
            <div className="testimonial__avatars">
              <img
                src={items[0].image}
                alt="customer"
              />

              <img
                src={items[1].image}
                alt="customer"
              />

              <img
                src={items[2].image}
                alt="customer"
              />
            </div>

            <span>
              {stats.customers}
            </span>

            <p>{stats.label}</p>
          </div>
        </div>

        <div className="testimonial__carousel">
          <button className="testimonial__nav testimonial__nav--left">
            <FaArrowLeft />
          </button>

          <div className="testimonial__wrapper">
            <div className="testimonial__track">
              {carouselItems.map(
                (item, index) => (
                  <div
                    className="testimonial__slide"
                    key={index}
                  >
                    <TestimonialCard
                      name={item.name}
                      image={item.image}
                      description={
                        item.description
                      }
                      location={
                        item.location
                      }
                      rating={item.rating}
                      bookedCount={
                        item.bookedCount
                      }
                      featured={
                        item.featured
                      }
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <button className="testimonial__nav testimonial__nav--right">
            <FaArrowRight />
          </button>
        </div>

        <div className="testimonial__dots">
          <span className="active"></span>

          <span></span>

          <span></span>

          <span></span>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;