import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, IconButton, Chip } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import { io } from 'socket.io-client';
import api from '../../api/axiosInstance';

// const API_URL = 'http://localhost:8000';

const NotificationsPage = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    // Initial load
    api.get(`/notifications/${user.id}`)
      .then(res => setNotifications(res.data));
    // Socket for real-time
    const socketInstance = io(api, { query: { userId: user.id } });  //API_URL
    setSocket(socketInstance);
    socketInstance.on('new-notification', notif => {
      setNotifications(prev => [notif, ...prev]);
    });
    return () => socketInstance.disconnect();
  }, [user?.id]);

  const handleMarkAllAsRead = async () => {
    await api.patch(`/notifications/${user.id}/mark-all-read`);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = async (id) => {
    await api.delete(`/notifications/${id}`);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        All Notifications
        <IconButton onClick={handleMarkAllAsRead}><DoneAllIcon /></IconButton>
      </Typography>
      <List>
        {notifications.map(n => (
          <ListItem key={n.id} sx={{ bgcolor: n.read ? undefined : '#e3f2fd' }}>
            <ListItemText
              primary={n.message}
              secondary={
                <>
                  {new Date(n.createdAt).toLocaleString()}
                  {!n.read && <Chip size="small" color="primary" label="New" sx={{ ml: 1 }} />}
                </>
              }
              onClick={() => !n.read && api.patch(`/notifications/${n.id}/read`).then(() =>
                setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
              )}
              sx={{ cursor: 'pointer' }}
            />
            <IconButton onClick={() => handleDelete(n.id)}><DeleteIcon /></IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default NotificationsPage;
