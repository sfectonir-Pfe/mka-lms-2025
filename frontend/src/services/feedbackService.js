// Feedback service for handling feedback-related API calls
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const feedbackService = {
  // Get all feedback
  getAllFeedback: async () => {
    try {
      const response = await axios.get(`${API_URL}/feedback`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des feedbacks');
    }
  },

  // Get feedback by ID
  getFeedbackById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/feedback/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du feedback');
    }
  },

  // Create new feedback
  createFeedback: async (feedbackData) => {
    try {
      const response = await axios.post(`${API_URL}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du feedback');
    }
  },

  // Submit session feedback
  submitSessionFeedback: async (sessionId, feedbackData) => {
    try {
      const response = await axios.post(`${API_URL}/feedback/session/${sessionId}`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error submitting session feedback:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi du feedback');
    }
  },

  // Get feedback for a specific formateur
  getFormateurFeedback: async (formateurId) => {
    try {
      const response = await axios.get(`${API_URL}/feedback/formateur/${formateurId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching formateur feedback:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du feedback formateur');
    }
  }
};

export default feedbackService;
