# Product Backlog - LMS MKA 2025

## Vue d'ensemble
Ce Product Backlog contient les 22 fonctionnalités prioritaires du système de gestion d'apprentissage (LMS) planifiées dans les 4 sprints de développement.

**Total des fonctionnalités : 22** (alignées avec le Sprint Planning)

---

## 1. GESTION DES UTILISATEURS ET AUTHENTIFICATION

### FB-001: Système d'authentification et autorisation
- **Fonctionnalité**: Authentification sécurisée avec rôles multiples
- **User Story**: En tant qu'utilisateur, je veux me connecter avec mon email et mot de passe pour accéder à la plateforme selon mon rôle
- **Priorité**: HAUTE
- **Sprint**: 1
- **Critères d'acceptation**: 
  - Connexion avec email/mot de passe
  - Gestion des rôles (Admin, Formateur, Étudiant, Créateur de formation, Établissement)
  - Vérification email
  - Réinitialisation de mot de passe
  - Tokens JWT sécurisés

### FB-002: Gestion des profils utilisateurs
- **Fonctionnalité**: Profils personnalisables avec informations détaillées
- **User Story**: En tant qu'utilisateur, je veux gérer mon profil avec photo, compétences et informations personnelles
- **Priorité**: HAUTE
- **Sprint**: 1
- **Critères d'acceptation**:
  - Upload de photo de profil
  - Édition des informations personnelles
  - Gestion des compétences
  - Localisation et coordonnées

### FB-003: Gestion des utilisateurs par l'administrateur
- **Fonctionnalité**: Interface d'administration des utilisateurs
- **User Story**: En tant qu'administrateur, je veux gérer tous les utilisateurs de la plateforme
- **Priorité**: HAUTE
- **Sprint**: 1
- **Critères d'acceptation**:
  - Liste des utilisateurs avec filtres
  - Création/modification/suppression d'utilisateurs
  - Activation/désactivation de comptes
  - Attribution de rôles

### FB-003.1: Ajout d'utilisateurs par l'administrateur
- **Fonctionnalité**: Création d'utilisateurs par l'administrateur
- **User Story**: En tant qu'administrateur, je veux ajouter des utilisateurs à la plateforme
- **Priorité**: HAUTE
- **Sprint**: 1
- **Critères d'acceptation**:
  - Formulaire de création d'utilisateur
  - Attribution automatique de rôles
  - Envoi d'email de bienvenue
  - Validation des données utilisateur
  - Système de validation et vérification des emails utilisateurs

### FB-031: Gestion des fichiers et médias
- **Fonctionnalité**: Système de stockage et gestion des fichiers
- **User Story**: En tant qu'utilisateur, je veux uploader et gérer mes fichiers
- **Priorité**: HAUTE
- **Sprint**: 1
- **Critères d'acceptation**:
  - Interface de gestion centralisée des fichiers
  - Système de dossiers et organisation
  - Recherche et filtres avancés
  - Upload sécurisé
  - Types de fichiers supportés
  - Gestion des permissions

---

## 2. GESTION DES PROGRAMMES ET FORMATIONS

### FB-004: Création et gestion des programmes
- **Fonctionnalité**: Système de création de programmes de formation
- **User Story**: En tant que créateur de formation, je veux créer des programmes structurés avec modules et cours
- **Priorité**: HAUTE
- **Sprint**: 2
- **Critères d'acceptation**:
  - Création de programmes avec nom et description
  - Publication/dépublier des programmes
  - Gestion des dates de début/fin
  - Niveaux de difficulté

### FB-005: Gestion des modules
- **Fonctionnalité**: Organisation des programmes en modules
- **User Story**: En tant que formateur, je veux organiser le contenu en modules avec durée et unités de période
- **Priorité**: HAUTE
- **Sprint**: 2
- **Critères d'acceptation**:
  - Création de modules avec durée
  - Association modules-programmes
  - Gestion des unités de période (heures, jours, semaines)

### FB-006: Gestion des cours
- **Fonctionnalité**: Création et organisation des cours
- **User Story**: En tant que formateur, je veux créer des cours avec contenu structuré
- **Priorité**: HAUTE
- **Sprint**: 2
- **Critères d'acceptation**:
  - Création de cours avec titre
  - Association cours-modules
  - Gestion des contenus de cours

