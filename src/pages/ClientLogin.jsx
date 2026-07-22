import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function ClientLogin() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const login = async (e) => {

    e.preventDefault();

    const response = await fetch(
      "https://ods-network-backend.onrender.com/api/client/login",
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

  console.log("TOKEN BEFORE SAVE:", data.token);

  localStorage.setItem(
    "token",
    data.token
  );

  console.log(
    "TOKEN AFTER SAVE:",
    localStorage.getItem("token", data.token)
  );


  localStorage.setItem(
    "client",
    JSON.stringify(data.client)
  );


  toast.success("Login Successful");

  navigate("/client/dashboard");

}else {

      toast.error(data.message);

    }
  };

  return (
    <section className="page">

      <h1>Client Login</h1>

      <form className="contact-form" onSubmit={login}>

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

        <button>Login</button>

        <p>
          New Client?{" "}
          <Link to="/client/register">
            Register
          </Link>
        </p>

      </form>

    </section>
  );
}

export default ClientLogin;