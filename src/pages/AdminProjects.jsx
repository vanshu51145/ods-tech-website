import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProjects.css";

function AdminProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const adminRole = localStorage.getItem("adminRole");
const isSuperAdmin = adminRole === "SuperAdmin";

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("https://ods-network-backend.onrender.com/api/projects");

      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err) {
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addProject = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please Select Image");
      return;
    }

    setLoading(true);

    try {
      const sendData = new FormData();

      sendData.append("title", formData.title);
      sendData.append("category", formData.category);
      sendData.append("description", formData.description);
      sendData.append("image", image);

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/projects",
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: sendData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Project Added Successfully");

        setFormData({
          title: "",
          category: "",
          description: "",
        });

        setImage(null);

        document.getElementById("imageInput").value = "";

        fetchProjects();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something Went Wrong");
    }

    setLoading(false);
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchProjects();
      }
    } catch (err) {
    }
  };

  return (
    <div className="projects-page">
      <div className="projects-top">
        <h1>Manage Projects</h1>

        <button
          className="back-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          Dashboard
        </button>
      </div>

      <form className="project-form" onSubmit={addProject}>
        <input
          type="text"
          placeholder="Project Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          placeholder="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <textarea
          placeholder="Description"
          rows="5"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button type="submit">
          {loading ? "Uploading..." : "Add Project"}
        </button>
      </form>

      <div className="table-box">
        <h2>All Projects</h2>

        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="5">No Projects Found</td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project._id}>
                  <td>
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      width="90"
                    />
                  </td>

                  <td>{project.title}</td>

                  <td>{project.category}</td>

                  <td>{project.description}</td>

                  <td>
                    {isSuperAdmin && (
                    <button
                      className="delete-btn"
                      onClick={() => deleteProject(project._id)}
                    >
                      Delete
                    </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProjects;