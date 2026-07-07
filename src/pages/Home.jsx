import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import ServicesSection from "../components/ServicesSection";
import { Helmet } from "react-helmet-async";
import TestimonialForm from "../components/TestimonialForm";
import Testimonials from "../components/Testimonials";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://ods-network-backend.onrender.com/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>
          ODS Tech | Professional Web Development Company
        </title>

        <meta
          name="description"
          content="ODS Tech provides professional web development, software solutions and digital services."
        />
      </Helmet>

      <Hero />

      <ServicesSection />

      <About />
      <Testimonials />

      <TestimonialForm />

    </>
  );
}

export default Home;