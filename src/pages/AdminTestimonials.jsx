import { useEffect, useState } from "react";
import "./AdminTestimonials.css";

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    console.log(
"TOKEN:",
localStorage.getItem("token")
);
    try {
      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/admin/testimonials",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setTestimonials(data.testimonials);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const approveReview = async (id) => {
    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/admin/testimonials/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      alert(data.message);

      fetchTestimonials();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/admin/testimonials/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      alert(data.message);

      fetchTestimonials();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-testimonials">

      <h2>Manage Testimonials</h2>

      <div className="testimonial-table">

        <table>

          <thead>

            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {testimonials.map((item) => (

              <tr key={item._id}>

                <td>{item.clientName}</td>

                <td>{item.company}</td>

                <td>{"⭐".repeat(item.rating)}</td>

                <td>
                  {item.isApproved ? "Approved" : "Pending"}
                </td>

                <td>

                  {!item.isApproved && (
                    <button
                      className="approve-btn"
                      onClick={() => approveReview(item._id)}
                    >
                      Approve
                    </button>
                  )}

                  <button
                    className="delete-btn"
                    onClick={() => deleteReview(item._id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminTestimonials;