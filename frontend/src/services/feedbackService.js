import axios from 'axios';

const API_URL = 'http://localhost:8000';

/**
 * Service for handling feedback-related API calls
 */
export const feedbackService = {
  /**
   * Get all feedback items
   * @param {Object} filters - Optional filters for feedback
   * @returns {Promise} - Promise with feedback data
   */
  getAllFeedback: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/feedback`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  },

  /**
   * Get feedback statistics
   * @returns {Promise} - Promise with feedback statistics
   */
  getFeedbackStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/feedback/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      throw error;
    }
  },

  /**
   * Get feedback analytics data
   * @param {string} timeRange - Time range for analytics
   * @returns {Promise} - Promise with feedback analytics data
   */
  getFeedbackAnalytics: async (timeRange = '6months') => {
    try {
      const response = await axios.get(`${API_URL}/feedback/analytics`, {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback analytics:', error);
      throw error;
    }
  },

  /**
   * Submit new feedback
   * @param {Object} feedbackData - Feedback data to submit
   * @returns {Promise} - Promise with created feedback
   */
  submitFeedback: async (feedbackData) => {
    try {
      const response = await axios.post(`${API_URL}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  /**
   * Submit general feedback
   * @param {Object} feedbackData - General feedback data to submit
   * @returns {Promise} - Promise with created feedback
   */
  submitGeneralFeedback: async (feedbackData) => {
    try {
      const response = await axios.post(`${API_URL}/feedback/general`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error submitting general feedback:', error);
      throw error;
    }
  },

  /**
   * Submit seance feedback
   * @param {Object} feedbackData - Seance feedback data to submit
   * @returns {Promise} - Promise with created feedback
   */
  submitSeanceFeedback: async (feedbackData) => {
    try {
      const response = await axios.post('/feedback/seance', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error submitting seance feedback:', error);
      throw error;
    }
  },

  /**
   * Respond to feedback
   * @param {number} feedbackId - ID of the feedback to respond to
   * @param {Object} responseData - Response data
   * @returns {Promise} - Promise with response data
   */
  respondToFeedback: async (feedbackId, responseData) => {
    try {
      const response = await axios.post(`${API_URL}/feedback/${feedbackId}/respond`, responseData);
      return response.data;
    } catch (error) {
      console.error('Error responding to feedback:', error);
      throw error;
    }
  },

  /**
   * Like a feedback
   * @param {number} feedbackId - ID of the feedback to like
   * @returns {Promise} - Promise with updated feedback
   */
  likeFeedback: async (feedbackId) => {
    try {
      const response = await axios.post(`${API_URL}/feedback/${feedbackId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking feedback:', error);
      throw error;
    }
  },

  /**
   * Dislike a feedback
   * @param {number} feedbackId - ID of the feedback to dislike
   * @returns {Promise} - Promise with updated feedback
   */
  dislikeFeedback: async (feedbackId) => {
    try {
      const response = await axios.post(`${API_URL}/feedback/${feedbackId}/dislike`);
      return response.data;
    } catch (error) {
      console.error('Error disliking feedback:', error);
      throw error;
    }
  },

  /**
   * Report a feedback
   * @param {number} feedbackId - ID of the feedback to report
   * @param {Object} reportData - Report data
   * @returns {Promise} - Promise with report confirmation
   */
  reportFeedback: async (feedbackId, reportData = {}) => {
    try {
      const response = await axios.post(`${API_URL}/feedback/${feedbackId}/report`, reportData);
      return response.data;
    } catch (error) {
      console.error('Error reporting feedback:', error);
      throw error;
    }
  },

  /**
   * Get users for feedback selection
   * @returns {Promise} - Promise with users data
   */
  getFeedbackUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users for feedback:', error);
      throw error;
    }
  },

  /**
   * Get feedbacks for a specific session
   * @param {number} sessionId - ID of the session
   * @returns {Promise} - Promise with feedbacks data
   */
  getSessionFeedbacks: async (sessionId) => {
    try {
      const response = await axios.get(`${API_URL}/feedback/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session feedbacks:', error);
      throw error;
    }
  }
};

export default feedbackService;