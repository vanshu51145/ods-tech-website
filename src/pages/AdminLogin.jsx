import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {

const navigate=useNavigate();

const [formData,setFormData]=useState({

email:"",
password:""

});

const handleChange=(e)=>{

setFormData({

...formData,
[e.target.name]:e.target.value

});

};

const handleSubmit=async(e)=>{

e.preventDefault();

try{

const response=await fetch(
"http://localhost:5000/api/admin/login",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(formData)

}

);

const data=await response.json();

if(data.success){

localStorage.setItem("token",data.token);

navigate("/admin/dashboard");

}else{

alert(data.message);

}

}catch(error){

console.log(error);

}

};

return(

<section className="admin-login">

<div className="login-card">

<div className="admin-logo">
🔐
</div>

<h1>Admin Login</h1>

<p>
Sign in to access the ODS Admin Dashboard
</p>

<form onSubmit={handleSubmit}>

<div className="input-group">

<label>Email</label>

<input
type="email"
name="email"
placeholder="Enter admin email"
value={formData.email}
onChange={handleChange}
required
/>

</div>

<div className="input-group">

<label>Password</label>

<input
type="password"
name="password"
placeholder="Enter password"
value={formData.password}
onChange={handleChange}
required
/>

</div>

<button
className="login-btn"
type="submit"
>

Login

</button>

</form>

</div>

</section>

);

}

export default AdminLogin;