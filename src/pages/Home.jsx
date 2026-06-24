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
      <ServicesSection />
       <About />


    </>
  );
}

export default Home;