import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  CircularProgress,
  Chip,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import api from "../../../api/axiosInstance";
import { getStoredUser } from "../../../utils/authUtils";

const quotes = [
  "You're the real MVP 🏆",
  "Monkey-approved performance 🐵💯",
  "Well done! You crushed it 💥",
];

const ScoreReveal = ({ score, total, quizId, contenuId }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const [userScores, setUserScores] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);

    const fetchResults = async () => {
      try {
        // wait until we actually have something to fetch with
        if (!quizId && !contenuId) return;

        setLoading(true);
        let res;

        if (quizId) {
          res = await api.get(`/quizzes/${quizId}/user-answers`);
        } else {
          // fallback: usable in séance flow if you passed contenuId instead of quizId
          res = await api.get(`/quizzes/by-contenu/${contenuId}/user-answers`);
        }

        const sorted = [...res.data].sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        });
        setUserScores(sorted);
      } catch (err) {
        console.error("Failed to fetch user scores", err);
        setUserScores([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserHistory = async () => {
      try {
        if (!user?.id) return;
        
        setHistoryLoading(true);
        const response = await api.get(`/quizzes/user/${user.id}`);
        setUserHistory(response.data);
      } catch (err) {
        console.error("Failed to fetch user history:", err);
        setUserHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchResults();
    fetchUserHistory();
  }, [quizId, contenuId]);

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
        <Typography variant="h4" component="div" gutterBottom sx={{ color: percentage >= 70 ? "#4caf50" : percentage >= 50 ? "#ff9800" : "#f44336" }}>
          {percentage}%
        </Typography>
        <Typography variant="h6" color="textSecondary" mt={2}>
          {quote}
        </Typography>
      </motion.div>

    </Box>
  );
};

export default ScoreReveal;
