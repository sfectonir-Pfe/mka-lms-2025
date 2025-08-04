import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

// Drapeaux par code de langue
const flagImages = {
  en: "https://flagcdn.com/w40/us.png",
  fr: "https://flagcdn.com/w40/fr.png",
  ar: "https://flagcdn.com/w40/tn.png"
};

// Composant d'affichage du drapeau
const Flag = ({ code, size = 24 }) => {
  const langCode = code.split('-')[0]; // ex: en-US -> en
  const src = flagImages[langCode];

  if (!src) return null;

  return (
    <Box
      component="img"
      src={src}
      alt={`${langCode} flag`}
      sx={{
        width: size,
        height: 'auto',
        mr: 1,
        borderRadius: '2px',
        objectFit: 'cover'
      }}
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  );
};

const LanguageSelectorWithFlags = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // Initialize language from localStorage on component mount
  useEffect(() => {
  const savedLanguage = localStorage.getItem('userLanguage');
  if (savedLanguage) {
    i18n.changeLanguage(savedLanguage);
  }
  setCurrentLang(i18n.language);
  
  // Apply correct text direction
  const lang = i18n.language.split('-')[0];
  if (lang === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lang;
  }
}, [i18n]); // Ajout de i18n comme dépendance
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (language) => {
    try {
      // Change language using i18n
      i18n.changeLanguage(language);
      
      // Update current language state
      setCurrentLang(language);
      
      // Store language preference in localStorage
      localStorage.setItem('userLanguage', language);
      
      // Apply correct text direction immediately
      if (language === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = language;
      }
      
      // Close the menu
      handleClose();
      
      // Force page refresh to ensure all components update with new language
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const getCurrentLanguageName = () => {
    const lang = i18n.language.split('-')[0];
    switch (lang) {
      case 'fr': return 'Français';
      case 'ar': return 'العربية';
      default: return 'English';
    }
  };

  return (
    <Box>
      <Tooltip title={t('common.changeLanguage', 'Change language')} arrow>
        <Button
          id="language-button"
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={<Flag code={currentLang} />}
          endIcon={<LanguageIcon fontSize="small" />}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 'medium',
            boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            px: 2,
            py: 0.8,
            minWidth: '120px',
            '&:hover': {
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)'
            },
            '&:focus': {
              boxShadow: '0 0 0 3px rgba(63, 81, 181, 0.25)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            }
          }}
        >
          {getCurrentLanguageName()}
        </Button>
      </Tooltip>


      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
          dense: false,
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180,
            overflow: 'visible',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        autoFocus={true}
        disableAutoFocusItem={false}
        transitionDuration={200}
      >
        <MenuItem
          onClick={() => changeLanguage('en')}
          selected={currentLang.startsWith('en')}
          sx={{ 
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(63, 81, 181, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(63, 81, 181, 0.12)',
              }
            }
          }}
        >
          <ListItemIcon><Flag code="en" /></ListItemIcon>
          <ListItemText>English</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => changeLanguage('fr')}
          selected={currentLang.startsWith('fr')}
          sx={{ 
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(63, 81, 181, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(63, 81, 181, 0.12)',
              }
            }
          }}
        >
          <ListItemIcon><Flag code="fr" /></ListItemIcon>
          <ListItemText>Français</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => changeLanguage('ar')}
          selected={currentLang.startsWith('ar')}
          sx={{ 
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(63, 81, 181, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(63, 81, 181, 0.12)',
              }
            }
          }}
        >
          <ListItemIcon><Flag code="ar" /></ListItemIcon>
          <ListItemText>العربية</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageSelectorWithFlags;
