import { useState } from "react";
import "./ReviewModal.css";

function ReviewModal({ closeModal, refreshTestimonials }) {
  const [formData, setFormData] = useState({
    clientName: "",
    company: "",
    rating: "",
    feedback: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/testimonials",
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
        alert(data.message);

        setFormData({
          clientName: "",
          company: "",
          rating: "",
          feedback: "",
        });

        refreshTestimonials();
        closeModal();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something Went Wrong");
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="review-modal">

        <button
          className="close-modal"
          onClick={closeModal}
        >
          ✕
        </button>

        <h2>Leave a Review</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="clientName"
            placeholder="Your Name"
            value={formData.clientName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
          />

          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="">Select Rating</option>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>

          <textarea
            rows="5"
            name="feedback"
            placeholder="Write your feedback..."
            value={formData.feedback}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default ReviewModal;