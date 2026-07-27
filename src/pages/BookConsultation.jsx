import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BookConsultation.css";
import ClientNotification from "../components/ClientNotification";
function BookConsultation() {

  const [date, setDate] = useState(new Date());

  const [timeSlot, setTimeSlot] = useState("");

  const [topic, setTopic] = useState("");

  const timeSlots = [
    "10:00 AM",
    "2:00 PM",
    "4:00 PM",
  ];

  const bookAppointment = async () => {

    if (!date || !timeSlot || !topic) {
      alert("Please select date, time slot and enter topic");
      return;
    }

    try {

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/appointments",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },

          body: JSON.stringify({
            date,
            timeSlot,
            topic,
          }),
        }
      );

      const data = await response.json();

      // console.log("APPOINTMENT RESPONSE:", data);

      if (data.success) {

        alert(
          "Consultation booked successfully!"
        );

        setTimeSlot("");
        setTopic("");

      } else {

        alert(data.message);

      }

    } catch (error) {

      // console.log(
      //   "BOOK APPOINTMENT ERROR:",
      //   error
      // );

      alert(
        "Failed to book appointment"
      );

    }
  };

  return (

    <div className="page">

      <div className="consultation-header">

  <h1>
    Book Consultation
  </h1>

  <ClientNotification />

</div>

      <div className="consultation-container">

        <h2>
          Select Consultation Date
        </h2>

        <Calendar
          onChange={setDate}
          value={date}
          minDate={new Date()}
        />

        <p>
          Selected Date:{" "}
          <strong>
            {date.toLocaleDateString()}
          </strong>
        </p>


        <h2>
          Select Time Slot
        </h2>

        <select
          value={timeSlot}
          onChange={(e) =>
            setTimeSlot(e.target.value)
          }
        >

          <option value="">
            Select Time
          </option>

          {timeSlots.map((slot) => (

            <option
              key={slot}
              value={slot}
            >
              {slot}
            </option>

          ))}

        </select>


        <h2>
          Consultation Topic
        </h2>

        <textarea
          placeholder="Enter consultation topic"
          value={topic}
          onChange={(e) =>
            setTopic(e.target.value)
          }
        />


        <button
          onClick={bookAppointment}
        >
          Book Consultation
        </button>

      </div>

    </div>

  );
}

export default BookConsultation;