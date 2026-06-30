import { Helmet } from "react-helmet-async";

function About() {
  return (
    <>
      <Helmet>
        <title>
          About ODS Tech | Our Company
        </title>

        <meta
          name="description"
          content="Learn about ODS Tech, our mission, vision and technology services for businesses."
        />
      </Helmet>


      <section className="page">
        <h1>About ODS Network</h1>

        <div className="about-content">

          <p>
            ODS Network is a technology-driven company dedicated to
            providing innovative digital solutions for businesses of all sizes.
            We specialize in building modern websites, web applications,
            mobile apps, and digital marketing strategies that help brands
            grow in the digital world.
          </p>

          <p>
            Our team focuses on delivering high-quality, scalable, and
            user-friendly solutions using the latest technologies.
            We believe in innovation, creativity, and customer satisfaction,
            ensuring that every project meets business goals and user needs.
          </p>

          <p>
            From web development and UI/UX design to SEO and digital
            marketing, ODS Network provides end-to-end services that
            help organizations establish a strong online presence and
            achieve long-term success.
          </p>


          <div className="about-highlights">

            <div className="highlight-card">
              <h3>Our Mission</h3>
              <p>
                To empower businesses with innovative digital solutions
                that drive growth and success.
              </p>
            </div>


            <div className="highlight-card">
              <h3>Our Vision</h3>
              <p>
                To become a trusted technology partner for businesses
                worldwide by delivering exceptional digital experiences.
              </p>
            </div>


            <div className="highlight-card">
              <h3>Our Values</h3>
              <p>
                Innovation, Quality, Transparency, and Customer
                Satisfaction are at the core of everything we do.
              </p>
            </div>


          </div>

        </div>

      </section>
    </>
  );
}

export default About;