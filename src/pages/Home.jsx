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
          ODS Network |  Web Development & Digital Solutions
        </title>

        <meta
          name="description"
          content="ODS Network provides professional web development, MERN stack development, software solutions, SEO services, and digital solutions to help businesses grow online."
        />

        <meta
          name="keywords"
          content="ODS Network, Web Development, MERN Stack Development, Software Development, SEO Services, Digital Marketing, UI UX Design, Digital Solutions"
        />

        <meta name="author" content="ODS Network" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "ODS Network",
            url: "https://ods-network.com",
            telephone: "+919801351931",
            address: {
              "@type": "PostalAddress",
              streetAddress: "NH-31, Rahimpur,Shambhu Deep Dharam Kanta",
              addressLocality: "Khagaria",
              addressRegion: "Bihar",
              postalCode: "851204",
              addressCountry: "IN",
            },
            description:
              "ODS Network provides web development, software development, SEO and digital solutions.",
            serviceType: [
              "Web Development",
              "MERN Stack Development",
              "Software Development",
              "SEO Services",
              "Digital Solutions"
            ]
          })}
        </script>
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