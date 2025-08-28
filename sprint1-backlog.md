# Sprint 1 - Backlog des tâches par histoire utilisateur

## ID 1 - Système d'authentification et d'autorisation

### Histoire 1.1 : Authentification utilisateur
**En tant qu'utilisateur, je veux m'authentifier avec mon identifiant (adresse email) et mot de passe pour accéder à la plateforme de manière sécurisée selon mon rôle**

**Tâches :**
- [ ] Créer le formulaire de connexion (email + mot de passe)
- [ ] Implémenter l'API d'authentification (POST /auth/login)
- [ ] Créer le middleware d'authentification et vérification des rôles
- [ ] Tester la connexion avec différents rôles

### Histoire 1.2 : Gestion des rôles et permissions administrateur
**En tant qu'administrateur, je veux gérer les rôles et les permissions des utilisateurs afin de contrôler les droits d'accès en fonction de leur profil**

**Tâches :**
- [ ] Créer l'interface de gestion des rôles et permissions
- [ ] Implémenter l'API de création/modification des rôles
- [ ] Implémenter l'API d'attribution des permissions aux rôles
- [ ] Tester l'attribution et la vérification des permissions

### Histoire 1.3 : Réinitialisation de mot de passe
**En tant qu'utilisateur, je veux réinitialiser mon mot de passe en cas d'oubli afin de récupérer l'accès à mon compte**

**Tâches :**
- [ ] Créer le formulaire de demande et page de réinitialisation
- [ ] Implémenter l'API de demande et mise à jour du mot de passe
- [ ] Créer le système d'envoi d'email avec token sécurisé
- [ ] Tester le processus complet de réinitialisation

## ID 2 - Gestion des profils utilisateurs

### Histoire 2.1 : Gestion du profil personnel
**En tant qu'utilisateur, je veux gérer mon profil en mettant à jour mes informations personnelles (photo, compétences, etc.) afin que mes données soient toujours actualisées**

**Tâches :**
- [ ] Créer l'interface de modification du profil
- [ ] Implémenter l'API de mise à jour du profil
- [ ] Créer le système de gestion des photos de profil
- [ ] Tester la mise à jour des différents champs du profil

### Histoire 2.2 : Gestion des profils par l'administrateur
**En tant qu'administrateur, je veux consulter et mettre à jour les profils utilisateurs afin de rectifier ou intégrer des informations manquantes**

**Tâches :**
- [ ] Créer l'interface de consultation et modification des profils
- [ ] Implémenter l'API de récupération et mise à jour des profils
- [ ] Créer le système de logs des modifications
- [ ] Tester la consultation et modification des profils

## ID 3 - Gestion des comptes et accès

### Histoire 3.1 : Création de comptes par l'administrateur
**En tant qu'administrateur, je veux créer un compte pour un nouvel utilisateur afin de lui attribuer un accès à la plateforme**

**Tâches :**
- [ ] Créer l'interface de création de compte utilisateur
- [ ] Implémenter l'API de création de compte
- [ ] Créer le système de génération de mot de passe temporaire
- [ ] Tester la création de comptes avec différents rôles

### Histoire 3.2 : Attribution des rôles lors de la création
**En tant qu'administrateur, je veux attribuer un rôle (étudiant, créateur de formation, formateur ou responsable d'établissement) à un utilisateur lors de la création de son compte afin de configurer ses droits d'accès dès l'inscription**

**Tâches :**
- [ ] Créer l'interface de sélection des rôles
- [ ] Implémenter l'API d'attribution des rôles
- [ ] Créer le système de vérification des permissions d'attribution
- [ ] Tester l'attribution des différents rôles

### Histoire 3.3 : Activation/désactivation des comptes
**En tant qu'administrateur, je veux activer ou désactiver un compte utilisateur afin de réguler son accès à la plateforme**

**Tâches :**
- [ ] Créer l'interface de gestion des statuts de comptes
- [ ] Implémenter l'API d'activation/désactivation
- [ ] Créer le système de logs des changements de statut
- [ ] Tester l'activation et désactivation des comptes

### Histoire 3.4 : Création de comptes étudiants par le responsable d'établissement
**En tant que responsable d'établissement, je veux créer un compte pour un étudiant afin de lui permettre d'accéder à la plateforme**

**Tâches :**
- [ ] Créer l'interface de création de compte étudiant
- [ ] Implémenter l'API de création de compte étudiant
- [ ] Créer le système de validation des droits du responsable
- [ ] Tester la création de comptes étudiants

### Histoire 3.5 : Ajustement des droits d'accès étudiants
**En tant que responsable d'établissement, je veux ajuster les droits d'accès d'un étudiant**

**Tâches :**
- [ ] Créer l'interface de gestion des droits étudiants
- [ ] Implémenter l'API de modification des droits
- [ ] Créer le système de vérification des permissions
- [ ] Tester la modification des droits d'accès

### Histoire 3.6 : Suppression de compte par l'administrateur
**En tant qu'administrateur, je veux supprimer un compte utilisateur afin de retirer définitivement son accès à la plateforme**

**Tâches :**
- [ ] Créer l'interface de suppression (avec confirmation)
- [ ] Implémenter l'API de suppression (DELETE /users/:id)
- [ ] Appliquer les vérifications de permissions et intégrité des données liées
- [ ] Tester la suppression et ses effets de bord

## ID 4 - Système de notifications automatisées par courrier électronique

### Histoire 4.1 : Email de confirmation de compte
**En tant qu'utilisateur, je veux recevoir un email de confirmation lors de la création de mon compte afin de valider mon inscription**

