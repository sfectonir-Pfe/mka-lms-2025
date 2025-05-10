import React, { useState } from "react";
import {
    TextField,
    Button,
    Paper,
    Box,
    Typography,
    MenuItem,
    Rating,
} from "@mui/material";

export default function AddFeedback() {
    const [formData, setFormData] = useState({
        sender: "",
        receiver: "",
        type: "general",
        message: "",
        rating: 0,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRatingChange = (event, newValue) => {
        setFormData({ ...formData, rating: newValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Feedback submitted:", formData);
        alert("Feedback submitted!");
        setFormData({ sender: "", receiver: "", type: "general", message: "", rating: 0 });
    };

    return (
        <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
                Submit Feedback
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Sender"
                    name="sender"
                    value={formData.sender}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Receiver"
                    name="receiver"
                    value={formData.receiver}
                    onChange={handleChange}
                />
                <TextField
                    select
                    fullWidth
                    margin="normal"
                    label="Feedback Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="etudiant-formateur">Etudiant → Formateur</MenuItem>
                    <MenuItem value="formateur-etudiant">Formateur → Etudiant</MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    multiline
                    rows={4}
                />

                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        Rating:
                    </Typography>
                    <Rating
                        name="rating"
                        value={formData.rating}
                        onChange={handleRatingChange}
                    />
                </Box>

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
                    Send Feedback
                </Button>
            </Box>
        </Paper>
    );
}