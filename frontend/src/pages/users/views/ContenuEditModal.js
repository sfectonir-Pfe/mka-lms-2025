import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";


const ContenuEditModal = ({ open, onClose, contenu, onSave }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    if (contenu) {
      setTitle(contenu.title || "");
      setType(contenu.type || "");
      setFileType(contenu.fileType || "");
    }
  }, [contenu]);

  const handleSave = () => {
    onSave({ ...contenu, title, type, fileType });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>📝 Modifier Contenu</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Titre"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          select
          fullWidth
          label="Type"
          margin="normal"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="Cours">Cours</MenuItem>
          <MenuItem value="Exercice">Exercice</MenuItem>
          <MenuItem value="Quiz">Quiz</MenuItem>
        </TextField>
        <TextField
          select
          fullWidth
          label="Type de fichier"
          margin="normal"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <MenuItem value="PDF">PDF</MenuItem>
          <MenuItem value="IMAGE">Image</MenuItem>
          <MenuItem value="VIDEO">Vidéo</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSave}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContenuEditModal;
