import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ClientDashboard.css";
import ClientNotification from "../components/ClientNotification";
function ClientDashboard() {

  const navigate = useNavigate();

const [notifications, setNotifications] = useState([]);
const [notificationOpen, setNotificationOpen] = useState(false);
  const client = JSON.parse(
    localStorage.getItem("client")
  );
useEffect(() => {
   const client = JSON.parse(
    localStorage.getItem("client")
  );
  if (!client?._id) return;

  const socket = io(
    "https://ods-network-backend.onrender.com"
  );

  // Client apne room mein join karega
  socket.emit("join_room", client._id);

  // Appointment confirmation notification
  socket.on(
    "appointment_confirmed",
    (data) => {
      alert(data.message);

      // console.log(
      //   "Appointment Confirmed:",
      //   data.appointment
      // );
       setNotifications((prev) => [
        {
          id: Date.now(),
          message: data.message,
          appointment: data.appointment,
        },
        ...prev,
      ]);
    }
  );
  

  return () => {
    socket.disconnect();
  };
}, [client?._id]);

  const logout = () => {

    localStorage.removeItem("token", data.token);
    localStorage.removeItem("client");

    navigate("/client/login");

  };


  return (

    <section className="page">


<div className="page-header">

  <h1>
    Welcome, {client?.name}
  </h1>

  <div className="header-actions">

    <ClientNotification />

    <button
      className="logout-btn"
      onClick={logout}
    >
      Logout
    </button>

  </div>

</div>



      <div className="cards">


        <div
          className="card"
          onClick={() => navigate("/client/tickets")}
        >

          <h3>
            Support Tickets
          </h3>

          <p>
            Raise and Track Tickets
          </p>

        </div>



        <div
          className="card"
          onClick={() => navigate("/client/invoices")}
        >

          <h3>
            My Invoices
          </h3>

          <p>
            View & Download Invoice PDFs
          </p>

        </div>



        <div
          className="card"
          onClick={() => navigate("/client/progress")}
        >

          <h3>
            📊  Project Progress
          </h3>

          <p>
            Track your project milestones
          </p>

        </div>
        <div
          className="card"
          onClick={() => navigate("/client/support")}
        >
          <h3>Live Support</h3>
          <p>
            Chat with our support team in real time.
          </p>
        </div>
        <div
  className="card"
  onClick={() => navigate("/client/appointments")}
>
  <h3>📅 Book Consultation</h3>

  <p>
    Schedule a consultation call with our team.
  </p>
</div>
        


      </div>


    </section>

  );

}


export default ClientDashboard;