import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfigureSessionList = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/sessions")
      .then(res => setSessions(res.data))
      .catch(err => {
        console.error("Erreur chargement sessions", err);
        alert("Erreur chargement sessions.");
      });
  }, []);

  return (
    <Box mt={4} p={3}>
      <Typography variant="h5" gutterBottom>
        📆 Sessions configurées
      </Typography>

      {sessions.length === 0 ? (
        <Typography color="text.secondary">Aucune session configurée.</Typography>
      ) : (
        <List>
          {sessions.map((s) => (
            <Paper key={s.id} sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6">{s.program.name}</Typography>
              <Typography variant="body2">
                Du <strong>{new Date(s.startDate).toLocaleDateString()}</strong> au{" "}
                <strong>{new Date(s.endDate).toLocaleDateString()}</strong>
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Modules:</Typography>
              <List dense>
                {s.modules.map((m) => (
                  <ListItem key={m.id}>
                    <ListItemText primary={m.module.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ))}
        </List>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => navigate("/sessions/add")}
      >
        ➕ Nouvelle session
      </Button>
    </Box>
  );
};

export default ConfigureSessionList;
