import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAppointments.css";

function AdminAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Appointments
  // =========================
  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/appointments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      console.log("APPOINTMENTS:", data);

      if (data.success) {
        setAppointments(data.appointments || []);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(
        "FETCH APPOINTMENTS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Confirm Appointment
  // =========================
  const confirmAppointment = async (id) => {
    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/appointments/${id}/confirm`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      console.log("CONFIRM RESPONSE:", data);

      if (data.success) {
        alert("Appointment Confirmed Successfully");

        // Update UI immediately
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === id
              ? {
                  ...appointment,
                  status: "Confirmed",
                }
              : appointment
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(
        "CONFIRM APPOINTMENT ERROR:",
        error
      );

      alert("Failed to confirm appointment");
    }
  };

  // =========================
  // Load Appointments
  // =========================
  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="page">

      {/* Header */}
      <div className="page-header">

        <h1>
          Appointments
        </h1>

        <button
          className="dashboard-btn"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          Dashboard
        </button>

      </div>


      {/* Appointment Table */}
      <div className="table-container">

        <h2>
          Consultation Requests
        </h2>

        {loading ? (

          <p>
            Loading appointments...
          </p>

        ) : appointments.length === 0 ? (

          <p>
            No appointments found.
          </p>

        ) : (

          <div className="table-scroll">

            <table>

              <thead>

                <tr>

                  <th>
                    Client
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Time Slot
                  </th>

                  <th>
                    Topic
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {appointments.map(
                  (appointment) => (

                    <tr
                      key={
                        appointment._id
                      }
                    >

                      <td>
                        {
                          appointment.clientId
                            ?.name ||
                          "Unknown Client"
                        }
                      </td>


                      <td>
                        {
                          appointment.clientId
                            ?.email ||
                          "N/A"
                        }
                      </td>


                      <td>
                        {new Date(
                          appointment.date
                        ).toLocaleDateString()}
                      </td>


                      <td>
                        {
                          appointment.timeSlot
                        }
                      </td>


                      <td>
                        {
                          appointment.topic
                        }
                      </td>


                      <td>

                        <span
                          className={
                            appointment.status ===
                            "Confirmed"
                              ? "status confirmed"
                              : "status pending"
                          }
                        >
                          {
                            appointment.status
                          }
                        </span>

                      </td>


                      <td>

                        {appointment.status ===
                        "Pending" ? (

                          <button
                            className="confirm-btn"
                            onClick={() =>
                              confirmAppointment(
                                appointment._id
                              )
                            }
                          >
                            Confirm
                          </button>

                        ) : (

                          <span>
                            ✅ Confirmed
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminAppointments;