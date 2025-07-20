# Système de traduction multilingue

Ce dossier contient la configuration et les fichiers de traduction pour le support multilingue de l'application.

## Structure

- `index.js` : Configuration principale d'i18next
- `locales/` : Dossier contenant les fichiers de traduction pour chaque langue
  - `en.json` : Traductions en anglais
  - `fr.json` : Traductions en français
  - `ar.json` : Traductions en arabe

## Comment utiliser les traductions

### Dans les composants React

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
}
```

### Changer la langue

```jsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    
    // Gérer la direction du texte pour l'arabe
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  };
  
  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fr')}>Français</button>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
    </div>
  );
}
```

## Structure des fichiers de traduction

Les fichiers de traduction sont organisés par sections pour faciliter la maintenance :

```json
{
  "common": {
    "login": "Login",
    "logout": "Logout",
    "register": "Register",
    ...
  },
  "auth": {
    "loginTitle": "Login to your account",
    "registerTitle": "Create a new account",
    ...
  },
  "profile": {
    "editProfile": "Edit Profile",
    "viewProfile": "View Profile",
    ...
  }
}
```

## Ajouter une nouvelle langue

1. Créer un nouveau fichier JSON dans le dossier `locales/` (par exemple `de.json` pour l'allemand)
2. Copier la structure d'un fichier existant et traduire les valeurs
3. Ajouter la nouvelle langue dans `index.js` :

```js
// Import des fichiers de traduction
import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';
import translationAR from './locales/ar.json';
import translationDE from './locales/de.json'; // Nouvelle langue

// Les ressources de traduction
const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  },
  ar: {
    translation: translationAR
  },
  de: { // Nouvelle langue
    translation: translationDE
  }
};
```

4. Ajouter la nouvelle langue dans les sélecteurs de langue

## Bonnes pratiques

1. Utiliser des clés hiérarchiques pour organiser les traductions
2. Éviter les traductions trop longues
3. Utiliser des variables pour les valeurs dynamiques : `t('greeting', { name: 'John' })`
4. Ajouter des valeurs par défaut pour les clés manquantes : `t('missing.key', 'Default text')`
5. Maintenir les fichiers de traduction à jour lorsque de nouveaux textes sont ajoutés à l'application
