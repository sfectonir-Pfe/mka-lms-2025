// Feedback service for handling feedback-related API calls
import api from '../../src/api/axiosInstance';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const feedbackService = {
  // Get all feedback
  getAllFeedback: async () => {
    try {
      const response = await api.get(`/feedback`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des feedbacks');
    }
  },

  // Get feedback by ID
  getFeedbackById: async (id) => {
    try {
      const response = await api.get(`/feedback/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du feedback');
    }
  },

  // Create new feedback
  createFeedback: async (feedbackData) => {
    try {
      const response = await api.post(`/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du feedback');
    }
  },

  // Submit session feedback
  submitSessionFeedback: async (sessionId, feedbackData) => {
    try {
      const response = await api.post(`/feedback/session/${sessionId}`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error submitting session feedback:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi du feedback');
    }
  },

  // Get feedback for a specific formateur
  getFormateurFeedback: async (formateurId) => {
    try {
      const response = await api.get(`/feedback/formateur/${formateurId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching formateur feedback:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du feedback formateur');
    }
  },

  // Submit general feedback/complaint
  submitGeneralFeedback: async (feedbackData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await api.post(`/reclamation`, {
        userId: user.id || feedbackData.userId,
        userName: user.name || 'Utilisateur',
        userEmail: user.email || 'email@example.com',
        subject: feedbackData.title,
        description: feedbackData.description,
        category: feedbackData.category,
        priority: feedbackData.priority === 'low' ? 'BASSE' : 
                 feedbackData.priority === 'medium' ? 'MOYENNE' : 'HAUTE'
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting general feedback:', error);
      throw error;
    }
  },

  // Get all réclamations
  getAllReclamations: async () => {
    try {
      const response = await api.get(`/reclamation/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching réclamations:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des réclamations');
    }
  },

  // Get réclamation by ID
  getReclamationById: async (id) => {
    try {
      const response = await api.get(`/reclamation/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching réclamation:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de la réclamation');
    }
  },

  // Update réclamation (for admin responses)
  updateReclamation: async (id, updateData) => {
    try {
      const response = await api.patch(`/reclamation/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating réclamation:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la réclamation');
    }
  },

  // Get réclamations by user ID
  getUserReclamations: async (userId) => {
    try {
      const response = await api.get(`/reclamation/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user réclamations:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des réclamations utilisateur');
    }
  }
};

export default feedbackService;
