import { useState } from "react";
import "./FAQItem.scss";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAQ = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`faq-item ${isOpen ? "faq-item--active" : ""}`}>
      
      <div className="faq-item__header" onClick={toggleFAQ}>
        <h4 className="faq-item__question">
          {question}
        </h4>

        <span className="faq-item__icon">
          {isOpen ? "−" : "+"}
        </span>
      </div>

      {isOpen && (
        <div className="faq-item__content">
          <p className="faq-item__answer">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;