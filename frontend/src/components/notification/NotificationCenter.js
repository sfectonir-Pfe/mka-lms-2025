import React, { useEffect, useState, useCallback, useRef } from 'react';
import { IconButton, Badge, Menu, MenuItem, List, ListItem, ListItemIcon, ListItemText, CircularProgress, Snackbar, Alert, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewListIcon from '@mui/icons-material/ViewList';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from "../../api/axiosInstance";




const NotificationCenter = ({ user }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get(`/notifications/${user.id}`);
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
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
    
    console.log('[NotificationCenter] user.id:', user?.id);
    
    // Fetch initial notifications
    fetchNotifications();

    // Clean up previous socket connection
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Connect to socket
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
      setUnreadCount(prev => prev + 1);
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

  // Mark as read
  const handleMarkAsRead = async (id) => {
    try {
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;
      
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      
      // Only decrease unread count if notification was actually unread
      if (!notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      setError(t('notifications.errors.failedToMarkRead'));
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await api.patch(`/notifications/${user.id}/mark-all-read`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      setError(t('notifications.errors.failedToMarkAllRead'));
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    try {
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;
      
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      // Only decrease unread count if deleted notification was unread
      if (!notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
      setError(t('notifications.errors.failedToDelete'));
    }
  };

  const handleViewAll = () => {
    setAnchorEl(null);
    navigate('/notifications');
  };

  // Function to translate notification messages
  const translateNotificationMessage = (message) => {
    if (!message) return '';
    
    // Parse different notification message patterns
    // Pattern: "Name has sent you a new message: content"
    const newMessageMatch = message.match(/^(.+?) has sent you a new message: (.+)$/);
    if (newMessageMatch) {
      const [, senderName, messageContent] = newMessageMatch;
      return t('notifications.messages.newMessage', { senderName, messageContent });
    }
    
    // Pattern: "Name sent a message in SessionName (ProgramName): content"
    const sessionChatMatch = message.match(/^(.+?) sent a message in (.+?) \((.+?)\): (.+)$/);
    if (sessionChatMatch) {
      const [, senderName, sessionName, programName, messagePreview] = sessionChatMatch;
      return t('notifications.messages.sessionChat', { senderName, sessionName, programName, messagePreview });
    }
    
    // Pattern: "Name sent a message in ProgramName: content"
    const programChatMatch = message.match(/^(.+?) sent a message in (.+?): (.+)$/);
    if (programChatMatch) {
      const [, senderName, programName, messagePreview] = programChatMatch;
      return t('notifications.messages.programChat', { senderName, programName, messagePreview });
    }
    
    // Pattern: "New program created: ProgramName (date)"
    const newProgramMatch = message.match(/^Nouveau programme créé: (.+?) \((.+?)\)$|^New program created: (.+?) \((.+?)\)$/);
    if (newProgramMatch) {
      const programName = newProgramMatch[1] || newProgramMatch[3];
      const date = newProgramMatch[2] || newProgramMatch[4];
      return t('notifications.messages.newProgram', { programName, date });
    }
    
    // Pattern: "Program published/unpublished: ProgramName (date)"
    const programStatusMatch = message.match(/^Programme (publié|dépublié): (.+?) \((.+?)\)$|^Program (published|unpublished): (.+?) \((.+?)\)$/);
    if (programStatusMatch) {
      const status = programStatusMatch[1] || programStatusMatch[4];
      const programName = programStatusMatch[2] || programStatusMatch[5];
      const date = programStatusMatch[3] || programStatusMatch[6];
      const key = (status === 'publié' || status === 'published') ? 'programPublished' : 'programUnpublished';
      return t(`notifications.messages.${key}`, { programName, date });
    }
    
    // Fallback: return original message if no pattern matches
    return message;
  };

  return (
    <>
        <IconButton onClick={e => setAnchorEl(e.currentTarget)} title={t('notifications.title')}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem disabled>
          {t('notifications.title')}
          {unreadCount > 0 && !loading &&
            <IconButton size="small" onClick={handleMarkAllAsRead} sx={{ ml: 'auto' }} title={t('notifications.actions.markAllAsRead')}>
              <DoneAllIcon fontSize="small" />
            </IconButton>
          }
          {loading && <CircularProgress size={16} sx={{ ml: 'auto' }} />}
        </MenuItem>
        {loading && notifications.length === 0 ? (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            {t('notifications.loading')}
          </MenuItem>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>{t('notifications.noNotifications')}</MenuItem>
        ) : (
          <List dense sx={{ width: 320, maxWidth: 400 }}>
            {notifications.map(n => (
              <ListItem key={n.id} sx={{ bgcolor: n.read ? undefined : '#e3f2fd' }}>
                <ListItemIcon>
                  <MessageIcon color={n.read ? 'disabled' : 'primary'} />
                </ListItemIcon>
                <ListItemText
                  primary={translateNotificationMessage(n.message)}
                  secondary={new Date(n.createdAt).toLocaleTimeString()}
                  onClick={() => handleMarkAsRead(n.id)}
                  sx={{ cursor: 'pointer' }}
                />
                <IconButton size="small" onClick={() => handleDelete(n.id)} title={t('notifications.actions.deleteNotification')}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
        {notifications.length > 0 && (
          <>
            <Divider />
            <MenuItem onClick={handleViewAll}>
              <ListItemIcon>
                <ViewListIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('notifications.viewAll')} />
            </MenuItem>
          </>
        )}
      </Menu>
      
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

export default NotificationCenter;