**Tâches :**
- [ ] Créer le template d'email de confirmation
- [ ] Implémenter le système d'envoi d'email automatique
- [ ] Créer le système de génération et vérification de lien de confirmation
- [ ] Tester l'envoi et la réception des emails de confirmation

### Histoire 4.2 : Email de réinitialisation de mot de passe
**En tant qu'utilisateur, je veux recevoir un email contenant un lien de réinitialisation en cas d'oubli du mot de passe afin de récupérer en toute sécurité l'accès à mon compte**

**Tâches :**
- [ ] Créer le template d'email de réinitialisation
- [ ] Implémenter le système d'envoi d'email de réinitialisation
- [ ] Créer le système de génération et validation de lien sécurisé
- [ ] Tester l'envoi et la réception des emails de réinitialisation

### Histoire 4.3 : Email après modification de mot de passe (connecté)
**En tant qu'utilisateur connecté, je veux recevoir un email de notification quand je modifie mon mot de passe afin d'être informé et détecter toute activité suspecte**

**Tâches :**
- [ ] Créer le template d'email de notification de changement de mot de passe
- [ ] Déclencher l'envoi d'email après succès de l'API de changement de mot de passe
- [ ] Journaliser l'événement et appliquer vérifications de sécurité (IP, heure)
- [ ] Tester l'envoi et le contenu de l'email en environnement de dev

### Histoire 4.4 : Email quand une session devient active
**En tant qu'utilisateur inscrit à une session, je veux recevoir un email quand la session devient active afin de ne pas rater le démarrage**

**Tâches :**
- [ ] Créer le template d'email d'activation de session
- [ ] Déclencher l'envoi à l'activation de la session
- [ ] Filtrer les destinataires aux inscrits (opt-in/opt-out)
- [ ] Tester l'envoi et le timing

### Histoire 4.5 : Email quand une réclamation est résolue
**En tant qu'utilisateur, je veux recevoir un email quand ma réclamation est résolue afin d'être informé de la décision**

**Tâches :**
- [ ] Créer le template d'email de résolution de réclamation
- [ ] Déclencher l'envoi à la transition d'état vers résolu
- [ ] Inclure résumé et lien de suivi dans l'email
- [ ] Tester l'envoi et les cas d'erreur

### Histoire 4.6 : Email de confirmation après changement de mot de passe (oubli)
**En tant qu'utilisateur, je veux recevoir un email de confirmation après avoir changé mon mot de passe via le lien de réinitialisation afin d'assurer la sécurité de mon compte**

**Tâches :**
- [ ] Créer le template de confirmation de changement de mot de passe
- [ ] Déclencher l'envoi après succès de l'API de réinitialisation
- [ ] Journaliser l'événement (IP, agent) et ajouter conseils sécurité
- [ ] Tester l'envoi et le contenu

### Histoire 4.7 : Email avec mot de passe temporaire lors de création de compte
**En tant qu'utilisateur, je veux recevoir un email avec un mot de passe temporaire quand l'administrateur ou responsable d'établissement crée mon compte afin d'accéder immédiatement à la plateforme**

**Tâches :**
- [ ] Créer le template d'email avec mot de passe temporaire
- [ ] Déclencher l'envoi automatique après création de compte par admin/responsable
- [ ] Inclure les identifiants de connexion et instructions de première connexion
- [ ] Tester l'envoi et la réception des emails de création de compte

## ID 5 - Tableau de bord utilisateur

### Histoire 5.1 : Tableau de bord administrateur
**En tant qu'administrateur, je veux disposer d’une vision globale de la plateforme afin de contrôler, suivre les activités des utilisateurs et détecter les erreurs et problèmes techniques**

**Tâches :**
- [ ] Afficher les statistiques globales (utilisateurs, sessions, taux d'activité)
- [ ] Afficher Top 3 sessions et Top 3 formateurs
- [ ] Afficher les statistiques des réclamations
- [ ] Tester le dashboard administrateur

### Histoire 5.2 : Tableau de bord responsable d'établissement
**En tant que responsable d'établissement, je veux suivre la progression et l’assiduité de mes étudiants**

**Tâches :**
- [ ] Gérer/visualiser les étudiants par session
- [ ] Suivre les moyennes et récompenses
- [ ] Offrir des filtres et analyses par établissement
- [ ] Tester le dashboard établissement

### Histoire 5.3 : Tableau de bord étudiant
**En tant qu'étudiant, je peux visualiser mon tableau de bord personnel pour accéder aux cours et suivre mes progrès**

**Tâches :**
- [ ] Lister les sessions inscrites
- [ ] Visualiser la progression des sessions
- [ ] Accéder rapidement aux cours et ressources
- [ ] Tester le dashboard étudiant

### Histoire 5.4 : Tableau de bord créateur de formation
**En tant que créateur de formation, je veux une vue d'ensemble centralisée de mes programmes et sessions afin de suivre leur déroulement et avancement**

**Tâches :**
- [ ] Afficher les statistiques des programmes créés
- [ ] Suivre les sessions et performances
- [ ] Afficher des graphiques et analyses
- [ ] Tester le dashboard créateur

### Histoire 5.5 : Tableau de bord formateur
**En tant que formateur, je veux gérer mes sessions, suivre mes étudiants et visualiser leurs résultats**

**Tâches :**
- [ ] Gérer et suivre les sessions
- [ ] Suivre les étudiants et leurs résultats
- [ ] Afficher les statistiques de performance
- [ ] Tester le dashboard formateur

---

## Estimation globale du sprint
- **Total des tâches :** 92 tâches
- **Complexité estimée :** Moyenne
- **Durée estimée :** 3-4 semaines
- **Équipe recommandée :** 3-4 développeurs + 1 testeur
