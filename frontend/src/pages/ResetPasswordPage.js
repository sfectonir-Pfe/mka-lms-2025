import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ToastError from "../components/ToastError";
import ToastSuccess from "../components/ToastSuccess";


function ResetPasswordPage() {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [searchParams] = useSearchParams();
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

    if (strength <= 2) return t('resetPassword.weak');
    if (strength === 3 || strength === 4) return t('resetPassword.medium');
    if (strength === 5) return t('resetPassword.strong');
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setToastMsg(`❌ ${t('resetPassword.passwordsDoNotMatch')}`);
      setShowToast(true);
      return;
    }

    if (!token) {
      setToastMsg(`❌ ${t('resetPassword.invalidToken')}`);
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

      setToastMsg(`✅ ${t('resetPassword.successMessage')}`);
setShowSuccess(true);

setTimeout(() => {
  navigate('/reset-success');
}, 2000);


    } catch (error) {
      console.error(error);
      setToastMsg(`❌ ${t('resetPassword.errorMessage')}`);
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
          <h2 className="fw-bold text-primary">{t('resetPassword.title')}</h2>
          <div className="border-bottom border-primary mx-auto mb-2" style={{ width: '80px', height: '3px' }}></div>
          <p className="text-muted">{t('resetPassword.subtitle')}</p>
        </div>

        <form onSubmit={handleReset}>
          <div className="mb-3 position-relative">
            <label htmlFor="newPassword" className="form-label fw-semibold">{t('resetPassword.newPassword')}</label>
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
{t('resetPassword.strength')}: {passwordStrength}
              </small>
            )}
          </div>

          <div className="mb-4 position-relative">
            <label htmlFor="confirmPassword" className="form-label fw-semibold">{t('resetPassword.confirmPassword')}</label>
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
              🔒 {t('resetPassword.securityTips')}:
              <ul className="mb-0 small">
                <li>{t('resetPassword.atLeast8Chars')}</li>
                <li>{t('resetPassword.upperLowerCase')}</li>
                <li>{t('resetPassword.oneDigit')}</li>
                <li>{t('resetPassword.specialChar')}</li>
              </ul>
            </p>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {t('resetPassword.resetting')}...
              </>
            ) : (
              t('resetPassword.resetButton')
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
