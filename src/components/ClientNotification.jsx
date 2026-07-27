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

    // Client personal room join
    socket.emit(
      "join_room",
      client._id
    );

    // Appointment confirmation
    socket.on(
      "appointment_confirmed",
      (data) => {

        // console.log(
        //   "Appointment Confirmation Received:",
        //   data
        // );

        const newNotification = {
          id: Date.now(),
          message: data.message,
          appointment: data.appointment,
          read: false,
        };

        setNotifications((prev) => [
          newNotification,
          ...prev,
        ]);

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
  // Mark Single Notification as Read
  // =========================

  const markAsRead = (id) => {

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );

  };


  // =========================
  // Mark All as Read
  // =========================

  const markAllAsRead = () => {

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

  };


  // =========================
  // Clear All Notifications
  // =========================

  const clearAll = () => {

    setNotifications([]);

  };


  // =========================
  // Unread Count
  // =========================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;


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

        {unreadCount > 0 && (

          <span className="notification-count">
            {unreadCount}
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

            <div className="notification-actions">

              {unreadCount > 0 && (

                <button
                  onClick={markAllAsRead}
                  className="mark-all-btn"
                >
                  Mark All as Read
                </button>

              )}

              {notifications.length > 0 && (

                <button
                  onClick={clearAll}
                  className="clear-btn"
                >
                  Clear All
                </button>

              )}

            </div>

          </div>


          {/* No Notifications */}

          {notifications.length === 0 ? (

            <p className="no-notifications">
              No notifications
            </p>

          ) : (

            <div className="notification-list">

              {notifications.map(
                (notification) => (

                  <div
                    className={`notification-item ${
                      notification.read
                        ? "read"
                        : "unread"
                    }`}
                    key={notification.id}
                  >

                    {/* Icon */}

                    <div className="notification-icon">
                      📅
                    </div>


                    {/* Content */}

                    <div className="notification-content">

                      <p>
                        {notification.message}
                      </p>


                      {notification.appointment && (

                        <small>
                          Appointment:{" "}
                          {
                            notification.appointment
                              .timeSlot
                          }
                        </small>

                      )}


                      {/* Mark as Read */}

                      {!notification.read && (

                        <button
                          className="mark-read-btn"
                          onClick={() =>
                            markAsRead(
                              notification.id
                            )
                          }
                        >
                          Mark as Read
                        </button>

                      )}

                      {notification.read && (

                        <span className="read-label">
                          ✓ Read
                        </span>

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