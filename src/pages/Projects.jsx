import { useState } from "react";
import { motion } from "framer-motion";
import "./Projects.css";

function Projects() {
  const projects = [
    {
      id: 1,
      title: "Business Website",
      category: "Web Development",
    },
    {
      id: 2,
      title: "Online Store",
      category: "E-Commerce",
    },
    {
      id: 3,
      title: "SEO Campaign",
      category: "Digital Marketing",
    },
    {
      id: 4,
      title: "Portfolio Website",
      category: "Web Development",
    },
    {
      id: 5,
      title: "Fashion Store",
      category: "E-Commerce",
    },
    {
      id: 6,
      title: "Social Media Growth",
      category: "Digital Marketing",
    },
  ];

  const categories = [
    "All",
    "Web Development",
    "E-Commerce",
    "Digital Marketing",
  ];

  const [activeCategory, setActiveCategory] =
    useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (project) =>
            project.category === activeCategory
        );

  return (
    <section className="projects-page">
      <h1>Our Projects</h1>

      <div className="filter-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={
              activeCategory === category
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveCategory(category)
            }
          >
            {category}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            className="project-card"
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <h3>{project.title}</h3>

            <p>{project.category}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Projects;