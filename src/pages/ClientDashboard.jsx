import { useNavigate } from "react-router-dom";

function ClientDashboard() {
  const navigate = useNavigate();

  const client = JSON.parse(
    localStorage.getItem("client")
  );

  return (
    <section className="page">

      <h1>Welcome, {client?.name}</h1>

      <div className="cards">

        <div
          className="card"
          onClick={() => navigate("/client/tickets")}
        >
          <h3>Support Tickets</h3>
          <p>Raise and Track Tickets</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/client/invoices")}
        >
          <h3>My Invoices</h3>
          <p>View & Download Invoice PDFs</p>
        </div>

      </div>

    </section>
  );
}

export default ClientDashboard;