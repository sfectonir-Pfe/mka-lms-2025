import React, { useEffect, useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import { io } from 'socket.io-client';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const NotificationCenter = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  // Fetch notifications and setup real-time
  useEffect(() => {
  if (!user?.id) return;
  console.log('[NotificationCenter] user.id:', user?.id);

  // Fetch notifications
  axios.get(`${API_URL}/notifications/${user.id}`)
    .then(res => {
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    });

  // Connect to socket
  const socketInstance = io(API_URL, { query: { userId: user.id } });
  setSocket(socketInstance);

  socketInstance.on('new-notification', notif => {
    setNotifications(prev => [notif, ...prev]);
    setUnreadCount(prev => prev + 1);
  });

  return () => {
    socketInstance.disconnect();
  };
}, [user?.id]);

  // Mark as read
  const handleMarkAsRead = async (id) => {
    await axios.patch(`${API_URL}/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    await axios.patch(`${API_URL}/notifications/${user.id}/mark-all-read`);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Delete notification
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/notifications/${id}`);
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <>
      <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem disabled>
          Notifications
          {unreadCount > 0 &&
            <IconButton size="small" onClick={handleMarkAllAsRead} sx={{ ml: 'auto' }}>
              <DoneAllIcon fontSize="small" />
            </IconButton>
          }
        </MenuItem>
        {notifications.length === 0
          ? <MenuItem disabled>No notifications</MenuItem>
          : (
            <List dense sx={{ width: 320, maxWidth: 400 }}>
              {notifications.map(n => (
                <ListItem key={n.id} sx={{ bgcolor: n.read ? undefined : '#e3f2fd' }}>
                  <ListItemIcon>
                    <MessageIcon color={n.read ? 'disabled' : 'primary'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={n.message}
                    secondary={new Date(n.createdAt).toLocaleTimeString()}
                    onClick={() => handleMarkAsRead(n.id)}
                    sx={{ cursor: 'pointer' }}
                  />
                  <IconButton size="small" onClick={() => handleDelete(n.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
      </Menu>
    </>
  );
};

export default NotificationCenter;
