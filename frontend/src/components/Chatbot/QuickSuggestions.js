import React from 'react';
import { LanguageService } from '../../services/languageService';

const QuickSuggestions = ({ language, onSuggestionClick, isVisible }) => {
  if (!isVisible) return null;

  const suggestions = LanguageService.getExampleQuestions(language);
  const textAlign = LanguageService.getTextAlign(language);

  return (
    <div className="mb-3">
      <div className={`small text-muted mb-2 ${textAlign}`} style={{ fontSize: '12px' }}>
        {language === 'fr' && 'Suggestions :'}
        {language === 'en' && 'Suggestions:'}
        {language === 'es' && 'Sugerencias:'}
        {language === 'ar' && 'اقتراحات:'}
      </div>
      <div className="d-flex flex-wrap gap-1">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="btn btn-outline-primary btn-sm"
            style={{ 
              fontSize: '11px', 
              padding: '4px 8px',
              borderRadius: '12px',
              whiteSpace: 'nowrap'
            }}
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSuggestions;