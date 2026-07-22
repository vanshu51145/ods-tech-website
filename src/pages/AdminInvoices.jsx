import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminInvoices.css";

function AdminInvoices() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const adminRole = localStorage.getItem("adminRole");
const isSuperAdmin = adminRole === "SuperAdmin";

  const [formData, setFormData] = useState({
    clientId: "",
    invoiceNumber: "",
    amount: "",
    description: "",
    status: "Unpaid",
  });

  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/clients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setClients(data.clients);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load clients");
    }
  };

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/invoices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setInvoices(data.invoices);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load invoices");
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

    if (
      !formData.clientId ||
      !formData.invoiceNumber ||
      !formData.amount ||
      !formData.description ||
      !pdf
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const fd = new FormData();

      fd.append("clientId", formData.clientId);
      fd.append("invoiceNumber", formData.invoiceNumber);
      fd.append("amount", formData.amount);
      fd.append("description", formData.description);
      fd.append("status", formData.status);
      fd.append("invoice", pdf);

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/invoices",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        }
      );

console.log("Status:", response.status);

const data = await response.json();

console.log("Response:", data);
      if (data.success) {
        toast.success(data.message);

        fetchInvoices();

        setFormData({
          clientId: "",
          invoiceNumber: "",
          amount: "",
          description: "",
          status: "Unpaid",
        });

        setPdf(null);

        const fileInput = document.querySelector(
          'input[type="file"]'
        );

        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    }
  };
  const deleteInvoice = async (id) => {
  if (!window.confirm("Delete this invoice?")) return;

  try {
    const response = await fetch(
      `https://ods-network-backend.onrender.com/api/invoices/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      fetchInvoices();
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.log("Delete Invoice Error:", error);
  }
};

  return (
    <div className="page">
      <div className="page-header">
        <button
          className="back-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>

        <h1>Invoice Management</h1>

        <div className="header-space"></div>
      </div>

      <form className="invoice-form" onSubmit={handleSubmit}>
        <select
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
        >
          <option value="">Select Client</option>

          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name} ({client.company})
            </option>
          ))}
        </select>

        <input
          type="text"
          name="invoiceNumber"
          placeholder="Invoice Number"
          value={formData.invoiceNumber}
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setPdf(e.target.files[0])}
        />

        <button type="submit">
          Upload Invoice
        </button>
      </form>

      <div className="table-container">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Invoice No.</th>
              <th>Amount</th>
              <th>Status</th>
              <th>PDF</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="5">No invoices found.</td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.clientId?.name}</td>

                  <td>{invoice.invoiceNumber}</td>

                  <td>₹{invoice.amount}</td>

                  <td
                    className={
                      invoice.status === "Paid"
                        ? "status-paid"
                        : "status-unpaid"
                    }
                  >
                    {invoice.status}
                  </td>

                  <td>
                    <a
                      href={invoice.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  </td>
                  {isSuperAdmin && (
  <button 
                        className="delete-btn"
onClick={() => deleteInvoice(invoice._id)}>
    Delete
  </button>
)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminInvoices;