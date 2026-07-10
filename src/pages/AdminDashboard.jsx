import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { CSVLink } from "react-csv";


function AdminDashboard() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Service Requested", key: "serviceRequested" },
    { label: "Message", key: "message" },
    { label: "Date", key: "createdAt" },
    { label: "Status", key: "status" },
  ];
  const csvData = contacts.map((contact) => ({
    name: contact.name,
    email: contact.email,
    serviceRequested: contact.serviceRequested,
    message: contact.message,
    createdAt: new Date(contact.createdAt).toLocaleDateString(),
    status: contact.status,
  }));
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };
  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/contact/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setContacts((prev) =>
          prev.map((contact) =>
            contact._id === id
              ? { ...contact, status }
              : contact
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          "https://ods-network-backend.onrender.com/api/contact",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setContacts(data.contacts);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="dashboard" id="dashboard">
      <div className={`sidebar ${menuOpen ? "active" : ""}`}>
        <button
          className="close-btn"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>
        <h2>ODS Admin</h2>

        <ul>
          <li><a href="#dashboard">🏠 Dashboard</a></li>
          <li><a href="#messages">📩 Contact Messages</a></li>
          <li onClick={() => navigate("/admin/projects")}>
            📁 Manage Projects
          </li>
          <li onClick={() => navigate("/admin/blogs")}>
            📝 Manage Blogs
          </li>
          <li onClick={() => navigate("/admin/testimonials")}>
            ⭐ Manage Testimonials
          </li>
          <li
            onClick={() => navigate("/admin/jobs")}
          >
            💼 Manage Jobs
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="topbar">

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

          <h1>Admin Dashboard</h1>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

        <div className="cards">
          <div className="card">
            <h3>Total Messages</h3>
            <h1>{contacts.length}</h1>
          </div>

          <div className="card">
            <h3>Today's Messages</h3>
            <h1>
              {
                contacts.filter((contact) => {
                  const today = new Date().toDateString();
                  return (
                    new Date(contact.createdAt).toDateString() === today
                  );
                }).length
              }
            </h1>
          </div>

          <div className="card">
            <h3>Admin Status</h3>
            <h1>Active</h1>
          </div>
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/blogs")}
          >
            <h3>Manage Blogs</h3>
            <h1>📝</h1>
          </div>
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/projects")}
          >
            <h3>Manage Projects</h3>
            <h1>📁</h1>
          </div>
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/testimonials")}
          >
            <h3>Manage Reviews</h3>
            <h1>⭐</h1>
          </div>
          <div
            className="card"
            onClick={() => navigate("/admin/jobs")}
          >
            <h3>Manage Jobs</h3>
            <h1>💼</h1>
          </div>
        </div>

        <div className="table-container" id="messages">
          <div className="table-header">

            <h2>Contact Messages</h2>

            <CSVLink
              data={csvData}
              headers={headers}
              filename="ODS-Leads.csv"
              className="export-btn"
            >
              Export Leads to CSV
            </CSVLink>

          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Service</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan="5">No Messages Found</td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>{contact.name}</td>

                    <td>{contact.email}</td>
                    <td>{contact.serviceRequested}</td>

                    <td>
                      {contact.message.length > 50
                        ? contact.message.substring(0, 50) + "..."
                        : contact.message}
                    </td>

                    <td>
                      {new Date(
                        contact.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td>
                      <select
                        value={contact.status}
                        onChange={(e) =>
                          updateStatus(contact._id, e.target.value)
                        }
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;