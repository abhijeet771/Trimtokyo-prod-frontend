import "./ContactSection.scss";
import { CONTACT } from "../../constants/contact";

const ContactSection = () => {
  const { title, subtitle, items } = CONTACT;

  return (
    <section className="contact-section">
      <div className="contact-section__container">

        {/* HEADER */}
        <div className="contact-section__header">
          <h2 className="contact-section__title">{title}</h2>
          <p className="contact-section__subtitle">{subtitle}</p>
        </div>

        {/* GRID */}
        <div className="contact-section__grid">
          {items.map((item) => (
            <div
              key={item.id}
              className="contact-section__card"
              onClick={() => window.open(item.link, "_blank")}
            >

              {/* TOP */}
              <div className="contact-section__card-top">
                <div className={`contact-section__icon ${item.type}`}>
                  {item.icon}
                </div>

                <div>
                  <p className="contact-section__card-label">
                    {item.label}
                  </p>
                  <p className="contact-section__card-value">
                    {item.value}
                  </p>
                </div>
              </div>

              {/* BUTTON */}
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-section__btn"
                onClick={(e) => e.stopPropagation()}
              >
                {item.cta}
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ContactSection;