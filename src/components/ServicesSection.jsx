import { motion } from "framer-motion";

function ServicesSection() {
  const services = [
    {
      title: "Web Development",
      description: "Responsive and modern websites built with the latest technologies."
    },
    {
      title: "App Development",
      description: "Cross-platform mobile applications for Android and iOS."
    },
    {
      title: "SEO Optimization",
      description: "Improve search engine rankings and increase online visibility."
    },
    {
      title: "Digital Marketing",
      description: "Data-driven marketing strategies to grow your business."
    }
  ];

  return (
    <section className="section">
      <h2>Our Services</h2>

      <div className="cards">
        {services.map((service, index) => (
          <motion.div
            className="card"
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;