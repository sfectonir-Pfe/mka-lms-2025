import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Paper, Box, Chip, Stack, Divider } from "@mui/material";
import axios from "axios";
import { Helmet } from "react-helmet";

const SessionDetail = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/session2/${id}`);
        setSession(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement de la session:", error);
      }
    };

    if (id) {
      fetchSession();
    }
  }, [id]);

  if (!session) {
    return <Typography>Chargement...</Typography>;
  }

  const shareUrl = `${window.location.origin}/session/${session.id}`;

  return (
    <>
      <Helmet>
        <title>{session.name} - Plateforme LMS</title>
        <meta property="og:title" content={`🎓 ${session.name}`} />
        <meta property="og:description" content={`Découvrez cette session de formation: ${session.program?.name || 'Programme'} du ${session.startDate?.slice(0, 10)} au ${session.endDate?.slice(0, 10)}`} />
        <meta property="og:image" content={session.imageUrl || `${window.location.origin}/default-session.jpg`} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: "#fefefe" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🎓 {session.name}
        </Typography>

        {session.imageUrl && (
          <Box mb={3} display="flex" justifyContent="center">
            <img
              src={session.imageUrl}
              alt="Session"
              style={{
                maxWidth: "100%",
                maxHeight: 300,
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        <Typography variant="h6" mb={1}>
          📚 Programme : <strong>{session.program?.name || "Inconnu"}</strong>
        </Typography>
        <Typography variant="body1" mb={3}>
          📅 Du <strong>{session.startDate?.slice(0, 10)}</strong> au{" "}
          <strong>{session.endDate?.slice(0, 10)}</strong>
        </Typography>

        {session.session2Modules?.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" fontWeight="bold" mb={2}>
              🧱 Modules et Contenus
            </Typography>
            {session.session2Modules.map((mod) => (
              <Box key={mod.id} mb={3}>
                <Typography variant="h6" fontWeight="bold" color="secondary.main" mb={1}>
                  📦 {mod.module?.name}
                </Typography>
                {mod.courses.map((c) => (
                  <Box key={c.id} ml={2} mb={2}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary" mb={1}>
                      📘 {c.course?.title}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {c.contenus.map((ct) => (
                        <Chip
                          key={ct.id}
                          label={`📄 ${ct.contenu?.title}`}
                          variant="outlined"
                          color="info"
                          onClick={() =>
                            ct.contenu?.fileUrl &&
                            window.open(ct.contenu.fileUrl, "_blank")
                          }
                          sx={{
                            cursor: ct.contenu?.fileUrl ? "pointer" : "default",
                            mb: 1,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Box>
            ))}
          </>
        )}
      </Paper>
    </>
  );
};

export default SessionDetail;