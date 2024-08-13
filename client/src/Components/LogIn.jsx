import React, { useState } from "react";
import Axios from "axios"
import { useNavigate,Link } from "react-router-dom";
const LogIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  Axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:3000/auth/login',formData).then(response=>{
        if(response.data.status){
        navigate("/ ");}
    }).catch(err=>{
        console.log(err);
    })

    setFormData({
      email: "",
      password: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="sign-up-container">
      <form onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          autoComplete="off"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
        <p>Don't Have Account? <Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default LogIn;
