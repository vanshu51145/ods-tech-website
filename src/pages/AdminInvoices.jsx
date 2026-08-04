import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminInvoices.css";
import { invoiceApi } from "../services/api";

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

  const fetchClients = useCallback(async () => {
    try {
      const data = await invoiceApi.getClients();
      if (data.success) {
        setClients(data.clients);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to load clients");
    }
  }, []);

  const fetchInvoices = useCallback(async () => {
    try {
      const data = await invoiceApi.getAll();
      if (data.success) {
        setInvoices(data.invoices);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to load invoices");
    }
  }, []);

  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, [fetchClients, fetchInvoices]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clientId || !formData.invoiceNumber || !formData.amount || !formData.description || !pdf) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("clientId", formData.clientId);
      fd.append("invoiceNumber", formData.invoiceNumber);
      fd.append("amount", formData.amount);
      fd.append("description", formData.description);
      fd.append("status", formData.status);
      fd.append("invoice", pdf);

      const data = await invoiceApi.create(fd);

      if (data.success) {
        toast.success(data.message);
        fetchInvoices();
        setFormData({ clientId: "", invoiceNumber: "", amount: "", description: "", status: "Unpaid" });
        setPdf(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server Error");
    }
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;

    try {
      const data = await invoiceApi.delete(id);
      if (data.success) {
        fetchInvoices();
      } else {
        alert(data.message);
      }
    } catch (err) {
      // console.log("Delete Invoice Error:", err);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>← Dashboard</button>
        <h1>Invoice Management</h1>
        <div className="header-space"></div>
      </div>

      <form className="invoice-form" onSubmit={handleSubmit}>
        <select name="clientId" value={formData.clientId} onChange={handleChange}>
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>{client.name} ({client.company})</option>
          ))}
        </select>
        <input type="text" name="invoiceNumber" placeholder="Invoice Number" value={formData.invoiceNumber} onChange={handleChange} />
        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <input type="file" accept=".pdf" onChange={(e) => setPdf(e.target.files[0])} />
        <button type="submit">Upload Invoice</button>
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
              <tr><td colSpan="6">No invoices found.</td></tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.clientId?.name}</td>
                  <td>{invoice.invoiceNumber}</td>
                  <td>₹{invoice.amount}</td>
                  <td className={invoice.status === "Paid" ? "status-paid" : "status-unpaid"}>{invoice.status}</td>
                  <td><a href={invoice.pdfUrl} target="_blank" rel="noreferrer">Download</a></td>
                  <td>{isSuperAdmin && <button className="delete-btn" onClick={() => deleteInvoice(invoice._id)}>Delete</button>}</td>
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