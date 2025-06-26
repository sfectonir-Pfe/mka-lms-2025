import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, ButtonGroup, Tooltip } from '@mui/material';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  const getButtonStyle = (lang) => ({
    fontWeight: i18n.language === lang ? 'bold' : 'normal',
    backgroundColor: i18n.language === lang ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
  });

  return (
    <ButtonGroup variant="outlined" size="small" aria-label="language selector">
      <Tooltip title="English">
        <Button onClick={() => changeLanguage('en')} sx={getButtonStyle('en')}>EN</Button>
      </Tooltip>
      <Tooltip title="Français">
        <Button onClick={() => changeLanguage('fr')} sx={getButtonStyle('fr')}>FR</Button>
      </Tooltip>
      <Tooltip title="العربية">
        <Button onClick={() => changeLanguage('ar')} sx={getButtonStyle('ar')}>AR</Button>
      </Tooltip>
    </ButtonGroup>
  );
};

export default LanguageSelector;
