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


    // Client joins personal room
    socket.emit(
      "join_room",
      client._id
    );


    // Appointment confirmation notification
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

          appointment:
            data.appointment,

        };


        // Add new notification
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


  // =========================
  // Mark Single Notification Read
  // =========================

  const markAsRead = (id) => {

    setNotifications((prev) =>

      prev.filter(
        (notification) =>
          notification.id !== id
      )

    );

  };


  // =========================
  // Clear All Notifications
  // =========================

  const clearAll = () => {

    setNotifications([]);

  };


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


        {/* Notification Badge */}

        {notifications.length > 0 && (

          <span className="notification-count">

            {notifications.length}

          </span>

        )}

      </button>



      {/* Notification Dropdown */}

      {notificationOpen && (

        <div className="notification-dropdown">


          {/* Header */}

          <div className="notification-header">

            <h3>
              Notifications
            </h3>


            {notifications.length > 0 && (

              <button
                className="clear-btn"
                onClick={clearAll}
              >
                Clear All
              </button>

            )}

          </div>



          {/* No Notifications */}

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

                    key={
                      notification.id
                    }

                  >


                    <div className="notification-icon">

                      📅

                    </div>



                    <div className="notification-content">

                      <p>

                        {notification.message}

                      </p>


                      {notification.appointment && (

                        <small>

                          Appointment:{" "}

                          {
                            notification
                              .appointment
                              .timeSlot
                          }

                        </small>

                      )}



                      {/* Mark As Read */}

                      <button

                        className="mark-read-btn"

                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }

                      >

                        ✓ Mark as Read

                      </button>


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