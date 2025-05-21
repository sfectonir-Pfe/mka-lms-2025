import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

// Composant pour les drapeaux
const Flag = ({ code, size = 24 }) => {
  const flagMap = {
    en: "🇬🇧",
    fr: "🇫🇷",
    ar: "🇸🇦"
  };

  return (
    <Box component="span" sx={{ fontSize: size, lineHeight: 1, mr: 1 }}>
      {flagMap[code] || "🏳️"}
    </Box>
  );
};

const LanguageSelectorWithFlags = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    
    // Si la langue est l'arabe, définir la direction du document sur RTL
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
    
    handleClose();
  };

  // Obtenir le nom de la langue actuelle
  const getCurrentLanguageName = () => {
    switch (i18n.language) {
      case 'fr': return 'Français';
      case 'ar': return 'العربية';
      default: return 'English';
    }
  };

  return (
    <Box>
      <Tooltip title={t('common.language')}>
        <Button
          id="language-button"
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={<Flag code={i18n.language} />}
          endIcon={<LanguageIcon />}
          variant="outlined"
          size="small"
          sx={{ 
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 'medium',
            boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
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
      >
        <MenuItem 
          onClick={() => changeLanguage('en')}
          selected={i18n.language === 'en'}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <Flag code="en" />
          </ListItemIcon>
          <ListItemText>English</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => changeLanguage('fr')}
          selected={i18n.language === 'fr'}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <Flag code="fr" />
          </ListItemIcon>
          <ListItemText>Français</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => changeLanguage('ar')}
          selected={i18n.language === 'ar'}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <Flag code="ar" />
          </ListItemIcon>
          <ListItemText>العربية</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageSelectorWithFlags;