### FB-007: Gestion des contenus
- **Fonctionnalité**: Système de contenu multimédia
- **User Story**: En tant que formateur, je veux ajouter différents types de contenu (PDF, vidéo, texte)
- **Priorité**: HAUTE
- **Sprint**: 2
- **Critères d'acceptation**:
  - Upload de fichiers (PDF, images, vidéos)
  - Contenu texte riche
  - Types de contenu variés
  - Publication/dépublier du contenu

---

## 3. SYSTÈME DE SESSIONS ET SÉANCES

### FB-008: Gestion des sessions
- **Fonctionnalité**: Organisation des sessions de formation
- **User Story**: En tant que formateur, je veux créer des sessions avec dates et participants
- **Priorité**: HAUTE
- **Sprint**: 3
- **Critères d'acceptation**:
  - Création de sessions avec dates
  - Association sessions-programmes
  - Gestion du statut des sessions
  - Inscription des participants

### FB-009: Gestion des séances formateur
- **Fonctionnalité**: Planification et gestion des séances
- **User Story**: En tant que formateur, je veux planifier des séances avec horaires et contenu
- **Priorité**: HAUTE
- **Sprint**: 3
- **Critères d'acceptation**:
  - Création de séances avec titre et horaires
  - Association formateur-séance
  - Gestion des médias de séance
  - Planification des activités

### FB-010: Inscription aux sessions
- **Fonctionnalité**: Système d'inscription des étudiants
- **User Story**: En tant qu'étudiant, je veux m'inscrire aux sessions de formation
- **Priorité**: HAUTE
- **Sprint**: 3
- **Critères d'acceptation**:
  - Inscription aux sessions disponibles
  - Gestion des inscriptions multiples
  - Confirmation d'inscription

---

## 4. TABLEAUX DE BORD

### FB-024: Dashboard administrateur
- **Fonctionnalité**: Vue d'ensemble pour les administrateurs
- **User Story**: En tant qu'administrateur, je veux avoir une vue d'ensemble de la plateforme
- **Priorité**: HAUTE
- **Sprint**: 3
- **Critères d'acceptation**:
  - Statistiques globales
  - Gestion des utilisateurs
  - Monitoring système
  - Rapports d'activité

### FB-025: Dashboard formateur
- **Fonctionnalité**: Interface dédiée aux formateurs
- **User Story**: En tant que formateur, je veux gérer mes sessions et suivre mes étudiants
- **Priorité**: HAUTE
- **Sprint**: 3
- **Critères d'acceptation**:
  - Gestion des séances
  - Suivi des étudiants
  - Statistiques de performance
  - Outils de création

### FB-026: Dashboard étudiant
- **Fonctionnalité**: Interface personnalisée pour étudiants
- **User Story**: En tant qu'étudiant, je veux accéder à mes cours et suivre mes progrès
- **Priorité**: HAUTE
- **Sprint**: 3
- **Critères d'acceptation**:
  - Cours inscrits
  - Progression
  - Calendrier
  - Notifications personnelles

---

## 5. SYSTÈME DE CHAT ET COMMUNICATION

### FB-014: Chat pour chaque session
- **Fonctionnalité**: Communication dédiée par session de formation
- **User Story**: En tant que participant, je veux communiquer spécifiquement dans le chat de ma session
- **Priorité**: HAUTE
- **Sprint**: 4
- **Critères d'acceptation**:
  - Chat isolé par session
  - Accès restreint aux participants de la session
  - Historique persistant par session
  - Notifications spécifiques à la session
  - Modération par le formateur
  - Partage de fichiers dans le chat de session
  - Messages épinglés importants
  - Statut en ligne des participants

### FB-015: Chat général
- **Fonctionnalité**: Chat global pour tous les utilisateurs
- **User Story**: En tant qu'utilisateur, je veux participer à des discussions générales
- **Priorité**: MOYENNE
- **Sprint**: 4
- **Critères d'acceptation**:
  - Chat global accessible
  - Messages persistants
  - Interface intuitive

---

## 6. SYSTÈME DE QUIZ ET ÉVALUATION

### FB-011: Création de quiz
- **Fonctionnalité**: Outil de création de quiz interactifs
- **User Story**: En tant que formateur, je veux créer des quiz avec différents types de questions
- **Priorité**: MOYENNE
- **Sprint**: 4
- **Critères d'acceptation**:
  - Création de questions QCM
  - Questions à choix multiples
  - Limite de temps
  - Système de points

