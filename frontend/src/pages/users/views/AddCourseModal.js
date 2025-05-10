import React, { useState } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,FormControl,InputLabel,Select,MenuItem,Stack,TextField,Typography,} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import axios from "axios";

const AddCourseModal = ({ open, onClose, onAdd, moduleId }) => {
  const [type, setType] = useState("pdf");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const handleAdd = async () => {
    if (!file || !title.trim()) {
      alert("Veuillez fournir un titre et un fichier.");
      return;
    }

    if (!moduleId || isNaN(moduleId)) {
      alert("Erreur : module ID est manquant ou invalide.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post("http://localhost:8000/courses/upload", formData);
      const fileUrl = uploadRes.data.fileUrl;

      const response = await axios.post("http://localhost:8000/courses", {
        title,
        type: type.toUpperCase(),
        fileUrl,
        moduleId,
      });

      onAdd(response.data);
      setFile(null);
      setTitle("");
      setType("pdf");
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du cours :", error);
      alert("Une erreur est survenue lors de l'ajout du cours.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>📚 Ajouter un cours</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} mt={1}>
          <TextField
            label="Titre du cours"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel id="type-label">Type de fichier</InputLabel>
            <Select
              labelId="type-label"
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Type de fichier"
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="image">Image</MenuItem>
              <MenuItem value="video">Vidéo</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
            Choisir un fichier
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
              accept={
                type === "pdf"
                  ? ".pdf"
                  : type === "image"
                  ? "image/*"
                  : "video/*"
              }
            />
          </Button>

          {file && (
            <Typography variant="body2" color="text.secondary">
              📎 Fichier sélectionné : <strong>{file.name}</strong>
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!file || !title.trim()}
          color="primary"
        >
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCourseModal;
