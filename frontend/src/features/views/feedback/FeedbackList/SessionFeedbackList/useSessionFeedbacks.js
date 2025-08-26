import React from 'react';
import api from '../../../../../api/axiosInstance';

export const useSessionFeedbacks = (sessionId) => {
  const [feedbacks, setFeedbacks] = React.useState([]);

  const reload = React.useCallback(() => {
    if (!sessionId) return;
    api.get(`/feedback/session/list/${sessionId}`)
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error('Error loading session feedback list:', err));
  }, [sessionId]);

  React.useEffect(() => {
    reload();
    const interval = setInterval(reload, 30000);
    return () => clearInterval(interval);
  }, [reload]);

  return { feedbacks, reload };
};