import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Container, Typography, Divider, Box, Paper, List, ListItem, ListItemText,
  IconButton, Collapse, TextField, Badge, Stack, Chip, Button
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const Section = ({ title, items, renderItem, expanded, onToggle }) => (
  <Box component={Paper} elevation={2} sx={{ p: 2, mb: 4 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Badge badgeContent={items.length} color="primary">
        <Typography variant="h6">{title}</Typography>
      </Badge>
      <IconButton onClick={onToggle}>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
    </Box>
    <Collapse in={expanded}>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Aucun(e) {title.toLowerCase()} trouvé(e).
        </Typography>
      ) : (
        <List dense>
          {items.map((item) => (
            <ListItem key={item.id} alignItems="flex-start">
              <ListItemText primary={renderItem(item)} />
            </ListItem>
          ))}
        </List>
      )}
    </Collapse>
  </Box>
);

export default function BuildProgramOverviewPage() {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [showSessions, setShowSessions] = useState(true);
  const navigate = useNavigate();
  const { programId } = useParams();

  const fetchSessions = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8000/sessions");
      const all = res.data;
      setSessions(programId ? all.filter(s => s.programId === Number(programId)) : all);
    } catch (err) {
      toast.error("Erreur chargement des programmes.");
    }
  }, [programId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const filterBySearch = (s) =>
    s.program?.name?.toLowerCase().includes(search.toLowerCase());

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          🎓 Vue d'ensemble des programmes configurés
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/programs")}>
          ↩️ Retour
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <TextField
        fullWidth
        label="Rechercher un programme par nom"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Section
        title="Programmes"
        items={sessions.filter(filterBySearch)}
        expanded={showSessions}
        onToggle={() => setShowSessions((prev) => !prev)}
        renderItem={(session) => (
          <Box component={Paper} elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              📘 Programme : {session.program.name}
            </Typography>

            {session.level && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                🎯 Niveau : <strong>{session.level}</strong>
              </Typography>
            )}

            <Divider sx={{ my: 1 }} />

            {session.modules.map((m) => (
              <Box key={m.id} mb={2}>
                <Typography fontWeight="bold" color="primary.main">📦 {m.module.name}</Typography>

                {(m.courses || []).map((c) => (
                  <Box key={c.id} ml={2} mt={1}>
                    <Typography variant="body2" fontWeight="bold">📘 {c.course.title}</Typography>
                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                      {(c.contenus || []).map((ct) => (
                        <Chip
                          key={ct.id}
                          label={`📄 ${ct.contenu.title}`}
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => window.open(ct.contenu.fileUrl, "_blank")}
                          sx={{ cursor: "pointer" }}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Box>
            ))}

            <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
              <Button
                variant="outlined"
                color="info"
                onClick={() => navigate(`/programs/edit/${session.program.id}`)}
              >
                🛠️ Modifier
              </Button>

              <Button
  variant="contained"
  color="success"
  onClick={async () => {
    try {
      await axios.patch(`http://localhost:8000/programs/${session.program.id}/publish`);
      toast.success("Programme publié avec succès !");
      fetchSessions(); // refresh list after publishing
    } catch (err) {
      toast.error("Erreur lors de la publication du programme.");
    }
  }}
>
  📤 Publier
</Button>

            </Box>
          </Box>
        )}
      />
    </Container>
  );
}
