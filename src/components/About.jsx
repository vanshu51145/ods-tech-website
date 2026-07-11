import { motion } from "framer-motion";
import "./About.css";

function AboutSection() {
  return (
    <motion.section
      className="section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
    <h2 style={{ textAlign: "center", marginBottom: "35px" }}>
  Why Choose ODS Network?
</h2>

<div className="why-container"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    maxWidth: "1100px",
    margin: "auto",
  }}
>
  {[
    "Experienced & Skilled Team",
    "Customized Digital Solutions",
    "Latest Technologies",
    "On-Time Project Delivery",
    "Transparent Communication",
    "24/7 Customer Support",
    "End-to-End IT Services",
    "Customer-Centric Approach",
  ].map((item, index) => (
    <div className="why-card"
      key={index}
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        textAlign: "center",
        transition: "0.3s",
      }}
    >
      <h3 style={{ color: "#0d6efd", marginBottom: "10px" }}>✔</h3>
      <p>{item}</p>
    </div>
  ))}
</div>
    </motion.section>
  );
}

export default AboutSection;