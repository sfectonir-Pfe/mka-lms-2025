import React, { useState } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddContenusView = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Cours");
  const [fileType, setFileType] = useState("PDF");
  const [file, setFile] = useState(null);
  const [courseId, setCourseId] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Le titre est obligatoire.");
    if (type !== "Quiz" && !file) return alert("Veuillez choisir un fichier.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);

    if (type !== "Quiz") {
      formData.append("file", file);
      formData.append("fileType", fileType);
    }

    if (courseId) {
      formData.append("courseIds", JSON.stringify([parseInt(courseId)]));
    }

    try {
      const res = await axios.post("http://localhost:8000/contenus/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newContenu = res.data;
      if (type === "Quiz") {
        navigate(`/quizzes/create/${newContenu.id}`);
      } else {
        navigate("/contenus");
      }
    } catch (err) {
      console.error("❌ Erreur ajout contenu :", err);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" mt={4} mb={2}>
        Ajouter un contenu
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="ID du cours (optionnel)"
          type="number"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          margin="normal"
        />
        <TextField
          select
          fullWidth
          label="Type de contenu"
          value={type}
          onChange={(e) => setType(e.target.value)}
          margin="normal"
        >
          <MenuItem value="Cours">Cours</MenuItem>
          <MenuItem value="Exercice">Exercice</MenuItem>
          <MenuItem value="Quiz">Quiz</MenuItem>
        </TextField>

        {type !== "Quiz" && (
          <>
            <TextField
              select
              fullWidth
              label="Type de fichier"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              margin="normal"
            >
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="IMAGE">Image</MenuItem>
              <MenuItem value="VIDEO">Vidéo</MenuItem>
            </TextField>

            <input
              type="file"
              accept={
                fileType === "PDF"
                  ? ".pdf"
                  : fileType === "IMAGE"
                  ? "image/*"
                  : "video/*"
              }
              onChange={handleFileChange}
              style={{ marginTop: "16px" }}
              required
            />
          </>
        )}

        {type === "Quiz" && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Le fichier n'est pas nécessaire. Vous pourrez créer le quiz après avoir enregistré.
          </Typography>
        )}

        <Box mt={3}>
          <Button type="submit" variant="contained" fullWidth>
            Enregistrer
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddContenusView;
