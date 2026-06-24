import { motion } from "framer-motion";

function AboutSection() {
  return (
    <motion.section
      className="section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <h2>Why Choose ODS Network?</h2>

      <p
        style={{
          maxWidth: "800px",
          margin: "auto",
          textAlign: "center",
          lineHeight: "1.8"
        }}
      >
        ODS Network specializes in delivering
        innovative web solutions, mobile applications,
        UI/UX design, SEO strategies, and digital
        marketing services that help businesses scale
        and succeed in the digital world.
      </p>
    </motion.section>
  );
}

export default AboutSection;