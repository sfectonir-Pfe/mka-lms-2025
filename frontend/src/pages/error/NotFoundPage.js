import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <div className="mb-4">
          <h1 className="display-1 fw-bold text-primary mb-0">404</h1>
          <h2 className="h4 text-muted mb-4">{t('notFound.title')}</h2>
        </div>
        
        <div className="mb-4">
          <svg width="200" height="200" viewBox="0 0 200 200" className="text-muted">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
            <path d="M70 70 L130 130 M130 70 L70 130" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        
        <p className="text-muted mb-4 fs-5">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="btn btn-primary btn-lg px-4 py-2 text-decoration-none rounded-pill"
        >
          <i className="bi bi-house-door me-2"></i>
          {t('notFound.backToHome')}
        </Link>
      </div>
    </div>
  );
}
