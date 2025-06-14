import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, ButtonGroup, Tooltip } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

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
  };

  // Style pour le bouton actif
  const getButtonStyle = (lang) => ({
    fontWeight: i18n.language === lang ? 'bold' : 'normal',
    backgroundColor: i18n.language === lang ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
    minWidth: '40px',
    px: 1,
    '&:hover': {
      backgroundColor: i18n.language === lang ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.04)'
    }
  });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ButtonGroup
        variant="outlined"
        size="small"
        aria-label="language selector"
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      >
        <Tooltip title="English">
          <Button
            onClick={() => changeLanguage('en')}
            sx={getButtonStyle('en')}
          >
            EN
          </Button>
        </Tooltip>
        <Tooltip title="Français">
          <Button
            onClick={() => changeLanguage('fr')}
            sx={getButtonStyle('fr')}
          >
            FR
          </Button>
        </Tooltip>
        <Tooltip title="العربية">
          <Button
            onClick={() => changeLanguage('ar')}
            sx={getButtonStyle('ar')}
          >
            AR
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};

export default LanguageSelector;
