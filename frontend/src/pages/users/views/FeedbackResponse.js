import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  Rating,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import feedbackService from "../../../services/feedbackService";

export default function FeedbackResponse({ open, onClose, feedback }) {
  const { t } = useTranslation();
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const handleResponseChange = (e) => {
    setResponse(e.target.value);
    setError("");
  };
  
  const handleSubmit = async () => {
    if (!response.trim()) {
      setError(t("feedback.response.emptyResponseError", "Please enter a response"));
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Get current user from localStorage
      const userStr = localStorage.getItem("user");
      const currentUser = userStr ? JSON.parse(userStr) : { id: 0 };

      // Vérification de l'ID du feedback
      if (!feedback || !feedback.id || isNaN(Number(feedback.id))) {
        setError(t("feedback.response.invalidIdError", "ID du feedback invalide. Impossible d'envoyer la réponse."));
        setLoading(false);
        return;
      }
      // Try to use the backend service
      await feedbackService.respondToFeedback(feedback.id, {
        response,
        responderId: currentUser.id
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose(true); // Pass true to indicate successful response
      }, 1500);
    } catch (error) {
      console.error("Failed to submit response:", error);
      setError(t("feedback.response.submitError", "Failed to submit response. Please try again."));
    } finally {
      setLoading(false);
    }
  };
  
  if (!feedback) return null;
  
  return (
    <Dialog 
      open={open} 
      onClose={() => !loading && onClose(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">
          {t("feedback.response.respondToFeedback", "Respond to Feedback")}
        </Typography>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={() => onClose(false)} 
          disabled={loading}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {/* Original Feedback */}
        <Box sx={{ mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Chip
              label={feedback.type?.replace("-", " → ") || "General"}
              color={
                feedback.type === "etudiant-formateur" ? "primary" : 
                feedback.type === "formateur-etudiant" ? "success" : 
                "warning"
              }
              size="small"
            />
            {feedback.rating > 0 && (
              <Rating value={feedback.rating} precision={0.5} size="small" readOnly />
            )}
          </Box>
          
          <Typography variant="subtitle2" color="text.secondary">
            {t("feedback.from", "From")}: {feedback.from} → {t("feedback.to", "To")}: {feedback.to}
          </Typography>
          
          <Typography variant="body1" sx={{ my: 1 }}>
            {feedback.message}
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            {feedback.category && (
              <Chip 
                label={t(`feedback.categories.${feedback.category}`, feedback.category)} 
                size="small" 
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            )}
            
            {feedback.tags && feedback.tags.map(tag => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small" 
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
          
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            {feedback.timestamp}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }}>
          <Chip label={t("feedback.response.yourResponse", "Your Response")} />
        </Divider>
        
        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {t("feedback.response.responseSubmitted", "Response submitted successfully!")}
          </Alert>
        ) : (
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            placeholder={t("feedback.response.enterResponse", "Enter your response here...")}
            value={response}
            onChange={handleResponseChange}
            disabled={loading}
            error={!!error}
            helperText={error}
          />
        )}
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {t("feedback.response.responseGuidelines", "Guidelines: Be respectful, address all points raised, and provide constructive feedback.")}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ width: "100%", justifyContent: "space-between" }}>
          <Button 
            onClick={() => onClose(false)} 
            disabled={loading || success}
            variant="outlined"
          >
            {t("common.cancel", "Cancel")}
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || success || !response.trim()}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          >
            {loading 
              ? t("feedback.response.sending", "Sending...") 
              : t("feedback.response.sendResponse", "Send Response")}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}