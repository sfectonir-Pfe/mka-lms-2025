import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Typography, List, ListItem, ListItemText, IconButton, Chip, CircularProgress, Snackbar, Alert, Box } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import { io } from 'socket.io-client';
import api from '../../api/axiosInstance';
import { useTranslation } from 'react-i18next';
// const API_URL = 'http://localhost:8000';

const NotificationsPage = ({ user }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get(`/notifications/${user.id}`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(t('notifications.errors.failedToLoad'));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Setup real-time connection
  useEffect(() => {
    if (!user?.id) return;
    
    // Fetch initial notifications
    fetchNotifications();

    // Clean up previous socket connection
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Socket for real-time
    const socketInstance = io(process.env.REACT_APP_API_BASE, { 
      query: { userId: user.id },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    socketRef.current = socketInstance;
    setSocket(socketInstance);
    
    socketInstance.on('new-notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError(t('notifications.errors.realtimeUnavailable'));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.id, fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch(`/notifications/${user.id}/mark-all-read`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      setError(t('notifications.errors.failedToMarkAllRead'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
      setError(t('notifications.errors.failedToDelete'));
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      setError(t('notifications.errors.failedToMarkRead'));
    }
  };

  return (
    <>
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
        <Typography variant="h4" gutterBottom>
          {t('notifications.allNotifications')}
          {!loading && notifications.some(n => !n.read) && (
            <IconButton onClick={handleMarkAllAsRead}>
              <DoneAllIcon />
            </IconButton>
          )}
          {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        </Typography>
        
        {loading && notifications.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>{t('notifications.loading')}</Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" py={4}>
            {t('notifications.noNotifications')}
          </Typography>
        ) : (
          <List>
            {notifications.map(n => (
              <ListItem key={n.id} sx={{ bgcolor: n.read ? undefined : '#e3f2fd' }}>
                <ListItemText
                  primary={n.message}
                  secondary={
                    <>
                      {new Date(n.createdAt).toLocaleString()}
                      {!n.read && <Chip size="small" color="primary" label={t('notifications.new')} sx={{ ml: 1 }} />}
                    </>
                  }
                  onClick={() => !n.read && handleMarkAsRead(n.id)}
                  sx={{ cursor: n.read ? 'default' : 'pointer' }}
                />
                <IconButton onClick={() => handleDelete(n.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </div>
      
      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationsPage;
