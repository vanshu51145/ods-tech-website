import { useEffect, useState } from "react";
import "./Testimonials.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ReviewModal from "./ReviewModal";
import "./ReviewModal.css";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [openModal, setOpenModal] = useState(false);

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
  };

  return (
    <section className="testimonials-section">

      <div className="testimonial-header">

        <div>
          <h2>What Our Clients Say</h2>

          <p>
            Trusted by businesses across different industries.
          </p>
        </div>

        <button
          className="review-btn"
          onClick={() => setOpenModal(true)}
        >
          Leave a Review
        </button>

      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
      >
        {testimonials.map((item) => (
          <SwiperSlide key={item._id}>

            <div className="testimonial-card">

              <div className="stars">
                {"⭐".repeat(item.rating)}
              </div>

              <p className="feedback">
                "{item.feedback}"
              </p>

              <h3>{item.clientName}</h3>

              <span>{item.company}</span>

            </div>

          </SwiperSlide>
        ))}
      </Swiper>

      {openModal && (
        <ReviewModal
          closeModal={() => setOpenModal(false)}
          refreshTestimonials={fetchTestimonials}
        />
      )}

    </section>
  );
}

export default Testimonials;