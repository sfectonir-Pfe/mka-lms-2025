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
      <IconButton 
        onClick={onToggle}
        sx={{
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          color: "white",
          boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
          transition: "all 0.2s ease",
          "&:hover": {
            background: "linear-gradient(135deg, #1565c0, #1976d2)",
            transform: "translateY(-1px)",
            boxShadow: "0 6px 16px rgba(25,118,210,0.4)"
          }
        }}
      >
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

  const styles = {
    primary: {
      borderRadius: 3,
      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px rgba(25,118,210,0.4)'
      }
    },
    danger: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #d32f2f, #ef5350)',
      boxShadow: '0 6px 18px rgba(211,47,47,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(211,47,47,0.35)' }
    },
    success: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
      boxShadow: '0 6px 18px rgba(46,125,50,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(46,125,50,0.35)' }
    },
    info: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #0288d1, #29b6f6)',
      boxShadow: '0 6px 18px rgba(2,136,209,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(2,136,209,0.35)' }
    },
    secondary: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #7b1fa2, #ab47bc)',
      boxShadow: '0 6px 18px rgba(123,31,162,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(123,31,162,0.35)' }
    },
    warning: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #f57c00, #ff9800)',
      boxShadow: '0 6px 18px rgba(245,124,0,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(245,124,0,0.35)' }
    },
    rounded: { borderRadius: 2 }
  };

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
        <Button variant="contained" sx={styles.secondary} onClick={() => navigate("/programs")}>
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
                          variant="contained"
                          onClick={() => window.open(ct.contenu.fileUrl, "_blank")}
                          sx={{
                            cursor: "pointer",
                            background: "linear-gradient(135deg, #7b1fa2, #ab47bc)",
                            color: "white",
                            fontWeight: "bold",
                            boxShadow: "0 4px 12px rgba(123,31,162,0.3)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 6px 16px rgba(123,31,162,0.4)"
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Box>
            ))}

            <Box display="flex" justifyContent="flex-end" mt={2} gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                sx={styles.info}
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
                    background: "linear-gradient(135deg, #2e7d32, #66bb6a)",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(46,125,50,0.3)",
                    height: 36,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 16px rgba(46,125,50,0.4)"
                    }
                  }}
                />
              )}

              <Button
                variant="contained"
                sx={buildProgram.program.published ? styles.warning : styles.success}
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