### FB-012: Passage de quiz
- **Fonctionnalité**: Interface de passage de quiz pour étudiants
- **User Story**: En tant qu'étudiant, je veux passer des quiz pour évaluer mes connaissances
- **Priorité**: MOYENNE
- **Sprint**: 4
- **Critères d'acceptation**:
  - Interface de quiz interactive
  - Chronomètre
  - Sauvegarde des réponses
  - Calcul automatique des scores

---

## 7. SYSTÈME DE FEEDBACK ET ÉVALUATION

### FB-017: Feedback entre étudiants
- **Fonctionnalité**: Évaluation par les pairs
- **User Story**: En tant qu'étudiant, je veux donner et recevoir des feedbacks de mes pairs
- **Priorité**: MOYENNE
- **Sprint**: 4
- **Critères d'acceptation**:
  - Système de notation par catégories
  - Feedback anonyme optionnel
  - Groupes d'étudiants
  - Résumés de feedback

### FB-018: Feedback formateur
- **Fonctionnalité**: Évaluation des formateurs par les étudiants
- **User Story**: En tant qu'étudiant, je veux évaluer mes formateurs
- **Priorité**: MOYENNE
- **Sprint**: 4
- **Critères d'acceptation**:
  - Évaluation par emojis
  - Commentaires textuels
  - Historique des évaluations
  - Statistiques pour formateurs

---

## 8. SYSTÈME DE NOTIFICATIONS

### FB-021: Notifications en temps réel
- **Fonctionnalité**: Système de notifications push
- **User Story**: En tant qu'utilisateur, je veux recevoir des notifications en temps réel
- **Priorité**: MOYENNE
- **Sprint**: 4
- **Critères d'acceptation**:
  - Notifications push
  - Types de notifications variés
  - Gestion des liens
  - Statut lu/non lu

---

## RÉPARTITION PAR SPRINT

### Sprint 1 : Fondations et Authentification (11 avril - 16 mai 2025)
- FB-001: Système d'authentification et autorisation
- FB-002: Gestion des profils utilisateurs
- FB-003: Gestion des utilisateurs par l'administrateur
- FB-003.1: Ajout d'utilisateurs par l'administrateur
- FB-031: Gestion des fichiers et médias

### Sprint 2 : Programmes et Contenus (19 mai - 20 juin 2025)
- FB-004: Création et gestion des programmes
- FB-005: Gestion des modules
- FB-006: Gestion des cours
- FB-007: Gestion des contenus

### Sprint 3 : Sessions, Séances et Tableaux de Bord (23 juin - 25 juillet 2025)
- FB-008: Gestion des sessions
- FB-009: Gestion des séances formateur
- FB-010: Inscription aux sessions
- FB-024: Dashboard administrateur
- FB-025: Dashboard formateur
- FB-026: Dashboard étudiant

### Sprint 4 : Communication, Évaluation et Fonctionnalités Avancées (28 juillet - 10 septembre 2025)
- FB-014: Chat pour chaque session
- FB-015: Chat général
- FB-011: Création de quiz
- FB-012: Passage de quiz
- FB-017: Feedback entre étudiants
- FB-018: Feedback formateur
- FB-021: Notifications en temps réel

---

## PRIORISATION GÉNÉRALE

### Priorité HAUTE (Critique) - 15 fonctionnalités
- Authentification et gestion des utilisateurs (5)
- Gestion des programmes, modules, cours (4)
- Système de sessions et séances (3)
- Tableaux de bord principaux (3)

### Priorité MOYENNE (Important) - 7 fonctionnalités
- Système de quiz et évaluation (2)
- Feedback et évaluations (2)
- Chat et communication (2)
- Notifications (1)

---

## NOTES TECHNIQUES

- **Backend**: NestJS avec Prisma ORM
- **Frontend**: React avec routing
- **Base de données**: PostgreSQL
- **Communication temps réel**: WebSockets
- **Authentification**: JWT
- **Upload de fichiers**: Système de stockage local
- **Notifications**: Système push en temps réel

---

*Ce Product Backlog est harmonisé avec le Sprint Planning et contient les 22 fonctionnalités prioritaires du système LMS MKA 2025.*
