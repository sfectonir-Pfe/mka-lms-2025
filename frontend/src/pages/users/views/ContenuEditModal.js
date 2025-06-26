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
import { useTranslation } from 'react-i18next';


const ContenuEditModal = ({ open, onClose, contenu, onSave }) => {
  const { t } = useTranslation();
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
      <DialogTitle>📝 {t('content.editContent')}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={t('common.title')}
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          select
          fullWidth
          label={t('content.contentType')}
          margin="normal"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="Cours">{t('content.course')}</MenuItem>
          <MenuItem value="Exercice">{t('content.exercise')}</MenuItem>
          <MenuItem value="Quiz">{t('content.quiz')}</MenuItem>
        </TextField>
        <TextField
          select
          fullWidth
          label={t('content.fileType')}
          margin="normal"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <MenuItem value="PDF">PDF</MenuItem>
          <MenuItem value="IMAGE">Image</MenuItem>
          <MenuItem value="VIDEO">{t('content.video')}</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant="contained" onClick={handleSave}>
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContenuEditModal;
