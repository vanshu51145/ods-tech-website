import { useState } from "react";
import "./FAQ.css";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "What technologies do you use?",
      answer:
        "We specialize in MERN Stack, React.js, Node.js, Express.js, MongoDB, JavaScript, HTML, CSS, and modern web technologies.",
    },
    {
      question: "Do you offer SEO services?",
      answer:
        "Yes. We provide SEO-friendly website development along with performance optimization and responsive design.",
    },
    {
      question: "Can you build custom business websites?",
      answer:
        "Absolutely! We build custom websites, portfolios, e-commerce platforms, and enterprise web applications based on your business requirements.",
    },
    {
      question: "How long does it take to complete a project?",
      answer:
        "The timeline depends on the project scope. Most business websites are completed within 2–6 weeks.",
    },
    {
      question: "Do you provide website maintenance?",
      answer:
        "Yes. We offer ongoing maintenance, bug fixes, security updates, and feature enhancements after project delivery.",
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