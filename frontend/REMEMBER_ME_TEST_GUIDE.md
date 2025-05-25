# Guide de Test - Remember Me

## 🧪 Comment tester le comportement "Remember Me"

### Étape 1: Préparer l'environnement de test

1. **Ouvrir la console du navigateur** (F12 → Console)
2. **Nettoyer le storage** en cliquant sur l'icône 🧹 dans la barre de navigation
3. **Vérifier l'état initial** en tapant dans la console :
   ```javascript
   debugStorage()
   ```

### Étape 2: Test SANS "Remember Me"

1. **Aller à la page de connexion**
2. **S'assurer que la case "Remember me" est DÉCOCHÉE**
3. **Se connecter avec vos identifiants**
4. **Vérifier dans la console** :
   ```javascript
   debugStorage()
   ```
   - ✅ Doit montrer : `sessionStorage: Present`, `localStorage: None`
   - ✅ Doit montrer : `rememberMe: None`

5. **Fermer l'onglet et rouvrir l'application**
6. **Résultat attendu** : Vous devez être déconnecté et voir la page de connexion

### Étape 3: Test AVEC "Remember Me"

1. **Nettoyer le storage** (icône 🧹)
2. **Aller à la page de connexion**
3. **COCHER la case "Remember me"**
4. **Se connecter avec vos identifiants**
5. **Vérifier dans la console** :
   ```javascript
   debugStorage()
   ```
   - ✅ Doit montrer : `localStorage: Present`, `sessionStorage: None`
   - ✅ Doit montrer : `rememberMe: true`
   - ✅ Doit montrer : `savedEmail: votre@email.com`

6. **Fermer l'onglet et rouvrir l'application**
7. **Résultat attendu** : Vous devez rester connecté

### Étape 4: Test de la page de connexion après "Remember Me"

1. **Après avoir activé "Remember Me" et fermé/rouvert le navigateur**
2. **Se déconnecter**
3. **Aller à la page de connexion**
4. **Résultat attendu** :
   - ✅ L'email doit être pré-rempli
   - ✅ La case "Remember me" doit être cochée

### Étape 5: Test automatique complet

**Exécuter le test automatique** dans la console :
```javascript
testRememberMe()
```

Ce test va simuler tous les scénarios et afficher les résultats dans la console.

## 🔍 Commandes de débogage utiles

### Vérifier l'état du storage
```javascript
debugStorage()
```

### Nettoyer complètement le storage
```javascript
clearStorage()
```

### Simuler une connexion avec Remember Me
```javascript
simulateLoginWithRememberMe("test@example.com")
```

### Simuler une connexion sans Remember Me
```javascript
simulateLoginWithoutRememberMe("test@example.com")
```

### Test complet automatique
```javascript
testRememberMe()
```

## ❌ Problèmes possibles et solutions

### Problème : L'utilisateur reste connecté même sans "Remember Me"
**Solution** : 
1. Cliquer sur l'icône 🧹 pour nettoyer le storage
2. Vérifier dans la console avec `debugStorage()`
3. S'assurer qu'il n'y a pas de données dans localStorage

### Problème : L'email n'est pas pré-rempli après "Remember Me"
**Solution** :
1. Vérifier que `savedEmail` est présent dans localStorage
2. Vérifier que `rememberMe` est à `"true"` dans localStorage

### Problème : La case "Remember Me" ne se coche pas automatiquement
**Solution** :
1. Vérifier les logs dans la console lors du chargement de LoginPage
2. S'assurer que le useEffect de LoginPage fonctionne correctement

## 📊 Logs à surveiller

### Dans la console, vous devriez voir :

**Au chargement de l'application :**
```
=== APP INITIALIZATION ===
Storage state BEFORE cleanup:
Storage state AFTER cleanup:
=== LOADING USER FROM STORAGE ===
Remember Me flag: true/false
```

**Lors de la connexion :**
```
=== LOGIN REQUEST ===
Remember Me checkbox is: CHECKED/NOT CHECKED
=== STORAGE LOGIC ===
Remember Me is: CHECKED/NOT CHECKED
✅ User data saved to localStorage/sessionStorage
```

**Lors de la déconnexion :**
```
=== LOGOUT INITIATED ===
=== SECURE LOGOUT INITIATED ===
```

## ✅ Critères de réussite

1. **Sans "Remember Me"** : Déconnexion après fermeture du navigateur
2. **Avec "Remember Me"** : Connexion maintenue après fermeture du navigateur
3. **Pré-remplissage** : Email et case cochée si "Remember Me" était activé
4. **Cohérence des données** : Pas de données dans les deux storages simultanément
5. **Nettoyage correct** : Suppression appropriée des données selon le contexte
