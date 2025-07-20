import React, { useState, useEffect } from 'react';
import { Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return visible ? (
    <Fab
      color="primary"
      onClick={scrollToTop}
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 999,
        boxShadow: 3,
      }}
    >
      <KeyboardArrowUpIcon />
    </Fab>
  ) : null;
}
