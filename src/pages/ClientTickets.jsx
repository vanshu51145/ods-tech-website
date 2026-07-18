import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ClientTickets.css";

function ClientTickets() {

  const [tickets, setTickets] = useState([]);

  const [formData, setFormData] = useState({
    clientId: "687a0d1234567890abcdef12",
    subject: "",
    description: "",
    priority: "Low",
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {

    try {

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/tickets"
      );

      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets);
      }

    } catch (error) {

      console.log(error);

    }

  };

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/tickets",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {

        toast.success(data.message);

        setFormData({
          clientId: "687a0d1234567890abcdef12",
          subject: "",
          description: "",
          priority: "Low",
        });

        fetchTickets();

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      console.log(error);

      toast.error("Server Error");

    }

  };

  return (

    <section className="page">

      <h1>Support Tickets</h1>

      <form
        className="contact-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          name="subject"
          placeholder="Ticket Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />

        <textarea
          rows="5"
          name="description"
          placeholder="Describe your issue"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >

          <option value="Low">Low</option>

          <option value="Medium">Medium</option>

          <option value="High">High</option>

        </select>

        <button type="submit">
          Submit Ticket
        </button>

      </form>

      <table className="ticket-table">

        <thead>

          <tr>

            <th>Subject</th>

            <th>Priority</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {tickets.map((ticket) => (

            <tr key={ticket._id}>

              <td>{ticket.subject}</td>

              <td>{ticket.priority}</td>

              <td>{ticket.status}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </section>

  );

}

export default ClientTickets;