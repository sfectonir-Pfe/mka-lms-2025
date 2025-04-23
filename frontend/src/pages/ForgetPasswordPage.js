import React from 'react'

export default function ForgetPasswordPage() {
  return (
    <div className="position-fixed h-100 w-100 bg-dark d-flex justify-content-center align-items-center ">
      <div className="text-white border rounded p-3 col-md-4">
        <h1 className="text-center">Forget Password</h1>
        <div className="py-3">
          <label>email</label>
          <input
            className="form-control"
            type="email"
            placeholder="joe@exemple.com"
          />
        </div>
        
        <div className="text-center">
          <button className="btn btn-light ">send the code</button>
        </div>
        <div className="text-center p-3">
            <a href="">login</a>
        </div>
      </div>
    </div>
  )
}
