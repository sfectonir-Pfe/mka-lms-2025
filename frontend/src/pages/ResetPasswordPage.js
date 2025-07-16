import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ToastError from "../components/ToastError";
import ToastSuccess from "../components/ToastSuccess";


function ResetPasswordPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [searchParams] = useSearchParams();//get token from url and send it tobackend
  const token = searchParams.get('token');
  const navigate = useNavigate();

  // Clean URL
  React.useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.delete("token");
    url.searchParams.delete("email");
    window.history.replaceState({}, document.title, url.pathname);
  }, []);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'faible';
    if (strength === 3 || strength === 4) return 'moyenne';
    if (strength === 5) return 'forte';
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setToastMsg("❌ Les mots de passe ne correspondent pas.");
      setShowToast(true);
      return;
    }

    if (!token) {
      setToastMsg("❌ Lien invalide ou expiré.");
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:8000/auth/reset-password', {
        token,
        newPass: newPassword,
        confirmPass: confirmPassword,
      });

      setToastMsg("✅ Mot de passe mis à jour avec succès.");
setShowSuccess(true);

setTimeout(() => {
  navigate('/reset-success');
}, 2000);


    } catch (error) {
      console.error(error);
      setToastMsg("❌ Une erreur est survenue. Vérifiez le lien ou réessayez.");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };


  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Réinitialiser le mot de passe</h2>
          <div className="border-bottom border-primary mx-auto mb-2" style={{ width: '80px', height: '3px' }}></div>
          <p className="text-muted">Entrez un nouveau mot de passe sécurisé</p>
        </div>

        <form onSubmit={handleReset}>
          <div className="mb-3 position-relative">
            <label htmlFor="newPassword" className="form-label fw-semibold">Nouveau mot de passe</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="newPassword"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="********"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {newPassword && (
              <small className={`mt-1 d-block text-${passwordStrength === 'forte' ? 'success' : passwordStrength === 'moyenne' ? 'warning' : 'danger'}`}>
                Force : {passwordStrength}
              </small>
            )}
          </div>

          <div className="mb-4 position-relative">
            <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirmer le mot de passe</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          <div className="mb-4">
            <p className="text-muted small">
              🔒 Pour une sécurité optimale, utilisez :
              <ul className="mb-0 small">
                <li>Au moins 8 caractères</li>
                <li>Une lettre majuscule et une minuscule</li>
                <li>Un chiffre</li>
                <li>Un caractère spécial (ex: ! @ # $)</li>
              </ul>
            </p>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Réinitialisation...
              </>
            ) : (
              'Réinitialiser le mot de passe'
            )}
          </button>
        </form>
      </div>
<ToastError msg={toastMsg} show={showToast} setShow={setShowToast} />
<ToastSuccess msg={toastMsg} show={showSuccess} setShow={setShowSuccess} />
    </div>
  );
}

export default ResetPasswordPage;
