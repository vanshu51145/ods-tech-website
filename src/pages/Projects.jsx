import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import "./Projects.css";

function Projects() {
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
          content="View ODS Tech completed projects, web development work and digital solutions portfolio."
        />
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
      </section>
    </>
  );
}

export default Projects;