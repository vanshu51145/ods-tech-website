import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects");
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
    <section className="projects-page">
      <h1>Our Projects</h1>

      <p className="projects-subtitle">
        Explore our latest digital solutions built for businesses.
      </p>

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
        <h2 style={{ textAlign: "center" }}>Loading...</h2>
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
  );
}

export default Projects;