import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminDashboard.css";


function AdminDashboard() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
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
  <h3>Manage Testimonials</h3>
  <h1>⭐</h1>
</div>
        </div>

        <div className="table-container" id="messages">
          <h2 style={{ marginBottom: "20px" }}>
            Contact Messages
          </h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan="4">No Messages Found</td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>{contact.name}</td>

                    <td>{contact.email}</td>

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