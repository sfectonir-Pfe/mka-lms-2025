import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUserView = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Etudiant");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // New: session selection
  const [sessions, setSessions] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);

  useEffect(() => {
    // Fetch sessions on mount
    axios
      .get("http://localhost:8000/session2")
      .then(res => setSessions(res.data))
      .catch(() => setSessions([]));
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateEmail(email)) {
      setErrorMessage("Adresse email invalide.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/users", {
        email,
        phone,
        role,
        session2Ids: selectedSessions.map(Number), // send as array of IDs
      });

      alert("✅ Utilisateur créé. Le mot de passe temporaire a été envoyé par email.");
      navigate("/users");
    } catch (error) {
      console.error(error);

      if (
        error.response &&
        error.response.status === 409 &&
        error.response.data.message.includes("Email invalide")
      ) {
        setErrorMessage("❌ L'adresse email semble invalide ou non délivrée.");
      } else if (
        error.response &&
        error.response.status === 409 &&
        error.response.data.message.includes("existe déjà")
      ) {
        setErrorMessage("⚠️ Cet utilisateur existe déjà.");
      } else {
        setErrorMessage("Erreur lors de la création de l'utilisateur.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSessionsChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    setSelectedSessions(options.map(opt => opt.value));
  };

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      <h2 className="mb-4">Ajouter un utilisateur</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 shadow rounded bg-light"
        style={{ minWidth: 400, maxWidth: 520, width: "100%" }}
      >
        <div className="mb-3">
          <label className="form-label">Email :</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Téléphone :</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+216xxxxxxxx"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Rôle :</label>
          <select
            className="form-select"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="Etudiant">Étudiant</option>
            <option value="Formateur">Formateur</option>
            <option value="CreateurDeFormation">Créateur de formation</option>
            <option value="Etablissement">Responsable d'établissement</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="mb-3">
  <label className="form-label">Sessions à assigner :</label>
  <div style={{ maxHeight: 140, overflowY: "auto", border: "1px solid #eee", borderRadius: 4, padding: 8, background: "#fafbfc" }}>
    {sessions.length === 0 && (
      <div className="text-muted">Aucune session disponible</div>
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
    <small>Vous pouvez cocher une ou plusieurs sessions.</small>
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
          {loading ? "Création en cours..." : "Ajouter l'utilisateur"}
        </button>

        <button
          type="button"
          className="btn btn-danger w-100 mt-2"
          onClick={() => navigate(-1)}
        >
          Annuler
        </button>
      </form>
    </div>
  );
};

export default AddUserView;
