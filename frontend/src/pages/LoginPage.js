import React, { useState } from "react";

export default function LoginPage() {
  return (
    <div
      className={`position-fixed h-100 w-100 d-flex justify-content-center align-items-center `}
    >
      <div className={` border rounded p-3 col-md-4`}>
        <h1 className="text-center">LOGIN</h1>
        <div className="py-3">
          <label>email</label>
          <input
            className="form-control"
            type="email"
            placeholder="joe@exemple.com"
          />
        </div>
        <div className="pb-3">
          <label>password</label>
          <input
            className="form-control"
            type="password"
            placeholder="password"
          />
        </div>
        <div className="text-center">
          <button className="btn btn-light ">Login</button>
        </div>
        <div className="text-center p-3">
          <a href="">Forget Password</a>
        </div>
      </div>
    </div>
  );
}
