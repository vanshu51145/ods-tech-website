import { useState } from "react";
import { toast } from "react-toastify";

function Contact() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error(
        "Message must be at least 10 characters"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        toast.error("Failed to submit form");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <h1>Contact Us</h1>

      <form
        className="contact-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <textarea
          rows="5"
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send Message"}
        </button>
      </form>
    </section>
  );
}

export default Contact;