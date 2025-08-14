import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaRegMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button 
      className="btn btn-light d-flex align-items-center" 
      onClick={toggleTheme}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <GoSun /> : <FaRegMoon />}
    </button>
  );
};

export default ThemeToggle;