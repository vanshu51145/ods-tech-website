import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";
import "./ClientDashboard.css";
import ClientNotification from "../components/ClientNotification";

function ClientDashboard() {
  const navigate = useNavigate();
  const client = JSON.parse(localStorage.getItem("client"));

  useEffect(() => {
    const storedClient = JSON.parse(localStorage.getItem("client"));
    if (!storedClient?._id) return;

    const socket = io(import.meta.env.VITE_API_URL || "https://ods-network-backend.onrender.com");
    socket.emit("join_room", storedClient._id);

    socket.on("appointment_confirmed", (data) => {
      alert(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [client?._id]);

  const logout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("client");
    navigate("/client/login");
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1>Welcome, {client?.name}</h1>
        <div className="header-actions">
          <ClientNotification />
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="cards">
        <div className="card" onClick={() => navigate("/client/tickets")}>
          <h3>Support Tickets</h3>
          <p>Raise and Track Tickets</p>
        </div>
        <div className="card" onClick={() => navigate("/client/invoices")}>
          <h3>My Invoices</h3>
          <p>View & Download Invoice PDFs</p>
        </div>
        <div className="card" onClick={() => navigate("/client/progress")}>
          <h3>📊  Project Progress</h3>
          <p>Track your project milestones</p>
        </div>
        <div className="card" onClick={() => navigate("/client/assets")}>
          <h3>📁 Project Assets</h3>
          <p>Upload and manage your project files and documents</p>
        </div>
        <div className="card" onClick={() => navigate("/client/support")}>
          <h3>Live Support</h3>
          <p>Chat with our support team in real time.</p>
        </div>
        <div className="card" onClick={() => navigate("/client/appointments")}>
          <h3>📅 Book Consultation</h3>
          <p>Schedule a consultation call with our team.</p>
        </div>
      </div>
    </section>
  );
}

export default ClientDashboard;