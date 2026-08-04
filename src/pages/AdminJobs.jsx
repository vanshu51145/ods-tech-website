import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminJobs.css";
import { jobApi } from "../services/api";

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

  const fetchJobs = useCallback(async () => {
    try {
      const data = await jobApi.getAll();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      // console.log(err);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const data = await jobApi.getApplications();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      // console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [fetchJobs, fetchApplications]);

  const handleChange = (e) => {
    setJob((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let data;
      if (editId) {
        data = await jobApi.update(editId, job);
      } else {
        data = await jobApi.create(job);
      }

      if (data.success) {
        toast.success(editId ? "Job Updated Successfully" : "Job Posted Successfully");
        setJob({ title: "", description: "", type: "Internship" });
        setEditId(null);
        fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server Error");
    }
  };

  const toggleJob = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`, {
        method: "PUT",
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server Error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="page">
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        marginBottom: "20px", padding: "30px 0px", position: "relative",
      }}>
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            position: "absolute", display: "flex", alignItems: "center", left: "0",
            padding: "10px 20px", border: "none", gap: "8px", borderRadius: "10px",
            background: "#2563eb", color: "white", fontSize: "15px", cursor: "pointer", transition: ".3s",
          }}
        >
          ← Dashboard
        </button>
        <h1 style={{ fontSize: "42px", fontWeight: "800", color: "#2563eb", margin: "0", letterSpacing: "-1px" }}>
          {editId ? "Edit Job" : "Post New Job"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="job-form">
        <input type="text" name="title" placeholder="Job Title" value={job.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Job Description" rows="6" value={job.description} onChange={handleChange} required />
        <select name="type" value={job.type} onChange={handleChange}>
          <option value="Internship">Internship</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
        </select>
        <button type="submit">{editId ? "Update Job" : "Post Job"}</button>
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
            <tr><td colSpan="4" style={{ textAlign: "center" }}>No Jobs Found</td></tr>
          ) : (
            jobs.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.type}</td>
                <td>{item.isActive ? "🟢 Active" : "🔴 Closed"}</td>
                <td>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button onClick={() => toggleJob(item._id)}>
                      {item.isActive ? "Close Job" : "Open Job"}
                    </button>
                    <button onClick={() => {
                      setEditId(item._id);
                      setJob({ title: item.title, description: item.description, type: item.type });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}>
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
            <tr><td colSpan="4" style={{ textAlign: "center" }}>No Applications Found</td></tr>
          ) : (
            applications.map((app) => (
              <tr key={app._id}>
                <td>{app.name}</td>
                <td>{app.email}</td>
                <td>{app.jobId?.title || "Job Deleted"}</td>
                <td><a href={app.resume} target="_blank" rel="noreferrer">View Resume</a></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminJobs;