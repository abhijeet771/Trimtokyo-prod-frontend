import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ArrowRight,
  Heart,
  HandHeart,
  Sparkles,
  Users,
} from "lucide-react";

import "./EventSection.scss";

const events = [
  {
    id: 1,
    title: "Wedding Grooming",
    description: "Haircut, beard styling, facial and complete groom packages.",
    image: "/event/e1.png",
    icon: Heart,
    theme: "wedding",
    query: "Wedding Grooming",
  },
  {
    id: 2,
    title: "Upanayan Ceremony",
    description: "Traditional grooming packages for the special day.",
    image: "/event/e2.png",
    icon: HandHeart,
    theme: "ceremony",
    query: "Upanayan Ceremony",
  },
  {
    id: 3,
    title: "Engagement & Parties",
    description: "Premium grooming to make you stand out.",
    image: "/event/e3.png",
    icon: Sparkles,
    theme: "party",
    query: "Engagement Grooming",
  },
  {
    id: 4,
    title: "Festivals & Family Events",
    description: "Fresh looks for every celebration.",
    image: "/event/e4.png",
    icon: Users,
    theme: "family",
    query: "Family Event Grooming",
  },
];

const EventsSection = () => {
  const navigate = useNavigate();

  const handleEventClick = (eventName) => {
    navigate(`/search?q=${encodeURIComponent(eventName)}`);
  };

  return (
    <section className="events-section">
      <div className="events-section__container">
        {/* HERO */}
        <div className="events-section__hero">
          <div className="events-section__hero-content">
            <span className="events-section__badge">
              <CalendarDays size={15} />
              <span>EVENTS & OCCASIONS</span>
            </span>

            <h2 className="events-section__title">
              Grooming for
              <span> Every Occasion</span>
            </h2>

            <p className="events-section__subtitle">
              Special grooming services to make you look your best
              for life's important moments.
            </p>

            <button
              type="button"
              className="events-section__cta"
              onClick={() => handleEventClick("Event Grooming")}
            >
              Book for Your Event
              <ArrowRight size={19} />
            </button>
          </div>

          <div className="events-section__hero-image">
            <img
              src="/events/e1.png"
              alt="Wedding grooming for a special occasion"
              loading="lazy"
            />
          </div>
        </div>

        {/* EVENT CARDS */}
        <div className="events-section__cards">
          {events.map((event) => {
            const EventIcon = event.icon;

            return (
              <button
                type="button"
                className="events-section__card"
                key={event.id}
                onClick={() => handleEventClick(event.query)}
                aria-label={`Explore ${event.title}`}
              >
                <div className="events-section__card-image">
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                  />
                </div>

                <div className="events-section__card-content">
                  <span
                    className={`events-section__card-icon events-section__card-icon--${event.theme}`}
                  >
                    <EventIcon size={21} strokeWidth={2.2} />
                  </span>

                  <div className="events-section__card-info">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </div>

                  <span className="events-section__card-arrow">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
