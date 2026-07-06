import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import "./Projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const fetchProjects = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/projects?search=${encodeURIComponent(
          search
        )}`
      );

      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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

        {/* Search Bar */}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}

        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category ? "active" : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <h2 style={{ textAlign: "center" }}>
            Loading...
          </h2>
        ) : (
          <div className="projects-grid">
            {filteredProjects.length === 0 ? (
              <h2>No Projects Found</h2>
            ) : (
              filteredProjects.map((project) => (
                <motion.div
                  key={project._id}
                  className="project-card"
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
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
              ))
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default Projects;