// Toast Error Utility
// Provides error handling and toast notification functionality

// Simple toast notification system
let toastContainer = null;

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

const createToast = (message, type = 'error', duration = 5000) => {
  const container = createToastContainer();

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#ffc107'};
    color: white;
    padding: 12px 20px;
    margin-bottom: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    pointer-events: auto;
    cursor: pointer;
    max-width: 300px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease-out;
  `;

  // Add animation styles
  if (!document.getElementById('toast-styles')) {
    const styles = document.createElement('style');
    styles.id = 'toast-styles';
    styles.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(styles);
  }

  toast.textContent = message;

  // Click to dismiss
  toast.addEventListener('click', () => {
    removeToast(toast);
  });

  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    removeToast(toast);
  }, duration);

  return toast;
};

const removeToast = (toast) => {
  if (toast && toast.parentNode) {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
};

export const showError = (message, duration = 5000) => {
  console.error('Toast Error:', message);
  return createToast(message, 'error', duration);
};

export const showSuccess = (message, duration = 3000) => {
  console.log('Toast Success:', message);
  return createToast(message, 'success', duration);
};

export const showWarning = (message, duration = 4000) => {
  console.warn('Toast Warning:', message);
  return createToast(message, 'warning', duration);
};

export const showInfo = (message, duration = 3000) => {
  console.info('Toast Info:', message);
  return createToast(message, 'info', duration);
};

// Error handling functions
export const handleApiError = (error, defaultMessage = 'Une erreur est survenue') => {
  let message = defaultMessage;

  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  showError(message);
  return message;
};

export const handleValidationError = (error) => {
  if (error?.response?.data?.errors) {
    // Handle validation errors array
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      errors.forEach(err => showError(err.message || err));
    } else {
      Object.values(errors).forEach(err => showError(err));
    }
  } else {
    handleApiError(error, 'Erreur de validation');
  }
};

export const handleNetworkError = (error) => {
  if (!navigator.onLine) {
    showError('Pas de connexion internet');
  } else if (error?.code === 'NETWORK_ERROR') {
    showError('Erreur de réseau - Vérifiez votre connexion');
  } else {
    showError('Erreur de connexion au serveur');
  }
};

export const handleAuthError = (error) => {
  if (error?.response?.status === 401) {
    showError('Session expirée - Veuillez vous reconnecter');
    // Could trigger logout here
  } else if (error?.response?.status === 403) {
    showError('Accès non autorisé');
  } else {
    handleApiError(error, 'Erreur d\'authentification');
  }
};

export const clearAllToasts = () => {
  if (toastContainer) {
    toastContainer.innerHTML = '';
  }
};

// Utility to format error messages
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'Erreur inconnue';
};

// Log error for debugging
export const logError = (error, context = '') => {
  console.group(`🚨 Error ${context ? `in ${context}` : ''}`);
  console.error('Error object:', error);
  console.error('Error message:', formatErrorMessage(error));
  console.error('Stack trace:', error?.stack);
  console.groupEnd();
};

const toastErrorUtils = {
  showError,
  showSuccess,
  showWarning,
  showInfo,
  handleApiError,
  handleValidationError,
  handleNetworkError,
  handleAuthError,
  clearAllToasts,
  formatErrorMessage,
  logError
};

export default toastErrorUtils;
