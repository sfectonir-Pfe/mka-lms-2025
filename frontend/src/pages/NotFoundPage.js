import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('notFound.title')}</h1>
      <div className="text-center mt-4">
        <Link to="/" className="text-decoration-none">
          {t('notFound.backToHome')}
        </Link>
      </div>
      
    </div>
  );
}
