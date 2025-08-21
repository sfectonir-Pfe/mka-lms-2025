import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axiosInstance';
function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert(t('auth.invalidEmail'));
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert(t('auth.errorOccurred'));
    } finally {
      setLoading(false);
    }

  };

  if (submitted) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <div className="card border-primary">
              <div className="card-body p-5 text-center">
                <h2 className="fw-bold mb-4">{t('auth.emailSent')}</h2>
                <div className="border-bottom border-primary mx-auto mb-4" style={{ width: '150px', height: '2px' }}></div>
                <p className="mb-4">
                  {t('auth.resetEmailSent')}
                </p>
                <a href="/" className="btn btn-outline-primary">{t('auth.backToLogin')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card border-primary">
            <div className="card-body p-5">
              <div className="text-center mb-5">
                <h2 className="fw-bold">{t('auth.forgotPassword')}</h2>
                <div className="border-bottom border-primary mx-auto" style={{ width: '150px', height: '2px' }}></div>
              </div>

              <p className="text-center mb-4">{t('auth.enterEmailForReset')}</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4 text-center">
                  <label htmlFor="email" className="form-label fw-bold">{t('auth.email')}:</label>
                  <input
                    type="email"
                    className="form-control mx-auto"
                    id="email"
                    style={{ maxWidth: '400px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label={t('auth.email')}
                  />
                </div>

                <div className="d-grid gap-2 col-6 mx-auto">
                  <button type="submit" className="btn btn-primary py-2" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('auth.sending')}
                      </>
                    ) : (
                      t('auth.sendLink')
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <a href="/" className="text-decoration-none">{t('auth.backToLogin')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
