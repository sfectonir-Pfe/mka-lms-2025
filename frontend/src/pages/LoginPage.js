import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from 'axios'

function LoginPage({setUser}) {
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const handleRequest = async (e) => {
    try {
        
        e.preventDefault();
        const response= await axios.post('http://localhost:8000/auth/login',{password,email})
        setUser(response.data)
        localStorage.setItem('user',JSON.stringify(response.data))
    } catch (error) {
        
    }
    
  };
  return (
    <div className="container-fluid p-3 my-5">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Sample"
          />
        </div>

        <div className="col-md-6">
          <form onSubmit={handleRequest}> 
            <div className="form-floating mb-4">
              <input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="form-control"
                id="email"
                placeholder="Email"
              />
              <label htmlFor="email">Email address</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="form-control"
                id="password"
                placeholder="Password"
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                />
                <label className="form-check-label" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <div className="text-center text-md-start mt-4 pt-2">
              <button type="submit" className="btn btn-primary px-5" onSubmit={handleRequest}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
