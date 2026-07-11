import { motion } from "framer-motion";
import { title } from "framer-motion/client";
import { Helmet } from "react-helmet-async";

function Services() {
  const services = [
    {
      title: "🌐 Web Development",
      description:
        "We design and develop modern, responsive, and high-performance websites tailored to your business needs. Our solutions are secure, scalable, SEO-friendly, and optimized to deliver an exceptional user experience across all devices."
    },
    {
      title: "📱 Mobile App Development",
      description:
        "We create feature-rich Android and iOS applications that combine intuitive design with seamless performance. Our mobile solutions are built to enhance customer engagement, streamline business operations, and support long-term growth."
    },
    {
      title: "🔍 SEO Optimization",
      description:
        "Increase your online visibility and attract more organic traffic with our comprehensive SEO services. We implement keyword research, on-page optimization, technical SEO, content strategy, and performance monitoring to improve your search engine rankings."
    },
    {
      title: "📢 Digital Marketing",
      description:
        "Accelerate your business growth through data-driven digital marketing strategies. Our services include Social Media Marketing (SMM), Search Engine Marketing (SEM), Email Marketing, Pay-Per-Click (PPC) advertising, content marketing, and brand promotion to maximize your online reach and conversions."
    },
    {
      title:"🎨 UI/UX Design",
      description:
      "We create visually appealing and user-centric interfaces that deliver seamless digital experiences. Our UI/UX designs focus on usability, accessibility, and customer engagement to improve user satisfaction and business outcomes."
    },
    {
      title:"☁️ Cloud Solutions",
      description:
      "Leverage secure and scalable cloud technologies to improve efficiency, reduce operational costs, and ensure reliable access to your business applications and data from anywhere."
    },
    {
      title:"💼 IT Consulting",
      description:
      "Our experienced consultants help businesses identify the right technology solutions, optimize workflows, and implement digital transformation strategies that drive productivity and long-term success."
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