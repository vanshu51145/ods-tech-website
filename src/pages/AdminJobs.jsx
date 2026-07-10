import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminJobs.css"

function AdminJobs() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    description: "",
    type: "Internship",
  });

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/jobs"
      );

      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/applications",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editId
        ? `https://ods-network-backend.onrender.com/api/jobs/edit/${editId}`
        : "https://ods-network-backend.onrender.com/api/jobs";

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(job),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editId ? "Job Updated Successfully" : "Job Posted Successfully");

        setJob({
          title: "",
          description: "",
          type: "Internship",
        });

        setEditId(null);

        fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    }
  };

  const toggleJob = async (id) => {
    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/jobs/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="page">

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px ",
          padding:"30px 0px",
                    position:"relative",

        }}
      >
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            position: "absolute",
            display:"flex",
            alignItems:"center",
  left:"0",

  padding: "10px 20px",
  border: "none",
  gap:"8px",
  borderRadius: "10px",
  border:"none",

  background: "#2563eb",
  color: "white",

  fontsize: "15px",
  cursor: "pointer",
  transition: ".3s",
          }}
        >
          ← Dashboard
        </button>

        <h1
        style={
            {
                fontsize: "42px",
  fontweight: "800",
  color: "#2563eb",
  margin: "0",
  letterSpacing:"-1px",
            }
        }>{editId ? "Edit Job" : "Post New Job"}</h1>

       
      </div>

      <form onSubmit={handleSubmit} className="job-form">

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          rows="6"
          value={job.description}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={job.type}
          onChange={handleChange}
        >
          <option value="Internship">Internship</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
        </select>

        <button type="submit">
          {editId ? "Update Job" : "Post Job"}
        </button>

      </form>

      <hr style={{ margin: "40px 0" }} />

      <h2>Posted Jobs</h2>

      <table className="job-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
                      {jobs.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No Jobs Found
              </td>
            </tr>
          ) : (
            jobs.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>

                <td>{item.type}</td>

                <td>
                  {item.isActive ? "🟢 Active" : "🔴 Closed"}
                </td>

                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => toggleJob(item._id)}
                    >
                      {item.isActive ? "Close Job" : "Open Job"}
                    </button>

                    <button
                      onClick={() => {
                        setEditId(item._id);

                        setJob({
                          title: item.title,
                          description: item.description,
                          type: item.type,
                        });

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <hr style={{ margin: "40px 0" }} />

      <h2>Job Applications</h2>

      <table className="job-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Applied For</th>
            <th>Resume</th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No Applications Found
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app._id}>
                <td>{app.name}</td>

                <td>{app.email}</td>

                <td>{app.jobId?.title || "Job Deleted"}</td>

                <td>
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default AdminJobs;