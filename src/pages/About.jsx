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
            ODS Network is a leading technology company committed to
            delivering innovative, reliable, and result-oriented
            digital solutions for businesses of all sizes. We
            specialize in creating modern websites, powerful web
            applications, mobile applications, and strategic digital
            marketing campaigns that help organizations establish a
            strong online presence and achieve sustainable growth.
          </p>

          <p>
            Our experienced team combines creativity, technical expertise,
            and industry best practices to develop scalable, secure, and
            user-friendly solutions tailored to each client's unique
            business objectives. From startups to established enterprises,
            we are dedicated to delivering high-quality services that
            drive measurable results and long-term success.
          </p>

          <p>
            At ODS Network, we offer a comprehensive range of IT services,
            including Web Development, Mobile App Development, UI/UX
            Design, Digital Marketing, Search Engine Optimization (SEO),
            Cloud Solutions, Graphic Design, and IT Consulting. By
            leveraging the latest technologies and innovative strategies,
            we help businesses stay ahead in today's competitive
            digital landscape.
          </p>


          <div className="about-highlights">

            <div className="highlight-card">
              <h3>Our Mission</h3>
              <p>
                Our mission is to empower businesses with innovative,
                scalable, and technology-driven digital solutions that
                enhance operational efficiency, strengthen online
                visibility, and accelerate sustainable business growth.
              </p>
            </div>


            <div className="highlight-card">
              <h3>Our Vision</h3>
              <p>
                Our vision is to become a globally trusted technology partner,
                 recognized for delivering exceptional digital experiences, 
                 innovative solutions, and long-lasting value to businesses 
                 across diverse industries.
              </p>
            </div>


            <div className="highlight-card">
             <h3 style={{ marginBottom: "20px" }}>Our Core Values</h3>

<div style={{ lineHeight: "1.8" }}>
  <p>
    <strong>💡 Innovation:</strong> We embrace creativity and emerging
    technologies to deliver modern, future-ready digital solutions.
  </p>

  <p>
    <strong>⭐ Quality:</strong> We are committed to delivering reliable,
    secure, and high-performance solutions that exceed client expectations.
  </p>

  <p>
    <strong>🤝 Transparency:</strong> We believe in honest communication,
    clear processes, and building long-term relationships through trust.
  </p>

  <p>
    <strong>❤️ Customer Satisfaction:</strong> Our clients are our priority.
    We focus on understanding their business needs and delivering solutions
    that create real value and long-term success.
  </p>
</div>
            </div>


          </div>

        </div>

      </section>
    </>
  );
}

export default About;