import { useState } from "react";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import LoginPage from "./pages/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";
import React from 'react';

function App() {
  const [mode, setMode] = useState("light");
  const handelMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };
  return (
    
    <div
      className={` ${
        mode === "light" ? "" : "text-white bg-dark position-fixed h-100 w-100"
      }`}
    >
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-light d-flex align-items-center"
          onClick={handelMode}
        >
          {" "}
          {mode === "light" ? <FaRegMoon /> : <GoSun />}
        </button>
      </div>
      {/* <ForgetPasswordPage /> */}
      <LoginPage />
      
      
    </div>
    
  );
}

export default App;
