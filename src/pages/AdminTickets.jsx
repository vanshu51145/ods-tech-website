import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminTickets.css";
import { ticketApi } from "../services/api";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const fetchTickets = useCallback(async () => {
    try {
      const data = await ticketApi.getAll();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      // console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateStatus = async (id, status) => {
    try {
      const data = await ticketApi.updateStatus(id, status);
      if (data.success) {
        toast.success("Status Updated");
        fetchTickets();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server Error");
    }
  };

  const filteredTickets = filter === "All" ? tickets : tickets.filter((ticket) => ticket.status === filter);

  return (
    <section className="page">
      <div className="page-header" style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        marginBottom: "20px", padding: "30px 0px", position: "relative",
      }}>
        <button className="back-btn" onClick={() => navigate("/admin/dashboard")} style={{
          position: "absolute", display: "flex", alignItems: "center", left: "0",
          padding: "10px 20px", border: "none", gap: "8px", borderRadius: "10px",
          background: "#2563eb", color: "white", fontSize: "15px", cursor: "pointer", transition: ".3s",
        }}>
          ← Back to Dashboard
        </button>
        <h1 style={{ fontSize: "42px", fontWeight: "800", color: "#2563eb", margin: "0", letterSpacing: "-1px" }}>
          Manage Support Tickets
        </h1>
      </div>
      <div className="filter-box">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
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
              <tr><td colSpan="5">No Tickets Found</td></tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.clientId}</td>
                  <td>{ticket.subject}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.status}</td>
                  <td>
                    <select value={ticket.status} onChange={(e) => updateStatus(ticket._id, e.target.value)}>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
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