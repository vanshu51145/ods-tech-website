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
            const token = localStorage.getItem("token");
            console.log(
                "TOKEN:",
                localStorage.getItem("token")
            );
            const response = await fetch(
                "https://ods-network-backend.onrender.com/api/tickets/admin/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
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

            <div className="page-header"
            style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px ",
          padding: "30px 0px",
          position: "relative",

        }}>
                <button
                    className="back-btn"
                    onClick={() => navigate("/admin/dashboard")}
                    style={{
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        left: "0",

                        padding: "10px 20px",
                        border: "none",
                        gap: "8px",
                        borderRadius: "10px",
                        border: "none",

                        background: "#2563eb",
                        color: "white",

                        fontsize: "15px",
                        cursor: "pointer",
                        transition: ".3s",
                    }}
                >
                    ← Back to Dashboard
                </button>

                <h1
                    style={
                        {
                            fontsize: "42px",
                            fontweight: "800",
                            color: "#2563eb",
                            margin: "0",
                            letterSpacing: "-1px",
                        }
                    }>Manage Support Tickets</h1>
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