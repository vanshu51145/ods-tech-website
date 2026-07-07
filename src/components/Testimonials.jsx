import { useEffect, useState } from "react";
import "./Testimonials.css";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/testimonials"
      );

      const data = await response.json();

      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <section className="testimonials-section">

      <div className="container">

        <h2>What Our Clients Say</h2>

        <p className="subtitle">
          Trusted by businesses across different industries.
        </p>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : testimonials.length === 0 ? (
          <p className="loading">No Reviews Yet</p>
        ) : (
          <div className="testimonial-grid">

            {testimonials.map((item) => (

              <div className="testimonial-card" key={item._id}>

                <div className="stars">
                  {"⭐".repeat(item.rating)}
                </div>

                <p className="feedback">
                  "{item.feedback}"
                </p>

                <h3>{item.clientName}</h3>

                <span>{item.company}</span>

              </div>

            ))}

          </div>
        )}

      </div>

    </section>
  );
}

export default Testimonials;