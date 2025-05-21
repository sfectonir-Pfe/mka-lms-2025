# Configuration de Google reCAPTCHA

Ce document explique comment configurer et utiliser Google reCAPTCHA dans l'application.

## Installation

Pour installer le package React Google reCAPTCHA, exécutez la commande suivante :

```bash
npm install react-google-recaptcha
```

## Obtenir une clé reCAPTCHA

Pour utiliser reCAPTCHA en production, vous devez obtenir une paire de clés (clé de site et clé secrète) auprès de Google :

1. Accédez à [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "+" pour créer un nouveau site
4. Choisissez reCAPTCHA v2 avec la case à cocher "Je ne suis pas un robot"
5. Ajoutez votre domaine (par exemple, `localhost` pour le développement)
6. Acceptez les conditions d'utilisation et cliquez sur "Soumettre"
7. Vous recevrez une clé de site (pour le frontend) et une clé secrète (pour le backend)

## Intégration dans le frontend

### Importation du composant

```jsx
import ReCAPTCHA from "react-google-recaptcha";
```

### Utilisation du composant

```jsx
import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

function MyForm() {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const recaptchaRef = useRef(null);

  const handleCaptchaChange = (value) => {
    // value sera null si le captcha expire
    setCaptchaVerified(!!value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert("Please verify that you are not a robot");
      return;
    }
    // Continuer avec la soumission du formulaire
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Autres champs du formulaire */}

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="YOUR_SITE_KEY" // Remplacez par votre clé de site
        onChange={handleCaptchaChange}
      />

      <button type="submit" disabled={!captchaVerified}>
        Submit
      </button>
    </form>
  );
}
```

### Personnalisation du reCAPTCHA

Le composant ReCAPTCHA accepte plusieurs props pour la personnalisation :

- `sitekey` (obligatoire) : Votre clé de site reCAPTCHA
- `onChange` : Fonction appelée lorsque le captcha est résolu ou expire
- `theme` : "light" (par défaut) ou "dark"
- `size` : "normal" (par défaut) ou "compact"
- `tabindex` : Tabindex du widget (par défaut : 0)
- `hl` : Force une langue spécifique (par exemple, "fr" pour le français)
- `onExpired` : Fonction appelée lorsque le captcha expire
- `onErrored` : Fonction appelée en cas d'erreur

## Intégration dans le backend

Pour vérifier la réponse reCAPTCHA côté serveur, vous devez envoyer la réponse du captcha au backend et la vérifier avec la clé secrète.

### Exemple de vérification côté serveur (Node.js)

```javascript
const axios = require('axios');

async function verifyRecaptcha(token) {
  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: 'YOUR_SECRET_KEY', // Remplacez par votre clé secrète
          response: token
        }
      }
    );

    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}
```

## Configuration actuelle

L'application utilise actuellement la clé de test de Google pour le développement :

```
sitekey: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

Cette clé de test acceptera toujours la vérification, ce qui est utile pour le développement. Elle affiche un message indiquant qu'il s'agit d'une clé de test.

**Important** : Avant la mise en production, vous devrez générer et utiliser une vraie clé reCAPTCHA.

## Internationalisation

Pour adapter le reCAPTCHA à la langue de l'utilisateur, vous pouvez utiliser la prop `hl` :

```jsx
<ReCAPTCHA
  sitekey="YOUR_SITE_KEY"
  onChange={handleCaptchaChange}
  hl={i18n.language} // Utiliser la langue actuelle de l'application
/>
```

## Bonnes pratiques

1. Ne pas oublier de remplacer la clé de test par une vraie clé en production
2. Toujours vérifier la réponse du captcha côté serveur
3. Gérer correctement l'expiration du captcha
4. Adapter le captcha à la langue de l'utilisateur
5. Offrir une alternative accessible pour les utilisateurs ayant des besoins spécifiques
