import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import ServicesSection from "../components/ServicesSection";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Hero />
      <section className="section">
        <h2>Welcome to Our Website</h2>
        <p>{message}</p>
      </section>

      <section className="section">
        <h2>Our Services</h2>

        <div className="cards">
          <div className="card">
            <h3>Web Development</h3>
            <p>Modern responsive websites.</p>
          </div>

          <div className="card">
            <h3>App Development</h3>
            <p>Cross-platform applications.</p>
          </div>

          <div className="card">
            <h3>UI/UX Design</h3>
            <p>Creative and user-friendly designs.</p>
          </div>
        </div>
      </section>
  
      <Hero />
      <ServicesSection />
       <About />


    </>
  );
}

export default Home;