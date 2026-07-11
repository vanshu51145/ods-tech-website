import { Helmet } from "react-helmet-async";
import "./Resources.css";

function Resources() {
  const resources = [
    {
      title: "Google Developers",
      link: "https://developers.google.com",
      description:
        "Official Google documentation for web, Android, cloud, and AI development.",
    },
    {
      title: "MDN Web Docs",
      link: "https://developer.mozilla.org",
      description:
        "Comprehensive documentation for HTML, CSS, JavaScript, and modern web technologies.",
    },
    {
      title: "React Documentation",
      link: "https://react.dev",
      description:
        "Official React documentation for building modern user interfaces.",
    },
    {
      title: "Node.js",
      link: "https://nodejs.org",
      description:
        "Official Node.js documentation for backend development.",
    },
    {
      title: "MongoDB",
      link: "https://www.mongodb.com",
      description:
        "Official MongoDB database documentation and resources.",
    },
    {
      title: "Google Search Central",
      link: "https://developers.google.com/search",
      description:
        "SEO best practices and search optimization guides from Google.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Resources | ODS Network</title>

        <meta
    name="description"
    content="Explore trusted web development, SEO, React, Node.js, MongoDB, and Google resources recommended by ODS Network."
  />

  <meta
    name="keywords"
    content="Web Development Resources, React, Node.js, MongoDB, SEO Resources, Google Developers, MDN, ODS Network"
  />

  <meta name="author" content="ODS Network" />

  <meta
    property="og:title"
    content="Resources | ODS Network"
  />

  <meta
    property="og:description"
    content="Trusted technology resources for web development, cloud computing, SEO, and software engineering."
  />

  <meta property="og:type" content="website" />

  <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="page">
<h1>Learning Resources & Technology Partners</h1>
        <p
          style={{
            textAlign: "center",
            maxWidth: "750px",
            margin: "20px auto 50px",
            lineHeight: "1.8",
          }}
        >
         ODS Network recommends these trusted industry resources for web
  development, software engineering, cloud computing, UI/UX design,
  search engine optimization, and modern digital technologies.
        </p>

        <div className="cards">
          {resources.map((item, index) => (
            <div className="card" key={index}>
              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="service-btn"
              >
Visit Official Website →
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Resources;