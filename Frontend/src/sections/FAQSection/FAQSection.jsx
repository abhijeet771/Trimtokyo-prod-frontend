import "./FAQSection.scss";
import { FAQ_DATA } from "../../constants/faq";
import FAQItem from "../../components/molecules/FAQItem/FAQItem";

const FAQSection = () => {
  return (
    <section className="faq-section">
      <div className="faq-section__container">
        
        <div className="faq-section__header">
          <h2 className="faq-section__title">
            Frequently Asked Questions
          </h2>

          <p className="faq-section__subtitle">
            Everything you need to know about orders, payments and delivery.
          </p>
        </div>

        <div className="faq-section__list">
          {FAQ_DATA.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;