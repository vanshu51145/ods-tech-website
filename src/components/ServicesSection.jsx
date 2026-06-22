function ServicesSection() {
  const services = [
    "Web Development",
    "UI/UX Design",
    "Mobile App Development"
  ];

  return (
    <section className="section">
      <h2>Our Services</h2>

      <div className="cards">
        {services.map((service, index) => (
          <div className="card" key={index}>
            <h3>{service}</h3>
            <p>Professional quality solutions.</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;