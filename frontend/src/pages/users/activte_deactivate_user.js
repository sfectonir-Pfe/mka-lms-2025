import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  CircularProgress,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Block,
  CheckCircle,
  Refresh,
  ExitToApp,
  Warning,
  Celebration,
} from '@mui/icons-material';
import api from '../../api/axiosInstance';
import { getToken, clearAuth } from '../auth/token';

const ActivateDeactivateUser = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [user, setUser] = useState(null);

  // Check user status on component mount
  useEffect(() => {
    checkUserStatus();
    // Set up periodic status checking every 30 seconds
    const interval = setInterval(checkUserStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkUserStatus = async () => {
    try {
      const token = getToken();
      if (!token) {
        handleLogout();
        return;
      }

      // Decode token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.sub;

      console.log('🔍 Checking user status for ID:', userId);

      const response = await api.get(`/users/id/${userId}`);
      const userData = response.data;

      console.log('👤 User data:', userData);

      setUser(userData);

      // Check if user was previously deactivated and is now active
      if (userStatus === false && userData.isActive === true) {
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 5000); // Hide welcome after 5 seconds
      }

      setUserStatus(userData.isActive);
    } catch (error) {
      console.error('❌ Error checking user status:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  const handleRefreshStatus = () => {
    setChecking(true);
    checkUserStatus();
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6">
            {t('common.loading')}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Show welcome back message when user is reactivated
  if (showWelcome && userStatus === true) {
    return (
      <Fade in={showWelcome}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Celebration Animation Background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
          
          <Container maxWidth="md">
            <Card
              sx={{
                textAlign: 'center',
                p: 6,
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                background: alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(10px)',
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  bgcolor: theme.palette.success.main,
                  fontSize: '3rem',
                }}
              >
                <Celebration sx={{ fontSize: '4rem' }} />
              </Avatar>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.success.main,
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🎉 Welcome Back!
              </Typography>

              <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
                Hello {user?.name || user?.email?.split('@')[0]}!
              </Typography>

              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.1rem' }}>
                Your account has been reactivated! You can now access all features of the platform.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={() => window.location.href = '/dashboard'}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.success.dark}, ${theme.palette.primary.dark})`,
                  },
                }}
              >
                Continue to Dashboard
              </Button>
            </Card>
          </Container>
        </Box>
      </Fade>
    );
  }

  // Show deactivated account page
  if (userStatus === false) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 100%)`,
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          <Card
            sx={{
              textAlign: 'center',
              p: 6,
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              background: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 3,
                bgcolor: theme.palette.error.main,
                fontSize: '3rem',
              }}
            >
              <Block sx={{ fontSize: '4rem' }} />
            </Avatar>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: theme.palette.error.main,
                mb: 2,
              }}
            >
              Account Deactivated
            </Typography>

            <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
              Hello {user?.name || user?.email?.split('@')[0]}
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Your account has been temporarily deactivated by an administrator. 
              You cannot access the platform at this time.
            </Typography>

            <Box
              sx={{
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                borderRadius: 2,
                p: 3,
                mb: 4,
              }}
            >
              <Warning sx={{ color: theme.palette.warning.main, mb: 1 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                If you believe this is an error, please contact your administrator or support team.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={checking ? <CircularProgress size={16} /> : <Refresh />}
                onClick={handleRefreshStatus}
                disabled={checking}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                {checking ? 'Checking...' : 'Check Status'}
              </Button>

              <Button
                variant="contained"
                startIcon={<ExitToApp />}
                onClick={handleLogout}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  bgcolor: theme.palette.grey[600],
                  '&:hover': {
                    bgcolor: theme.palette.grey[700],
                  },
                }}
              >
                Logout
              </Button>
            </Box>

            {/* User Info */}
            <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Account: {user?.email} | Role: {user?.role} | Status: Deactivated
              </Typography>
            </Box>
          </Card>
        </Container>
      </Box>
    );
  }

  // If user is active, redirect to dashboard
  if (userStatus === true) {
    window.location.href = '/dashboard';
    return null;
  }

  return null;
};

export default ActivateDeactivateUser;