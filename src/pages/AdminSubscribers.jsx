import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import "./AdminSubscribers.css";
import { subscriberApi } from "../services/api";

function AdminSubscribers() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);

  const fetchSubscribers = useCallback(async () => {
    try {
      const data = await subscriberApi.getAll();
      if (data.success) {
        setSubscribers(data.subscribers);
      }
    } catch (err) {
      // console.log("fetchSubscribers error:", err);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const csvData = subscribers.map((subscriber) => ({
    Email: subscriber.email,
    Date: new Date(subscriber.subscribedAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <section className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>← Back to Dashboard</button>
        <h1>Manage Subscribers</h1>
        <CSVLink data={csvData} filename="ODS-Subscribers.csv" className="export-btn">Export CSV</CSVLink>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Subscribed Date</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr><td colSpan="2">No Subscribers Found</td></tr>
            ) : (
              subscribers.map((subscriber) => (
                <tr key={subscriber._id}>
                  <td>{subscriber.email}</td>
                  <td>{new Date(subscriber.subscribedAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminSubscribers;