import { useEffect, useState, useCallback } from "react";
import "./AdminTestimonials.css";
import { useNavigate } from "react-router-dom";
import { testimonialApi } from "../services/api";

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const adminRole = localStorage.getItem("adminRole");
  const isSuperAdmin = adminRole === "SuperAdmin";
  const navigate = useNavigate();

  const fetchTestimonials = useCallback(async () => {
    try {
      const data = await testimonialApi.getAdmin();
      if (data.success) {
        setTestimonials(data.testimonials);
      } else {
        alert(data.message);
      }
    } catch (err) {
      // console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const approveReview = async (id) => {
    try {
      const data = await testimonialApi.approve(id);
      alert(data.message);
      fetchTestimonials();
    } catch (err) {
      // console.log(err);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const data = await testimonialApi.delete(id);
      alert(data.message);
      fetchTestimonials();
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <div className="admin-testimonials">
      <div className="admin-testimonials-header">
        <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>← Back to Dashboard</button>
      </div>
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
                <td>{item.isApproved ? "Approved" : "Pending"}</td>
                <td>
                  {!item.isApproved && <button className="approve-btn" onClick={() => approveReview(item._id)}>Approve</button>}
                  {isSuperAdmin && <button className="delete-btn" onClick={() => deleteReview(item._id)}>Delete</button>}
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