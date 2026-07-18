import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function ClientRegister() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "https://ods-network-backend.onrender.com/api/client/register",
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
      navigate("/client/login");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <section className="page">
      <h1>Client Registration</h1>

      <form className="contact-form" onSubmit={register}>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

        <input
          name="company"
          placeholder="Company"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button>Register</button>

        <p>
          Already have an account?{" "}
          <Link to="/client/login">Login</Link>
        </p>

      </form>
    </section>
  );
}

export default ClientRegister;