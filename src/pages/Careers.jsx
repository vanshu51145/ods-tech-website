import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Careers() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: null,
  });

  useEffect(() => {
    fetch("https://ods-network-backend.onrender.com/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJobs(data.jobs);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "resume") {
      setFormData({
        ...formData,
        resume: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      toast.error("Please upload Resume");
      return;
    }

    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("jobId", selectedJob);
    data.append("resume", formData.resume);

    try {
      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/jobs/apply",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);

        setFormData({
          name: "",
          email: "",
          resume: null,
        });

        setSelectedJob("");
        setShowForm(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    }
  };

  return (
    <section className="page">

      <h1>Careers</h1>
      <p className="career-subtitle">
Join our growing team and build amazing digital products with ODS Network.
</p>

      {jobs.length === 0 ? (
        <p>No openings available right now.</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className="career-card">

            <h2>{job.title}</h2>

            <p>{job.description}</p>

            <h4>{job.type}</h4>

            <button
              onClick={() => {
                setSelectedJob(job._id);
                setShowForm(true);
              }}
            >
              Apply Now
            </button>

          </div>
        ))
      )}

      {showForm && (
        <div className="modal-overlay">

          <div className="modal">

            <h2>Apply for Job</h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="file"
                name="resume"
                accept=".pdf"
                onChange={handleChange}
                required
              />

              <div className="modal-buttons">

                <button type="submit">
                  Submit Application
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedJob("");
                    setFormData({
                      name: "",
                      email: "",
                      resume: null,
                    });
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </section>
  );
}

export default Careers;