import Hero from "../components/Hero";
import About from "../components/About";
import ServicesSection from "../components/ServicesSection";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import { Helmet } from "react-helmet-async";

function Home() {
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

      <FAQ />
    </>
  );
}

export default Home;