import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaRegMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button 
      className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} d-flex align-items-center`}
      onClick={toggleTheme}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      style={{ 
        border: darkMode ? '1px solid #fff' : '1px solid #000',
        color: darkMode ? '#fff' : '#000'
      }}
    >
      {darkMode ? <GoSun size={18} /> : <FaRegMoon size={18} />}
    </button>
  );
};

export default ThemeToggle;