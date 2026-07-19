import { useEffect, useState } from "react";
import "./ClientInvoices.css";

function ClientInvoices() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("clientToken");

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/client/invoices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="page">
      <h1>My Invoices</h1>
      <div className="table-wrapper">

      <table>
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Status</th>
            <th>PDF</th>
          </tr>
        </thead>

        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="5">No Invoices Found</td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.invoiceNumber}</td>
                <td>₹{invoice.amount}</td>
                <td>{invoice.description}</td>
                <td>{invoice.status}</td>
                <td>
                  <a
                    href={invoice.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </section>
  );
}

export default ClientInvoices;