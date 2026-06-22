import { useEffect, useState } from "react";

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
      <section className="hero">
        <div className="hero-content">
          <h1>Transforming Ideas Into Digital Reality</h1>

          <p>
            We build scalable websites, web applications
            and innovative digital solutions for businesses.
          </p>

          <button>Get Started</button>

          <h3 style={{ marginTop: "20px", color: "white" }}>
            {message}
          </h3>
        </div>
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
    </>
  );
}

export default Home;