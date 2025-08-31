import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const AddUserView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+216");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Etudiant");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [etabs, setEtabs] = useState([]);
  const [etablissement2Id, setEtablissement2Id] = useState('');

  // New: session selection
  const [sessions, setSessions] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);

  const styles = {
    primary: {
      borderRadius: 3,
      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px rgba(25,118,210,0.4)'
      }
    },
    danger: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #d32f2f, #ef5350)',
      boxShadow: '0 6px 18px rgba(211,47,47,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(211,47,47,0.35)' }
    },
    success: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
      boxShadow: '0 6px 18px rgba(46,125,50,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(46,125,50,0.35)' }
    },
    info: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #0288d1, #29b6f6)',
      boxShadow: '0 6px 18px rgba(2,136,209,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(2,136,209,0.35)' }
    },
    secondary: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #7b1fa2, #ab47bc)',
      boxShadow: '0 6px 18px rgba(123,31,162,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(123,31,162,0.35)' }
    },
    rounded: { borderRadius: 2 }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Fetch sessions on mount
    api
      .get("/session2")
      .then(res => setSessions(res.data))
      .catch(() => setSessions([]));
  }, []);

  useEffect(() => {
    api
      .get("/etablissement2")
      .then(res => setEtabs(res.data))
      .catch(() => setEtabs([]));
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateEmail(email)) {
      const msg = t('users.invalidEmail');
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    const payload = {
      email,
      phone: countryCode + phone,
      role,
      session2Ids: selectedSessions.map((id) => Number(id)),
    };

    if (role === "Etudiant" && etablissement2Id) {
      payload.etablissement2Id = Number(etablissement2Id);
    }

    if (role === "Etablissement" && etablissement2Id.trim()) {
      // here etablissement2Id is used as the text name
      payload.etablissement2Name = etablissement2Id.trim();
    }

    try {
      await api.post("/users", payload);
      toast.success(t('users.createSuccess'));
      setTimeout(() => navigate("/users"), 600);
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.status === 409 &&
        error.response.data.message.includes("Email invalide")
      ) {
        const msg = t('users.emailInvalidOrUndeliverable');
        setErrorMessage(msg);
        toast.error(msg);
      } else if (
        error.response &&
        error.response.status === 409 &&
        error.response.data.message.includes("existe déjà")
      ) {
        const msg = t('users.userAlreadyExists');
        setErrorMessage(msg);
        toast.error(msg);
      } else {
        const msg = t('users.createError');
        setErrorMessage(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const filteredCountries = countries.filter(country =>
    t(`countries.${country.nameKey}`).toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.includes(countrySearch)
  );

  const selectedCountry = countries.find(c => c.code === countryCode) || countries[0];

  const roleOptions = [
    { value: "Etudiant", key: "etudiant" },
    { value: "Formateur", key: "formateur" },
    { value: "CreateurDeFormation", key: "createurdeformation" },
    { value: "Etablissement", key: "etablissement" },
    { value: "Admin", key: "admin" }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
        👤 {t('users.addUser')}
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label={t('common.email')}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder={t('users.emailPlaceholder')}
              variant="outlined"
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t('profile.phone')} :
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ position: 'relative' }} ref={dropdownRef}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    sx={{ 
                      minWidth: 140, 
                      justifyContent: 'space-between',
                      borderColor: 'grey.300'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img 
                        src={`https://flagcdn.com/20x15/${selectedCountry.flagCode}.png`} 
                        alt={t(`countries.${selectedCountry.nameKey}`)} 
                      /> 
                      {selectedCountry.code}
                    </Box>
                    {showCountryDropdown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Button>
                  
                  <Collapse in={showCountryDropdown}>
                    <Paper 
                      elevation={8} 
                      sx={{ 
                        position: 'absolute', 
                        top: '100%', 
                        left: 0, 
                        zIndex: 1000,
                        maxHeight: 300,
                        overflowY: 'auto',
                        width: 300,
                        mt: 1
                      }}
                    >
                      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder={t('common.search')}
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      <List sx={{ p: 0 }}>
                        {filteredCountries.map((country) => (
                          <ListItem
                            key={country.code}
                            button
                            onClick={() => {
                              setCountryCode(country.code);
                              setShowCountryDropdown(false);
                              setCountrySearch('');
                            }}
                            sx={{ 
                              '&:hover': { bgcolor: 'action.hover' },
                              py: 1
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <img 
                                src={`https://flagcdn.com/20x15/${country.flagCode}.png`} 
                                alt={t(`countries.${country.nameKey}`)} 
                              />
                            </ListItemIcon>
                            <ListItemText 
                              primary={`${country.code} - ${t(`countries.${country.nameKey}`)}`}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Collapse>
                </Box>
                
                <TextField
                  fullWidth
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('users.phonePlaceholder')}
                  required
                  variant="outlined"
                />
              </Box>
            </Box>

            <FormControl fullWidth>
              <InputLabel>{t('profile.role')}</InputLabel>
              <Select
                value={role}
                onChange={e => {
                  setRole(e.target.value);
                  setEtablissement2Id('');
                }}
                label={t('profile.role')}
              >
                {roleOptions.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {t('role.' + r.key)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {role === "Etudiant" && (
              <FormControl fullWidth>
                <InputLabel>{t('users.chooseEstablishment')}</InputLabel>
                <Select
                  value={etablissement2Id}
                  onChange={(e) => setEtablissement2Id(e.target.value)}
                  label={t('users.chooseEstablishment')}
                  required
                >
                  <MenuItem value="">
                    <em>-- {t('common.select')} --</em>
                  </MenuItem>
                  {etabs.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.name || `${t('users.establishment')} ${e.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {role === "Etablissement" && (
              <TextField
                fullWidth
                label={t('users.newEstablishmentName')}
                type="text"
                value={etablissement2Id}
                onChange={(e) => setEtablissement2Id(e.target.value)}
                placeholder="ex: Lycée Ibn Khaldoun"
                required
                variant="outlined"
              />
            )}

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t('users.assignSessions')} :
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  maxHeight: 200, 
                  overflowY: "auto", 
                  p: 2 
                }}
              >
                {sessions.length === 0 ? (
                  <Typography color="text.secondary" variant="body2">
                    {t('users.noSessionsAvailable')}
                  </Typography>
                ) : (
                  <FormGroup>
                    {sessions.map((s) => (
                      <FormControlLabel
                        key={s.id}
                        control={
                          <Checkbox
                            checked={selectedSessions.includes(String(s.id))}
                            onChange={e => {
                              const id = String(s.id);
                              setSelectedSessions(selectedSessions =>
                                e.target.checked
                                  ? [...selectedSessions, id]
                                  : selectedSessions.filter(val => val !== id)
                              );
                            }}
                          />
                        }
                        label={s.name || `Session ${s.id}`}
                      />
                    ))}
                  </FormGroup>
                )}
              </Paper>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {t('users.selectMultipleSessions')}
              </Typography>
            </Box>

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={styles.success}
                fullWidth
              >
                {loading ? t('users.creating') : `✅ ${t('users.addUser')}`}
              </Button>

              <Button
                type="button"
                variant="contained"
                onClick={() => navigate(-1)}
                sx={styles.danger}
                fullWidth
              >
                ❌ {t('common.cancel')}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddUserView;
