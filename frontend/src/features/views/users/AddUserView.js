import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

  // New: session selection
  const [sessions, setSessions] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);

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
    await api.post("/users", payload); // <--- NOW using correct payload
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
    <div className="container mt-5">
      <h2 className="mb-4">{t('users.addUser')}</h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        <div className="mb-3">
          <label className="form-label">{t('common.email')} :</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder={t('users.emailPlaceholder')}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('profile.phone')} :</label>
          <div className="input-group">
            <div className="dropdown" style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                type="button"
                className="btn btn-outline-secondary dropdown-toggle"
                style={{ minWidth: '140px', textAlign: 'left' }}
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              >
                <img 
                  src={`https://flagcdn.com/20x15/${selectedCountry.flagCode}.png`} 
                  alt={t(`countries.${selectedCountry.nameKey}`)} 
                  style={{ marginRight: '8px' }}
                /> 
                {selectedCountry.code}
              </button>
              {showCountryDropdown && (
                <div className="dropdown-menu show" style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  zIndex: 1000,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  width: '300px'
                }}>
                  <div className="p-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder={t('common.search')}
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setCountryCode(country.code);
                        setShowCountryDropdown(false);
                        setCountrySearch('');
                      }}
                    >
                      <img 
                        src={`https://flagcdn.com/20x15/${country.flagCode}.png`} 
                        alt={t(`countries.${country.nameKey}`)} 
                        style={{ marginRight: '8px' }}
                      /> 
                      {country.code} - {t(`countries.${country.nameKey}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('users.phonePlaceholder')}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">{t('profile.role')} :</label>
          <select
  className="form-select"
  value={role}
  onChange={e => {
    setRole(e.target.value);
    setEtablissement2Id(''); // reset
  }}
>
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {t('role.' + r.key)}
              </option>
            ))}
          </select>
        </div>
{role === "Etudiant" && (
  <div className="mb-3">
    <label className="form-label">{t('users.chooseEstablishment')} :</label>
    <select
      className="form-select"
      value={etablissement2Id}
      onChange={(e) => setEtablissement2Id(e.target.value)}
      required
    >
      <option value="">-- {t('common.select')} --</option>
      {etabs.map((e) => (
        <option key={e.id} value={e.id}>
          {e.name || `${t('users.establishment')} ${e.id}`}
        </option>
      ))}
    </select>
  </div>
)}

{role === "Etablissement" && (
  <div className="mb-3">
    <label className="form-label">{t('users.newEstablishmentName')} :</label>
    <input
      type="text"
      className="form-control"
      value={etablissement2Id}
      onChange={(e) => setEtablissement2Id(e.target.value)}
      placeholder="ex: Lycée Ibn Khaldoun"
      required
    />
  </div>
)}


        <div className="mb-3">
  <label className="form-label">{t('users.assignSessions')} :</label>
  <div style={{ maxHeight: 140, overflowY: "auto", border: "1px solid #eee", borderRadius: 4, padding: 8, background: "#fafbfc" }}>
    {sessions.length === 0 && (
      <div className="text-muted">{t('users.noSessionsAvailable')}</div>
    )}
    {sessions.map((s) => (
      <div key={s.id} className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id={`session-${s.id}`}
          value={s.id}
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
        <label className="form-check-label" htmlFor={`session-${s.id}`}>
          {s.name || `Session ${s.id}`}
        </label>
      </div>
    ))}
  </div>
  <div className="form-text">
    <small>{t('users.selectMultipleSessions')}</small>
  </div>
</div>


        {errorMessage && (
          <div className="alert alert-danger mt-3">{errorMessage}</div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? t('users.creating') : t('users.addUser')}
        </button>

        <button
          type="button"
          className="btn btn-danger w-100 mt-2"
          onClick={() => navigate(-1)}
        >
          {t('common.cancel')}
        </button>
      </form>
    </div>
  );
};

export default AddUserView;
