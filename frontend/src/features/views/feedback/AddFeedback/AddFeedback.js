import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Paper,
    Box,
    Typography,
    MenuItem,
    Rating,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
    Alert,
    CircularProgress,
    Autocomplete,
    Chip
} from "@mui/material";
import feedbackService from "../../../services/feedbackService";
import { useTranslation } from "react-i18next";

export default function AddFeedback() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        sender: "",
        receiver: "",
        type: "general",
        message: "",
        rating: 0,
        category: "",
        tags: []
    });
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    
    // Get current user from localStorage
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setFormData(prev => ({
                ...prev,
                sender: user.name || user.email
            }));
        }
        
        // Fetch users for receiver dropdown
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await feedbackService.getFeedbackUsers();
                setUsers(data || []);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                // Fallback to dummy data if API fails
                setUsers([
                    { id: 1, name: "Formateur 1", email: "formateur1@example.com" },
                    { id: 2, name: "Formateur 2", email: "formateur2@example.com" },
                    { id: 3, name: "Etudiant 1", email: "etudiant1@example.com" }
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRatingChange = (event, newValue) => {
        setFormData({ ...formData, rating: newValue });
    };
    
    const handleTagsChange = (event, newTags) => {
        setFormData({ ...formData, tags: newTags });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await feedbackService.submitFeedback(formData);
            
            setSnackbar({
                open: true,
                message: t("feedback.submitSuccess"),
                severity: "success"
            });
            
            // Reset form
            setFormData({ 
                sender: formData.sender, // Keep the sender
                receiver: "", 
                type: "general", 
                message: "", 
                rating: 0,
                category: "",
                tags: []
            });
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setSnackbar({
                open: true,
                message: t("feedback.submitError"),
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    
    const feedbackCategories = [
        { value: "course", label: "Course Content" },
        { value: "instructor", label: "Instructor" },
        { value: "platform", label: "Platform" },
        { value: "technical", label: "Technical Issue" },
        { value: "suggestion", label: "Suggestion" }
    ];
    
    const availableTags = [
        "UI/UX", "Content", "Video Quality", "Audio", "Exercises", 
        "Assignments", "Quizzes", "Pace", "Difficulty", "Support"
    ];

    return (
        <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
                {t("feedback.submitFeedback", "Submit Feedback")}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    label={t("feedback.sender", "Sender")}
                    name="sender"
                    value={formData.sender}
                    onChange={handleChange}
                    disabled // Disabled since we're using the logged-in user
                />
                
                <FormControl fullWidth margin="normal">
                    <InputLabel id="receiver-label">{t("feedback.receiver", "Receiver")}</InputLabel>
                    <Select
                        labelId="receiver-label"
                        name="receiver"
                        value={formData.receiver}
                        onChange={handleChange}
                        label={t("feedback.receiver", "Receiver")}
                        required
                    >
                        {users.map(user => (
                            <MenuItem key={user.id} value={user.name || user.email}>
                                {user.name || user.email}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                    <InputLabel id="type-label">{t("feedback.feedbackType", "Feedback Type")}</InputLabel>
                    <Select
                        labelId="type-label"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        label={t("feedback.feedbackType", "Feedback Type")}
                        required
                    >
                        <MenuItem value="general">{t("feedback.general", "General")}</MenuItem>
                        <MenuItem value="etudiant-formateur">{t("feedback.studentToInstructor", "Student → Instructor")}</MenuItem>
                        <MenuItem value="formateur-etudiant">{t("feedback.instructorToStudent", "Instructor → Student")}</MenuItem>
                        <MenuItem value="course-feedback">{t("feedback.courseFeedback", "Course Feedback")}</MenuItem>
                    </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">{t("feedback.category", "Category")}</InputLabel>
                    <Select
                        labelId="category-label"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        label={t("feedback.category", "Category")}
                    >
                        {feedbackCategories.map(category => (
                            <MenuItem key={category.value} value={category.value}>
                                {t(`feedback.categories.${category.value}`, category.label)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <Autocomplete
                    multiple
                    id="tags-filled"
                    options={availableTags}
                    value={formData.tags}
                    onChange={handleTagsChange}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip 
                                variant="outlined" 
                                label={option} 
                                {...getTagProps({ index })} 
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label={t("feedback.tags", "Tags")}
                            placeholder={t("feedback.addTags", "Add tags")}
                            margin="normal"
                        />
                    )}
                />
                
                <TextField
                    fullWidth
                    margin="normal"
                    label={t("feedback.message", "Message")}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                />

                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {t("feedback.rating", "Rating")}:
                    </Typography>
                    <Rating
                        name="rating"
                        value={formData.rating}
                        onChange={handleRatingChange}
                        precision={0.5}
                    />
                </Box>

                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 3 }}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        t("feedback.sendFeedback", "Send Feedback")
                    )}
                </Button>
            </Box>
            
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}