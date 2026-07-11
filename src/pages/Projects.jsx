import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import "./Projects.css";
import { useNavigate } from "react-router-dom";


function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;

  useEffect(() => {
    fetchProjects();
  }, [search, page]);

  const fetchProjects = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/projects?search=${encodeURIComponent(
          search
        )}&page=${page}&limit=${limit}`
      );

      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (project) => project.category === activeCategory
        );

  return (
    <>
      <Helmet>
        <title>ODS Tech Projects | Portfolio</title>

        <meta
    name="description"
    content="Explore ODS Network's portfolio of successful web development, mobile app development, UI/UX design, SEO, digital marketing, and cloud solution projects delivered for businesses."
  />

  <meta
    name="keywords"
    content="ODS Network Projects, Web Development Portfolio, Mobile App Portfolio, Software Development, UI UX Design, SEO Projects, Digital Marketing Projects, IT Solutions"
  />

  <meta name="author" content="ODS Network" />

  <meta
    property="og:title"
    content="Projects | ODS Network Portfolio"
  />

  <meta
    property="og:description"
    content="Browse our portfolio of innovative web development, mobile applications, SEO, digital marketing, cloud solutions, and IT consulting projects."
  />

  <meta property="og:type" content="website" />

  <meta
    property="og:image"
    content="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  />

  <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="projects-page">
        <h1>Our Projects</h1>

        <p className="projects-subtitle">
          Explore our latest digital solutions built for businesses.
        </p>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Categories */}
        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <h2 className="loading-text">Loading...</h2>
        ) : filteredProjects.length === 0 ? (
          <h2 className="loading-text">No Projects Found</h2>
        ) : (
          <>
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project._id}
                  className="project-card"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="project-image"
                    loading="lazy"
                  />

                  <div className="project-content">
                    <span className="category">
                      {project.category}
                    </span>

                    <h3>{project.title}</h3>

                    <p>{project.description}</p>
                    <button
  className="project-btn"
  onClick={() => navigate("/contact")}
>
  Start Your Project
</button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={
                    page === index + 1 ? "active-page" : ""
                  }
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
        <div className="project-cta">
  <h2>Ready to Build Your Next Project?</h2>

  <p>
    Whether you need a business website, mobile app, SEO, or digital
    marketing, ODS Network is here to help you achieve your goals.
  </p>

  <div className="project-cta-buttons">
    <button
      className="primary-btn"
      onClick={() => navigate("/services")}
    >
      Explore Services
    </button>

    <button
      className="secondary-btn"
      onClick={() => navigate("/contact")}
    >
      Contact Us
    </button>
  </div>
</div>
      </section>
    </>
  );
}

export default Projects;