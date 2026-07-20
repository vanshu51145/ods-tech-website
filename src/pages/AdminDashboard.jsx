import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { CSVLink } from "react-csv";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";


function AdminDashboard() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [analytics, setAnalytics] = useState({
    leadAnalytics: {},
    ticketAnalytics: {},
  });
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
  const leadData = [
    {
      name: "New",
      value: analytics.leadAnalytics.New || 0,
    },
    {
      name: "Contacted",
      value: analytics.leadAnalytics.Contacted || 0,
    },
    {
      name: "Converted",
      value: analytics.leadAnalytics.Converted || 0,
    },
  ];

  const ticketData = [
    {
      status: "Open",
      count: analytics.ticketAnalytics.Open || 0,
    },
    {
      status: "In Progress",
      count: analytics.ticketAnalytics["In Progress"] || 0,
    },
    {
      status: "Resolved",
      count: analytics.ticketAnalytics.Resolved || 0,
    },
  ];

  const COLORS = ["#2563eb", "#f59e0b", "#10b981"];
  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/contact/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
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

        fetchAnalytics();

      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    }
  };
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/admin/analytics",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setAnalytics(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          "https://ods-network-backend.onrender.com/api/contact",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
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

    const fetchTickets = async () => {
      try {

        const response = await fetch(
          "https://ods-network-backend.onrender.com/api/tickets/admin/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        const data = await response.json();

        console.log("TICKETS:", data);

        if (data.success) {
          setTickets(data.tickets);
        }

      } catch (error) {
        console.log(error);
      }
    };


    fetchContacts();
    fetchTickets();
    fetchAnalytics();
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
          <li onClick={() => navigate("/admin/tickets")}>
            🎫 Manage Support Tickets
          </li>
          <li
            onClick={() => navigate("/admin/subscribers")}
          >
            📧 Manage Subscribers
          </li>
          <li
            onClick={() => navigate("/admin/invoices")}
          >
            🧾 Manage Invoices
          </li>
          <li
            onClick={() => navigate("/admin/milestones")}
          >
           📊 Project Milestones
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
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/tickets")}
          >
            <h3>Support Tickets</h3>
            <h1>🎫</h1>
          </div>
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/subscribers")}
          >
            <h3>Manage Subscribers</h3>
            <h1>📧</h1>
          </div>
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/invoices")}
          >
            <h3>Manage Invoices</h3>
            <h1>🧾</h1>

          </div>
           <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/invoices")}
          >
            <h3>Project Milestones</h3>
            <h1>📊</h1>

          </div>

        </div>
        <div className="analytics-header">
          <h2>Analytics Dashboard</h2>
          <p>Overview of Leads and Support Tickets</p>
        </div>
        <div className="charts-container">

          <div className="chart-card">

            <h2>Lead Analytics</h2>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={leadData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {leadData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

          <div className="chart-card">

            <h2>Support Tickets</h2>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={ticketData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="status" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="count"
                  radius={[8, 8, 0, 0]}
                  fill="#2563eb"
                />

              </BarChart>
            </ResponsiveContainer>

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
<div className="table-scroll">
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
    </div>
  );
}

export default AdminDashboard;