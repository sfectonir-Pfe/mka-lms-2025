import React from "react";
import { motion } from "framer-motion";
import { Typography, Box } from "@mui/material";

const quotes = [
  "Bananas to you, that was excellent! 🍌",
  "You're the real MVP 🏆",
  "Monkey-approved performance 🐵💯",
  "Well done! You crushed it 💥",
  "You deserve a banana break now 🍌😎",
];

const ScoreReveal = ({ score, total }) => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <Box textAlign="center" mt={5}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 8 }}
      >
        <Typography variant="h2" component="div" gutterBottom>
          🏆 {score} / {total}
        </Typography>
        <Typography variant="h6" color="textSecondary" mt={2}>
          {quote}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default ScoreReveal;
