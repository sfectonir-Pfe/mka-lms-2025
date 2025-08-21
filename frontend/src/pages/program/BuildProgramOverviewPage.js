import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axiosInstance";
import {
  Container,
  Typography,
  Divider,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  TextField,
  Badge,
  Stack,
  Chip,
  Button
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const Section = ({ title, items, renderItem, expanded, onToggle, t }) => (
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
          {t('common.noItemsFound', 'No items found')}
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
  const { t } = useTranslation();
  const [buildProgram, setbuildProgram] = useState([]);
  const [search, setSearch] = useState("");
  const [showbuildProgram, setShowbuildProgram] = useState(true);
  const navigate = useNavigate();
  const { programId } = useParams();

  const fetchbuildProgram = useCallback(async () => {
    try {
      const res = await api.get("/buildProgram");
      const all = res.data;
      setbuildProgram(programId ? all.filter(s => s.programId === Number(programId)) : all);
    } catch (err) {
      toast.error(t('buildProgram.loadError'));
    }
  }, [programId]);

  useEffect(() => {
    fetchbuildProgram();
  }, [fetchbuildProgram]);

  const filterBySearch = (s) =>
    s.program?.name?.toLowerCase().includes(search.toLowerCase());

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          🎓 {t('buildProgram.overviewTitle')}
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/programs")}>
          ↩️ {t('common.back')}
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <TextField
        fullWidth
        label={t('buildProgram.searchProgram')}
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Section
        title={t('common.programs')}
        items={buildProgram.filter(filterBySearch)}
        expanded={showbuildProgram}
        onToggle={() => setShowbuildProgram((prev) => !prev)}
        t={t}
        renderItem={(buildProgram) => (
          <Box component={Paper} elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              📘 {t('buildProgram.program')}: {buildProgram.program.name}
            </Typography>

            {buildProgram.level && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                🎯 {t('buildProgram.level')}: <strong>{buildProgram.level}</strong>
              </Typography>
            )}

            {buildProgram.averageRating && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                ⭐ {t('buildProgram.averageRating', 'Note moyenne')}: <strong>{buildProgram.averageRating}/5</strong>
              </Typography>
            )}

            <Divider sx={{ my: 1 }} />

            {buildProgram.modules.map((m) => (
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

            <Box display="flex" justifyContent="flex-end" mt={2} gap={2} flexWrap="wrap">
              <Button
                variant="outlined"
                color="info"
                onClick={() => navigate(`/programs/edit/${buildProgram.program.id}`)}
              >
                🛠️ {t('common.edit')}
              </Button>

              {buildProgram.program.published && (
                <Chip
                  label={t('buildProgram.published')}
                  icon={<span style={{ fontSize: 14 }}>✅</span>}
                  sx={{
                    fontWeight: "bold",
                    px: 1.5,
                    borderRadius: "12px",
                    backgroundColor: "#e6f4ea",
                    color: "#1b5e20",
                    border: "1px solid #1b5e20",
                    height: 36,
                  }}
                />
              )}

              <Button
                variant={buildProgram.program.published ? "outlined" : "contained"}
                color={buildProgram.program.published ? "warning" : "success"}
                onClick={async () => {
                  try {
                    await api.patch(`/programs/${buildProgram.program.id}/publish`);
                    toast.success(
                      buildProgram.program.published
                        ? t('buildProgram.unpublishSuccess')
                        : t('buildProgram.publishSuccess')
                    );
                    fetchbuildProgram(); // refresh list
                  } catch (err) {
                    toast.error(t('buildProgram.publishError'));
                  }
                }}
                sx={{
                  borderRadius: "12px",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  px: 2.5,
                  py: 0.8,
                  height: 36,
                  backgroundColor: buildProgram.program.published ? "#fff3e0" : "#e8f5e9",
                  color: buildProgram.program.published ? "#ef6c00" : "#2e7d32",
                  border: `1px solid ${buildProgram.program.published ? "#ef6c00" : "#2e7d32"}`,
                  "&:hover": {
                    backgroundColor: buildProgram.program.published ? "#ffe0b2" : "#c8e6c9",
                  },
                }}
              >
                {buildProgram.program.published ? `❌ ${t('buildProgram.unpublish')}` : `📤 ${t('buildProgram.publish')}`}
              </Button>

            </Box>
          </Box>
        )}
      />
    </Container>
  );

}
