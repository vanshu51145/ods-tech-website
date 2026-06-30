import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

function Services() {
  const services = [
    {
      title: "Web Development",
      description:
        "We build modern, responsive, and high-performance websites using the latest web technologies to help businesses establish a strong online presence."
    },
    {
      title: "App Development",
      description:
        "Our team develops user-friendly mobile applications for Android and iOS platforms with seamless performance and intuitive design."
    },
    {
      title: "SEO Optimization",
      description:
        "Improve your website's visibility on search engines with our result-driven SEO strategies, keyword optimization, and content marketing."
    },
    {
      title: "Digital Marketing",
      description:
        "Grow your business with effective digital marketing campaigns including social media marketing, email marketing, and paid advertising."
    }
  ];

  return (
    <>
      <Helmet>
        <title>
          ODS Tech Services | Web & Software Solutions
        </title>

        <meta
          name="description"
          content="Explore ODS Tech services including web development, app development, SEO optimization and digital marketing solutions."
        />
      </Helmet>


      <section className="page">
        <h1>Our Services</h1>

        <div className="cards">
          {services.map((service, index) => (
            <motion.div
              className="card"
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3>{service.title}</h3>

              <p>
                {service.description}
              </p>

            </motion.div>
          ))}
        </div>

      </section>
    </>
  );
}

export default Services;