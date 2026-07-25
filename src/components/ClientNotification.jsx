import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ClientNotification.css";

function ClientNotification() {
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const client = JSON.parse(
    localStorage.getItem("client")
  );

  useEffect(() => {
    if (!client?._id) {
      return;
    }

    const socket = io(
      "https://ods-network-backend.onrender.com"
    );

    // Client apne personal room mein join karega
    socket.emit(
      "join_room",
      client._id
    );

    // Appointment confirmation receive
    socket.on(
      "appointment_confirmed",
      (data) => {

        console.log(
          "Appointment Confirmation Received:",
          data
        );

        const newNotification = {
          id: Date.now(),
          message: data.message,
          appointment: data.appointment,
        };

        setNotifications((prev) => [
          newNotification,
          ...prev,
        ]);

        // Browser alert
        alert(data.message);
      }
    );

    return () => {
      socket.off(
        "appointment_confirmed"
      );

      socket.disconnect();
    };

  }, [client?._id]);


  return (
    <div className="notification-wrapper">

      {/* Notification Bell */}

      <button
        className="notification-btn"
        onClick={() =>
          setNotificationOpen(
            !notificationOpen
          )
        }
      >

        🔔

        {notifications.length > 0 && (

          <span className="notification-count">
            {notifications.length}
          </span>

        )}

      </button>


      {/* Notification Dropdown */}

      {notificationOpen && (

        <div className="notification-dropdown">

          <div className="notification-header">

            <h3>
              Notifications
            </h3>

            {notifications.length > 0 && (

              <button
                onClick={() =>
                  setNotifications([])
                }
              >
                Clear All
              </button>

            )}

          </div>


          {notifications.length === 0 ? (

            <p className="no-notifications">
              No new notifications
            </p>

          ) : (

            <div className="notification-list">

              {notifications.map(
                (notification) => (

                  <div
                    className="notification-item"
                    key={notification.id}
                  >

                    <div className="notification-icon">
                      📅
                    </div>

                    <div>

                      <p>
                        {notification.message}
                      </p>

                      {notification.appointment && (

                        <small>
                          Appointment:{" "}
                          {notification.appointment.timeSlot}
                        </small>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default ClientNotification;