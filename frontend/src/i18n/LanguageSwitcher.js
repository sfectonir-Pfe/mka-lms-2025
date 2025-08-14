import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  const getLanguageLabel = () => {
    switch(i18n.language) {
      case 'fr': return 'FR';
      case 'en': return 'EN';
      case 'ar': return 'ع';
      default: return 'FR';
    }
  };

  return (
    <>
      <Button
        startIcon={<LanguageIcon />}
        onClick={handleClick}
        color="inherit"
      >
        {getLanguageLabel()}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => changeLanguage('fr')}>Français</MenuItem>
        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage('ar')}>العربية</MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;