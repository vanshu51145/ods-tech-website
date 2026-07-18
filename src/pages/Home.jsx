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
      content="ODS Network provides Web Development, Mobile App Development, SEO, Digital Marketing, UI/UX Design, Cloud Solutions and IT Consulting services."
    />

    <meta
      name="keywords"
      content="Web Development, Mobile App Development, SEO, Digital Marketing, UI UX Design, Software Company, ODS Network"
    />

    <meta name="author" content="ODS Network" />
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