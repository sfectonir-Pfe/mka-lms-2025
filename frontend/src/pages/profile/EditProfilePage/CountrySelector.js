import React, { useState, useRef, useEffect } from 'react';
import { Button, Paper, TextField, MenuItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const countries = [
  { code: "+33", nameKey: "france", flagCode: "fr" },
  { code: "+1", nameKey: "usa", flagCode: "us" },
  { code: "+44", nameKey: "uk", flagCode: "gb" },
  { code: "+49", nameKey: "germany", flagCode: "de" },
  { code: "+34", nameKey: "spain", flagCode: "es" },
  { code: "+39", nameKey: "italy", flagCode: "it" },
  { code: "+212", nameKey: "morocco", flagCode: "ma" },
  { code: "+213", nameKey: "algeria", flagCode: "dz" },
  { code: "+216", nameKey: "tunisia", flagCode: "tn" },
  { code: "+20", nameKey: "egypt", flagCode: "eg" },
  { code: "+966", nameKey: "saudi", flagCode: "sa" },
  { code: "+971", nameKey: "uae", flagCode: "ae" },
  { code: "+7", nameKey: "russia", flagCode: "ru" },
  { code: "+86", nameKey: "china", flagCode: "cn" },
  { code: "+81", nameKey: "japan", flagCode: "jp" },
  { code: "+82", nameKey: "korea", flagCode: "kr" },
  { code: "+91", nameKey: "india", flagCode: "in" },
  { code: "+55", nameKey: "brazil", flagCode: "br" },
  { code: "+52", nameKey: "mexico", flagCode: "mx" },
  { code: "+54", nameKey: "argentina", flagCode: "ar" },
  { code: "+61", nameKey: "australia", flagCode: "au" },
  { code: "+64", nameKey: "newzealand", flagCode: "nz" },
  { code: "+27", nameKey: "southafrica", flagCode: "za" },
  { code: "+234", nameKey: "nigeria", flagCode: "ng" },
  { code: "+254", nameKey: "kenya", flagCode: "ke" },
  { code: "+90", nameKey: "turkey", flagCode: "tr" },
  { code: "+98", nameKey: "iran", flagCode: "ir" },
  { code: "+92", nameKey: "pakistan", flagCode: "pk" },
  { code: "+880", nameKey: "bangladesh", flagCode: "bd" },
  { code: "+84", nameKey: "vietnam", flagCode: "vn" },
  { code: "+66", nameKey: "thailand", flagCode: "th" },
  { code: "+65", nameKey: "singapore", flagCode: "sg" },
  { code: "+60", nameKey: "malaysia", flagCode: "my" },
  { code: "+62", nameKey: "indonesia", flagCode: "id" },
  { code: "+63", nameKey: "philippines", flagCode: "ph" },
  { code: "+32", nameKey: "belgium", flagCode: "be" },
  { code: "+31", nameKey: "netherlands", flagCode: "nl" },
  { code: "+41", nameKey: "switzerland", flagCode: "ch" },
  { code: "+43", nameKey: "austria", flagCode: "at" },
  { code: "+46", nameKey: "sweden", flagCode: "se" },
  { code: "+47", nameKey: "norway", flagCode: "no" },
  { code: "+45", nameKey: "denmark", flagCode: "dk" },
  { code: "+358", nameKey: "finland", flagCode: "fi" },
  { code: "+48", nameKey: "poland", flagCode: "pl" },
  { code: "+420", nameKey: "czech", flagCode: "cz" },
  { code: "+36", nameKey: "hungary", flagCode: "hu" },
  { code: "+30", nameKey: "greece", flagCode: "gr" },
  { code: "+351", nameKey: "portugal", flagCode: "pt" },
  { code: "+353", nameKey: "ireland", flagCode: "ie" },
  { code: "+1", nameKey: "canada", flagCode: "ca" }
];

const CountrySelector = ({ countryCode, onCountryChange, disabled = false }) => {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const selectedCountry = countries.find(c => c.code === countryCode) || countries[8];
  const filteredCountries = countries.filter(country =>
    t(`countries.${country.nameKey}`).toLowerCase().includes(search.toLowerCase()) ||
    country.code.includes(search)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (code) => {
    onCountryChange(code);
    setShowDropdown(false);
    setSearch('');
  };

  return (
    <Box sx={{ position: 'relative' }} ref={dropdownRef}>
      <Button
        variant="outlined"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={disabled}
        sx={{
          minWidth: '140px',
          height: '56px',
          justifyContent: 'flex-start',
          textTransform: 'none',
          borderColor: 'rgba(0, 0, 0, 0.23)',
          color: 'text.primary',
          '&:hover': { borderColor: 'rgba(0, 0, 0, 0.87)' }
        }}
      >
        <img 
          src={`https://flagcdn.com/20x15/${selectedCountry.flagCode}.png`} 
          alt={t(`countries.${selectedCountry.nameKey}`)} 
          style={{ marginRight: '8px' }}
        /> 
        {selectedCountry.code}
      </Button>
      
      {showDropdown && (
        <Paper sx={{
          position: 'absolute',
          top: '100%',
          left: 0,
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto',
          width: '300px',
          mt: 1
        }}>
          <Box sx={{ p: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </Box>
          {filteredCountries.map((country) => (
            <MenuItem
              key={country.code + country.flagCode}
              onClick={() => handleCountrySelect(country.code)}
              sx={{ px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                <img 
                  src={`https://flagcdn.com/20x15/${country.flagCode}.png`} 
                  alt={t(`countries.${country.nameKey}`)} 
                  style={{ width: '20px', height: '15px' }}
                />
              </ListItemIcon>
              <ListItemText>
                {country.code} - {t(`countries.${country.nameKey}`)}
              </ListItemText>
            </MenuItem>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default CountrySelector; 