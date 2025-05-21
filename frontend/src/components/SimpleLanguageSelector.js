import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, ButtonGroup } from '@mui/material';

const SimpleLanguageSelector = () => {
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
    backgroundColor: i18n.language === lang ? 'rgba(13, 110, 253, 0.1)' : 'transparent',
    color: i18n.language === lang ? '#0d6efd' : '#6c757d',
    border: i18n.language === lang ? '1px solid #0d6efd' : '1px solid #dee2e6',
    '&:hover': {
      backgroundColor: i18n.language === lang ? 'rgba(13, 110, 253, 0.15)' : 'rgba(108, 117, 125, 0.1)',
      color: i18n.language === lang ? '#0d6efd' : '#6c757d',
      border: i18n.language === lang ? '1px solid #0d6efd' : '1px solid #6c757d'
    }
  });

  // Drapeaux pour chaque langue
  const flagMap = {
    en: "🇬🇧",
    fr: "🇫🇷",
    ar: "🇸🇦"
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <ButtonGroup aria-label="language selector">
        <Button 
          onClick={() => changeLanguage('en')}
          sx={getButtonStyle('en')}
          className="btn"
        >
          <span style={{ marginRight: '5px' }}>{flagMap.en}</span> English
        </Button>
        <Button 
          onClick={() => changeLanguage('fr')}
          sx={getButtonStyle('fr')}
          className="btn"
        >
          <span style={{ marginRight: '5px' }}>{flagMap.fr}</span> Français
        </Button>
        <Button 
          onClick={() => changeLanguage('ar')}
          sx={getButtonStyle('ar')}
          className="btn"
        >
          <span style={{ marginRight: '5px' }}>{flagMap.ar}</span> العربية
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default SimpleLanguageSelector;
