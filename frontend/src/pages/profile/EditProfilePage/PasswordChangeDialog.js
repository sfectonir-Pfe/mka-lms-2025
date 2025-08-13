import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const PasswordChangeDialog = ({ open, onClose, onSubmit, loading = false, error = "" }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return "";
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    if (strength <= 2) return t('profile.passwordStrengthWeak');
    if (strength <= 4) return t('profile.passwordStrengthMedium');
    return t('profile.passwordStrengthStrong');
  };

  const passwordStrength = getPasswordStrength(form.newPassword);
  const isStrongPassword = passwordStrength === t('profile.passwordStrengthStrong');

  const handleSubmit = () => {
    onSubmit(form);
  };

  const handleClose = () => {
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {t('profile.changePassword')}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogContentText sx={{ mb: 2 }}>
          {t('profile.changePasswordDescription')}
        </DialogContentText>

        <TextField
          label={t('profile.currentPassword')}
          name="currentPassword"
          type={showPasswords.current ? "text" : "password"}
          value={form.currentPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => togglePasswordVisibility('current')}>
                  {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label={t('profile.newPassword')}
          name="newPassword"
          type={showPasswords.new ? "text" : "password"}
          value={form.newPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => togglePasswordVisibility('new')}>
                  {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {form.newPassword && (
          <Box sx={{ mt: 1, mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              {t('profile.passwordStrength')}:
              <Box component="span" sx={{
                ml: 1,
                fontWeight: 'bold',
                color: isStrongPassword ? 'success.main' : 'warning.main'
              }}>
                {passwordStrength.toUpperCase()}
              </Box>
            </Typography>

            <Box sx={{ width: '100%', height: 4, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
              <Box sx={{
                height: '100%',
                width: isStrongPassword ? '100%' : '60%',
                bgcolor: isStrongPassword ? 'success.main' : 'warning.main',
                transition: 'width 0.3s ease'
              }} />
            </Box>

            {!isStrongPassword && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  {t('profile.strongPasswordTips')}:
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color={form.newPassword.length >= 8 ? 'success.main' : 'text.secondary'}>
                      {form.newPassword.length >= 8 ? '✓' : '○'} {t('profile.atLeast8Chars')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color={/[A-Z]/.test(form.newPassword) ? 'success.main' : 'text.secondary'}>
                      {/[A-Z]/.test(form.newPassword) ? '✓' : '○'} {t('profile.oneUppercase')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color={/[a-z]/.test(form.newPassword) ? 'success.main' : 'text.secondary'}>
                      {/[a-z]/.test(form.newPassword) ? '✓' : '○'} {t('profile.oneLowercase')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color={/\d/.test(form.newPassword) ? 'success.main' : 'text.secondary'}>
                      {/\d/.test(form.newPassword) ? '✓' : '○'} {t('profile.oneDigit')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color={/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword) ? 'success.main' : 'text.secondary'}>
                      {/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword) ? '✓' : '○'} {t('profile.oneSpecialChar')}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        )}

        <TextField
          label={t('profile.confirmNewPassword')}
          name="confirmPassword"
          type={showPasswords.confirm ? "text" : "password"}
          value={form.confirmPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                  {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Lock />}
        >
          {loading ? t('common.updating') : t('profile.updatePassword')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordChangeDialog; 