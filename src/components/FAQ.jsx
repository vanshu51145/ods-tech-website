import { useState } from "react";
import "./FAQ.css";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

 const faqData = [
  {
    question: "What services does ODS Tech provide?",
    answer:
      "We provide website development, web applications, UI/UX design, digital solutions, business websites, and ongoing website maintenance services.",
  },
  {
    question: "How long does it take to complete a website?",
    answer:
      "The timeline depends on the project requirements. Most business websites are completed within 2 to 6 weeks, while larger projects may take longer.",
  },
  {
    question: "Do you provide website maintenance after delivery?",
    answer:
      "Yes. We offer post-launch support, regular updates, bug fixes, security improvements, and maintenance to keep your website running smoothly.",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Absolutely! We can redesign your existing website with a modern look, improved performance, responsive design, and better user experience.",
  },
  {
    question: "How can I request a quotation for my project?",
    answer:
      "You can contact us through the Contact page or submit your project details, and our team will get back to you with a customized quotation.",
  },
];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2>Frequently Asked Questions</h2>
        <p>
          Find answers to the most common questions about our services.
        </p>

        {faqData.map((item, index) => (
          <div className="faq-item" key={index}>
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <h3>{item.question}</h3>

              <span>
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>

            <div
              className={`faq-answer ${
                activeIndex === index ? "show" : ""
              }`}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;