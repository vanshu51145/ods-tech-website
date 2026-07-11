import { useState } from "react";
import "./FAQ.css";

function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

const faqData = [
  {
    question: "What services does ODS Network provide?",
    answer:
      "ODS Network provides Web Development, Mobile App Development, UI/UX Design, Digital Marketing, SEO, Cloud Solutions, IT Consulting, and website maintenance services tailored to businesses of all sizes.",
  },
  {
    question: "How long does it take to complete a website?",
    answer:
      "The development timeline depends on the project's complexity. A standard business website typically takes 2–6 weeks, while custom enterprise solutions may require additional time.",
  },
  {
    question: "Do you provide support after project delivery?",
    answer:
      "Yes. We offer ongoing maintenance, security updates, performance optimization, bug fixes, and technical support to ensure your website remains secure and up to date.",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Absolutely. We modernize existing websites with improved UI/UX, responsive layouts, faster performance, better SEO, and enhanced security.",
  },
  {
    question: "How can I request a quotation?",
    answer:
      "You can contact us through our Contact page, email us at info.odsnetwork@gmail.com, or call +91 98013 51931. Our team will provide a customized quotation based on your project requirements.",
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
                            className={`faq-answer ${activeIndex === index ? "show" : ""
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