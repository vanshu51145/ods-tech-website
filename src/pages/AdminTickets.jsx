import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminTickets.css";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");
const navigate = useNavigate();
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
         console.log(
      "TOKEN:",
      localStorage.getItem("token")
    );
     const response = await fetch(
  "https://ods-network-backend.onrender.com/api/tickets/admin/all",
  {
    headers: {
Authorization: `Bearer ${localStorage.getItem("adminToken")}`,    },
  }
);
      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
    const response = await fetch(
  `https://ods-network-backend.onrender.com/api/tickets/${id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("adminToken")}`,    },
    body: JSON.stringify({
      status,
    }),
  }
);

      const data = await response.json();

      if (data.success) {
        toast.success("Status Updated");
        fetchTickets();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    }
  };

  const filteredTickets =
    filter === "All"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filter);

  return (
    <section className="page">

<div className="page-header">
  <button
    className="back-btn"
    onClick={() => navigate("/admin/dashboard")}
  >
    ← Back to Dashboard
  </button>

  <h1>Manage Support Tickets</h1>
</div>
      <div className="filter-box">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Tickets</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="table-container">

        <table className="ticket-table">

          <thead>

            <tr>
              <th>Client ID</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Update</th>
            </tr>

          </thead>

          <tbody>

            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="5">
                  No Tickets Found
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket._id}>

                  <td>{ticket.clientId}</td>

                  <td>{ticket.subject}</td>

                  <td>{ticket.priority}</td>

                  <td>{ticket.status}</td>

                  <td>

                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        updateStatus(
                          ticket._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Open">
                        Open
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                    </select>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default AdminTickets;