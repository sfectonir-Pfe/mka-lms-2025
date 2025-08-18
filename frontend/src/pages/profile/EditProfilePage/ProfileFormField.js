import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const ProfileFormField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  disabled = false, 
  multiline = false, 
  rows = 1,
  helperText,
  startIcon,
  placeholder,
  type = "text"
}) => (
  <TextField
    label={label}
    name={name}
    fullWidth
    value={value || ""}
    onChange={onChange}
    disabled={disabled}
    multiline={multiline}
    rows={rows}
    helperText={helperText}
    placeholder={placeholder}
    type={type}
    margin="normal"
    slotProps={{
      input: startIcon ? {
        startAdornment: (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        )
      } : undefined
    }}
  />
);

export default ProfileFormField; 