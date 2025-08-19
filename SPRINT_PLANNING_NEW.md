# Planification des Sprints - LMS MKA 2025

## Vue d'ensemble
Planification de 3 sprints pour le développement du système de gestion d'apprentissage MKA 2025.

**Période de projet :** 11 avril - 10 septembre 2025 (5 mois)  
**Durée de sprint :** 6-7 semaines  
**Équipe :** 4 développeurs + 1 Scrum Master + 1 Product Owner  
**Contrainte :** Maximum 4 jours par fonctionnalité

---

## SPRINT 1 : AUTHENTIFICATION ET GESTION DES UTILISATEURS (11 avril - 27 juin 2025)
**Durée :** 11 semaines  
**Objectif :** Système d'authentification et gestion des utilisateurs par rôle
**Acteurs principaux :** Utilisateur, Administrateur

### Fonctionnalités du Sprint

#### FB-001: Système d'authentification et autorisation
**User Story :** En tant qu'utilisateur, je veux me connecter avec mon email et mot de passe pour accéder à la plateforme selon mon rôle

**Tâches :**
- [x] **Tâche 1.1 :** Configuration Docker et base de données (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 1.2 :** Modèle utilisateur et authentification JWT (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 1.3 :** Interface de connexion et inscription (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 1.4 :** Tests d'authentification (1 jour)

**Estimation totale :** 8 jours (6 jours terminés)

#### FB-002: Gestion des profils utilisateurs
**User Story :** En tant qu'utilisateur, je veux gérer mon profil avec photo, compétences et informations personnelles

**Tâches :**
- [x] **Tâche 2.1 :** Développement et extension du modèle de données utilisateur (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 2.2 :** Upload de photo de profil (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 2.3 :** Interface d'édition de profil (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 2.4 :** Tests de gestion de profil (1 jour)

**Estimation totale :** 7 jours (6 jours terminés)

#### FB-003: Administration centralisée des comptes utilisateurs
**User Story :** En tant qu'administrateur système, je souhaite disposer d'un panel de contrôle pour superviser l'ensemble des comptes de la plateforme

**Tâches réelles (max 4) :**
- [x] Annuaire utilisateurs: liste, recherche, fiche détail ✅ `GET /users`, `GET /users/id/:id`, `GET /users/email/:email`
- [x] Création et édition de compte + photo de profil ✅ `POST /users`, `PATCH /users/:id`, `PATCH /users/id/:id/photo`
- [x] Activation/désactivation et suppression de compte ✅ `PATCH /users/:id` (isActive), `PATCH /users/:id/toggle-status`, `DELETE /users/:id`
- [x] Indicateurs de gestion: total, actifs, inactifs, taux d'activité (UI)

**Estimation totale :** 8 jours (8 jours terminés)

#### FB-003.1: Ajout d'utilisateurs par l'administrateur
**User Story :** En tant qu'administrateur, je veux ajouter des utilisateurs à la plateforme

**Tâches :**
- [x] **Tâche 3.5 :** Développement de l'interface de création et gestion des utilisateurs (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 3.6 :** Système de validation et vérification des emails utilisateurs (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 3.7 :** Tests d'ajout d'utilisateurs (1 jour)

**Estimation totale :** 5 jours (4 jours terminés)

#### FB-032: Supervision des étudiants par le responsable d'établissement
**User Story :** En tant que responsable d'établissement, je veux superviser les comptes de mes étudiants et pouvoir les ajouter

**Tâches :**
- [ ] **Tâche 32.1 :** Interface de supervision des étudiants de l'établissement (3 jours)
- [ ] **Tâche 32.2 :** Système d'ajout d'étudiants par le responsable (2 jours)
- [ ] **Tâche 32.3 :** Gestion des permissions et accès étudiants (2 jours)
- [ ] **Tâche 32.4 :** Tests de supervision des étudiants (1 jour)

**Estimation totale :** 8 jours

#### FB-024: Dashboard administrateur
**User Story :** En tant qu'administrateur, je veux avoir une vue d'ensemble de la plateforme

**Tâches réelles implémentées :**
- [x] **Tâche 24.1 :** Statistiques globales (3 jours) ✅ `GET /dashboard/stats`
  - Totaux et répartitions: utilisateurs (par rôle), programmes (publiés/brouillons), sessions (actives/inactives/terminées/archivées)
- [x] **Tâche 24.2 :** Top 3 sessions et top 3 formateurs (2 jours) ✅ `GET /dashboard/top-sessions`, `GET /dashboard/top-formateurs`
  - Sessions les plus inscrites et formateurs les plus actifs (placeholder rating)
- [x] **Tâche 24.3 :** Inscriptions mensuelles par rôle et statut des sessions (2 jours) ✅ `GET /dashboard/monthly-registrations`, `GET /dashboard/session-status-stats`
  - Séries sur 12 mois par rôle; distribution des statuts de sessions
- [x] **Tâche 24.4 :** Statistiques des réclamations (1 jour) ✅ `GET /dashboard/reclamation-stats`
  - Répartition par statut: en attente, en cours, résolues, rejetées
- [ ] **Tâche 24.5 :** Tests du dashboard admin (1 jour)

**Estimation totale :** 9 jours (8 jours terminés)

#### FB-028: Dashboard responsable d'établissement
**User Story :** En tant que responsable d'établissement, je veux suivre les performances de mes étudiants

**Tâches :**
- [x] **Tâche 28.1 :** Gestion des étudiants par session (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 28.2 :** Suivi des moyennes et récompenses (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 28.3 :** Filtres et analyses par établissement (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 28.4 :** Tests du dashboard établissement (1 jour)

**Estimation totale :** 8 jours (7 jours terminés)

#### FB-020: Système de réclamations de base
**User Story :** En tant qu'étudiant, je veux soumettre une réclamation et recevoir un email quand elle est résolue

**Tâches :**
- [x] **Tâche 20.1 :** Soumission de réclamations (POST `/reclamation`) ✅ **TERMINÉE**
- [ ] **Tâche 20.2 :** Notification email automatique à la résolution (intégration service mail)
- [ ] **Tâche 20.3 :** Tests (1 jour)

**Estimation totale :** 4 jours (1 jour terminé)

#### FB-020.1: Fonctionnalités avancées des réclamations
**User Story :** En tant qu'administrateur, je veux suivre et traiter efficacement les réclamations depuis une interface dédiée

**Tâches réelles (page RéclamationList) :**
- [x] **Tâche 20.5 :** Interface d'administration des réclamations: liste, recherche textuelle, filtre par statut (1 jour) ✅ `GET /reclamation/list`
- [x] **Tâche 20.6 :** Consultation du détail d'une réclamation (1 jour) ✅ `GET /reclamation/:id`
- [x] **Tâche 20.7 :** Mise à jour du statut (EN_ATTENTE/EN_COURS/RESOLU/REJETE) avec confirmation (1 jour) ✅ `PATCH /reclamation/:id`
- [x] **Tâche 20.8 :** Rafraîchissement automatique (30s) et tuiles de synthèse par statut (1 jour) ✅
- [ ] **Tâche 20.9 :** Tests UI et d'intégration (1 jour)

**Estimation totale :** 4 jours (3 jours terminés)

**Fonctionnalités incluses :**
- 📊 **Tableau de bord admin** : Statistiques en temps réel, taux de résolution, répartition par priorité
- 🔄 **Suivi en temps réel** : Actualisation automatique des données toutes les 30 secondes
- 📈 **Métriques avancées** : Compteurs par statut, priorité et tendances de résolution

#### FB-021: Notifications en temps réel
**User Story :** En tant qu'utilisateur, je veux recevoir des notifications en temps réel

**Tâches :**
- [x] **Tâche 21.1 :** Notifications push (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 21.2 :** Types de notifications variés (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 21.3 :** Gestion des liens (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 21.4 :** Tests des notifications (1 jour)

**Estimation totale :** 8 jours (7 jours terminés)

#### FB-022: Système de notifications par email
**User Story :** En tant qu'utilisateur, je veux recevoir des notifications importantes par email

**Tâches :**
- [x] **Tâche 22.1 :** Configuration du service d'email (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 22.2 :** Templates d'emails personnalisés (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 22.4 :** Tests du système d'email (1 jour)

**Estimation totale :** 7 jours (6 jours terminés)

 

**Estimation totale :** 8 jours (7 jours terminés)

 

**Total Sprint 1 :** 97 jours (70 jours terminés, 27 jours restants)

---

## SPRINT 2 : CRÉATION ET GESTION DES CONTENUS (30 juin - 22 août 2025)
**Durée :** 8 semaines  
**Objectif :** Création et gestion des cours, contenus, sessions et séances
**Acteurs principaux :** Créateur de Formation, Formateur

### Fonctionnalités du Sprint

#### FB-025: Dashboard formateur
**User Story :** En tant que formateur, je veux gérer mes sessions et suivre mes étudiants

**Tâches :**
- [x] **Tâche 25.1 :** Gestion des séances (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 25.2 :** Suivi des étudiants (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 25.3 :** Statistiques de performance (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 25.4 :** Tests du dashboard formateur (1 jour)

**Estimation totale :** 8 jours (7 jours terminés)

#### FB-026: Dashboard étudiant
**User Story :** En tant qu'étudiant, je veux accéder à mes cours et suivre mes progrès

**Tâches :**
- [x] **Tâche 26.1 :** Cours inscrits (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 26.2 :** Progression (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 26.3 :** Calendrier (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 26.4 :** Tests du dashboard étudiant (1 jour)

**Estimation totale :** 8 jours (7 jours terminés)

#### FB-027: Dashboard créateur de formation
**User Story :** En tant que créateur de formation, je veux avoir une vue d'ensemble de mes programmes et sessions

**Tâches :**
- [x] **Tâche 27.1 :** Statistiques des programmes créés (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 27.2 :** Suivi des sessions et performances (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 27.3 :** Graphiques et analyses (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 27.4 :** Tests du dashboard créateur (1 jour)

**Estimation totale :** 8 jours (7 jours terminés)

#### FB-004: Création et gestion des programmes
**User Story :** En tant que créateur de formation, je veux créer des programmes structurés avec modules et cours

**Tâches :**
- [x] **Tâche 4.1 :** Modèle programme et endpoints CRUD (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 4.2 :** Association programmes-modules-cours (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 4.3 :** Publication/dépublication des programmes (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 4.4 :** Tests des programmes (1 jour)

**Estimation totale :** 7 jours (6 jours terminés)

#### FB-005: Gestion des modules
**User Story :** En tant que créateur de formation, je veux organiser le contenu en modules avec durée et unités de période

**Tâches :**
- [x] **Tâche 5.1 :** Modèle module et endpoints CRUD (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 5.2 :** Association modules-programmes (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 5.3 :** Durée et unités de période (heures/jours/semaines) (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 5.4 :** Tests des modules (1 jour)

**Estimation totale :** 7 jours (6 jours terminés)

#### FB-006: Gestion des cours
**User Story :** En tant que créateur de formation, je veux créer des cours avec contenu structuré

**Tâches :**
- [x] **Tâche 6.1 :** Modèle cours et endpoints CRUD (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 6.2 :** Association cours–modules et intégration aux programmes (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 6.3 :** Interface de gestion des cours (liste/ajout/suppression) (3 jours) ✅ **TERMINÉE**
- [ ] **Tâche 6.4 :** Tests des cours (1 jour)

**Estimation totale :** 8 jours (7 jours terminés)

#### FB-007: Gestion des contenus
**User Story :** En tant que créateur de formation, je veux ajouter différents types de contenu (PDF, vidéo, texte)

**Tâches :**
- [x] **Tâche 7.1 :** Modèle contenu et endpoints (upload/liste/suppression/publication) + notifications (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 7.2 :** Associations contenus–cours et intégration aux programmes/sessions (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 7.3 :** Interface de gestion des contenus (upload/liste/publication + intégration quiz) (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 7.4 :** Tests des contenus (1 jour)

**Estimation totale :** 8 jours (7 jours terminés)

#### FB-008: Gestion des sessions
**User Story :** En tant qu'administrateur/formateur, je veux créer et gérer des sessions (dates, participants, édition) avec résolution de conflits

**Tâches :**
- [x] **Tâche 8.1 :** Modèle session et endpoints (création/liste/suppression) (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 8.2 :** Interface de planification (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 8.3 :** Gestion des participants (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 8.4 :** Gestion du statut des sessions (ACTIVE/INACTIVE/COMPLETED/ARCHIVED) (1 jour) ✅ **TERMINÉE**
- [ ] **Tâche 8.5 :** Édition de sessions (name/dates/image) (1 jour)
- [ ] **Tâche 8.6 :** Gestion des conflits d'horaires (2 jours)
- [ ] **Tâche 8.7 :** Synthèse feedback sessions (endpoints overview/liste + UI) (2 jours)
- [ ] **Tâche 8.8 :** Tests des sessions (1 jour)

**Estimation totale :** 14 jours (8 jours terminés)

#### FB-009: Gestion des séances formateur
**User Story :** En tant que formateur, je veux planifier des séances avec horaires et contenu

**Tâches :**
- [x] **Tâche 9.1 :** Modèle séance et endpoints (création/liste/suppression) + association formateur (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 9.2 :** Interface de gestion des séances (création avec prévisualisation programme, liste avec détails) (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 9.3 :** Gestion des médias de séance (upload/suppression/liste) (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 9.4 :** Tests des séances (1 jour)
 - [ ] **Tâche 9.5 :** Regroupement des étudiants par séance (backend endpoints + UI de gestion) (2 jours)

**Estimation totale :** 11 jours (8 jours terminés)

#### FB-011: Création et gestion des quiz
**User Story :** En tant que créateur de formation, je veux créer et gérer des quiz avec différents types de questions et versions

**Tâches :**
- [x] **Tâche 11.1 :** Modèle quiz et questions (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 11.2 :** Interface de création de quiz (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 11.3 :** Système de points et temps (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 11.4 :** Édition et suppression de quiz (2 jours)
- [ ] **Tâche 11.5 :** Gestion des versions de quiz (2 jours)
- [ ] **Tâche 11.6 :** Tests des quiz (1 jour)

**Estimation totale :** 12 jours (7 jours terminés)

#### FB-012: Passage de quiz
**User Story :** En tant qu'étudiant, je veux passer des quiz pour évaluer mes connaissances

**Tâches :**
- [x] **Tâche 12.1 :** Interface de passage de quiz (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 12.2 :** Chronomètre et sauvegarde (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 12.3 :** Calcul des scores (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 12.4 :** Tests de passage de quiz (1 jour)

**Estimation totale :** 8 jours (7 jours terminés)

#### FB-012: Utiliser Jitsi Meet
**User Story :** En tant que formateur et étudiant, je veux utiliser Jitsi Meet pour les visioconférences et réunions

**Tâches :**
- [ ] **Tâche 12.1 :** Configuration Jitsi Meet (2 jours)
- [ ] **Tâche 12.2 :** Intégration dans les séances (3 jours)
- [ ] **Tâche 12.3 :** Gestion des salles de réunion (2 jours)
- [ ] **Tâche 12.4 :** Tests Jitsi Meet (1 jour)

**Estimation totale :** 8 jours



**Estimation totale :** 8 jours

#### FB-014: Partage de session
**User Story :** En tant que formateur, je veux partager mes sessions avec d'autres utilisateurs ou les rendre publiques

**Tâches :**
- [ ] **Tâche 14.1 :** Modèle de partage de session (2 jours)
- [ ] **Tâche 14.2 :** Interface de partage et permissions (3 jours)
- [ ] **Tâche 14.3 :** Gestion des accès et invitations (2 jours)
- [ ] **Tâche 14.4 :** Tests du partage de session (1 jour)

**Estimation totale :** 8 jours

#### FB-016: Tableau blanc collaboratif
**User Story :** En tant que formateur, je veux utiliser un tableau blanc interactif pour mes présentations

**Tâches :**
- [x] **Tâche 16.1 :** Interface de dessin temps réel (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 16.2 :** Outils de dessin (stylo, formes, texte) (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 16.3 :** Synchronisation collaborative (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 16.4 :** Tests du tableau blanc (1 jour)
 - [ ] **Tâche 16.5 :** Export du tableau blanc (PNG/JPEG/PDF + export/import JSON) (1 jour)

**Estimation totale :** 9 jours (7 jours terminés)

**Total Sprint 2 :** 92 jours (77 jours terminés, 15 jours restants)

---

## SPRINT 3 : ÉVALUATION ET FONCTIONNALITÉS AVANCÉES (25 août - 10 septembre 2025)
**Durée :** 7 semaines  
**Objectif :** Évaluation des étudiants, feedback et fonctionnalités avancées
**Acteurs principaux :** Tous les acteurs

### Fonctionnalités du Sprint

#### FB-013: Chat de programme
**User Story :** En tant que participant, je veux communiquer dans le chat spécifique à mon programme de formation

**Tâches :**
- [ ] **Tâche 13.1 :** Backend — Modèle et endpoints (créer/envoyer/lister/charger l’historique) (2 jours)
- [ ] **Tâche 13.2 :** Temps réel — Rooms par programme (connexion/déconnexion/événements) (2 jours)
- [ ] **Tâche 13.3 :** Frontend — Interface de chat (liste, saisie, statut connexion) (2 jours)
- [ ] **Tâche 13.4 :** Modération — gestion des participants et suppression de messages (1 jour)
- [ ] **Tâche 13.5 :** Tests (1 jour)

**Estimation totale :** 8 jours

#### FB-014: Chat pour chaque session
**User Story :** En tant que participant, je veux communiquer spécifiquement dans le chat de ma session

**Tâches :**
- [x] **Tâche 14.1 :** Backend — Modèle et endpoints (créer/envoyer/lister/charger l’historique) (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 14.2 :** Temps réel — Rooms par session (connexion/déconnexion/événements) (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 14.3 :** Frontend — Interface de chat (liste, saisie, statut connexion) (3 jours) ✅ **TERMINÉE**
- [ ] **Tâche 14.4 :** Modération — gestion des participants et suppression de messages (1 jour)
- [ ] **Tâche 14.5 :** Tests (1 jour)

**Estimation totale :** 8 jours (7 jours terminés)

#### FB-015: Chat général
**User Story :** En tant qu'utilisateur, je veux participer à des discussions générales

**Tâches :**
- [x] **Tâche 15.1 :** Backend — Endpoints globaux (envoyer/lister/chargement initial) (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 15.2 :** Temps réel — Canal global (connexion/déconnexion/événements) (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 15.3 :** Frontend — Interface de chat (liste, saisie, statut connexion) (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 15.4 :** Modération — suppression de messages (1 jour)
- [ ] **Tâche 15.5 :** Tests (1 jour)

**Estimation totale :** 7 jours (6 jours terminés)

#### FB-017: Feedback entre étudiants
**User Story :** En tant qu'étudiant, je veux donner et recevoir des feedbacks de mes pairs

**Tâches :**
- [x] **Tâche 17.1 :** Modèle feedback et évaluations (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 17.2 :** Interface de feedback (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 17.3 :** Système de notation (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 17.4 :** Tests de feedback (1 jour)

**Estimation totale :** 8 jours (7 jours terminés)

#### FB-018: Feedback formateur
**User Story :** En tant qu'étudiant, je veux évaluer mes formateurs

**Tâches :**
- [x] **Tâche 18.1 :** Évaluation par emojis (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 18.2 :** Commentaires textuels (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 18.3 :** Historique des évaluations (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 18.4 :** Tests de feedback formateur (1 jour)

**Estimation totale :** 7 jours (6 jours terminés)

#### FB-023: Feedback de session et de séance
**User Story :** En tant qu'étudiant et formateur, je veux donner/recevoir un feedback par session et par séance

**Tâches :**
- [x] **Tâche 23.1 :** Modèle `SessionFeedback` et endpoints CRUD (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 23.2 :** Modèle `SeanceFeedback` et endpoints CRUD (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 23.3 :** Liaison aux utilisateurs et sessions/séances (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 23.4 :** Agrégation et visualisation dans dashboards (1 jour)
- [ ] **Tâche 23.5 :** Tests (1 jour)

**Estimation totale :** 8 jours (6 jours terminés)

#### FB-019: Assistant IA intelligent
**User Story :** En tant qu'utilisateur, je veux interagir avec un assistant IA pour obtenir de l'aide

**Tâches :**
- [x] **Tâche 19.1 :** Interface de chat IA (2 jours) ✅ **TERMINÉE**
- [x] **Tâche 19.2 :** Intégration des modèles IA (3 jours) ✅ **TERMINÉE**
- [x] **Tâche 19.3 :** Gestion de la mémoire conversationnelle (2 jours) ✅ **TERMINÉE**
- [ ] **Tâche 19.4 :** Tests de l'assistant IA (1 jour)

**Estimation totale :** 8 jours (7 jours terminés)

**Total Sprint 3 :** 54 jours (40 jours terminés, 14 jours restants)

---

## RÉSUMÉ DES SPRINTS

| Sprint | Période | Fonctionnalités | Estimation | Terminé | Restant | Progression |
|--------|---------|----------------|------------|---------|---------|-------------|
| Sprint 1 | 11 avril - 27 juin | 13 fonctionnalités | 89 jours | 63 jours | 26 jours | 71% |
| Sprint 2 | 30 juin - 22 août | 14 fonctionnalités | 100 jours | 84 jours | 16 jours | 84% |
| Sprint 3 | 25 août - 10 septembre | 6 fonctionnalités | 46 jours | 33 jours | 13 jours | 72% |
| **Total** | **11 avril - 10 septembre** | **33 fonctionnalités** | **235 jours** | **180 jours** | **55 jours** | **77%** |

## CALENDRIER DÉTAILLÉ

### Sprint 1 : Authentification et Gestion des Utilisateurs (11 avril - 27 juin 2025)
- **Semaine 1-3 :** ✅ Système d'authentification et gestion des profils
- **Semaine 4-6 :** ✅ Administration des utilisateurs et supervision des étudiants
- **Semaine 7-9 :** ✅ Système de réclamations et notifications
- **Semaine 10-11 :** ✅ Création de programmes et modules + Dashboards administrateur et établissement

### Sprint 2 : Création et Gestion des Contenus (30 juin - 22 août 2025)
- **Semaine 1-3 :** ✅ Gestion des cours, contenus et sessions + Dashboards formateur et étudiant
- **Semaine 4-5 :** ✅ Séances formateur et tableau blanc + Dashboard créateur
- **Semaine 6-7 :** ✅ Création et passage de quiz
- **Semaine 8 :** ✅ Tests

- **Semaine 1-2 :** ✅ Systèmes de feedback et chats
- **Semaine 3-4 :** ✅ Assistant IA et tests finaux
- **Semaine 5-7 :** Tests utilisateurs finaux et déploiement

### Période de buffer (1-10 septembre)
- Tests utilisateurs finaux
- Corrections de bugs
- Formation des utilisateurs
- Déploiement en production

---

## CONFIGURATION TECHNIQUE

### Environnement Docker :
- **Base de données :** PostgreSQL containerisé ✅
- **Backend :** NestJS avec Prisma ✅
- **Frontend :** React avec hot reload ✅
- **Communication :** WebSocket pour chat temps réel ✅

### Commandes de développement :
```bash
# Démarrer l'environnement
docker-compose up -d

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# Démarrer le développement
npm run dev:backend
npm run dev:frontend
```

---

## CRITÈRES DE VALIDATION

### Pour chaque fonctionnalité :
- [x] Code développé et testé
- [ ] Tests unitaires (couverture > 70%)
- [x] Interface utilisateur responsive
- [x] Validation des critères d'acceptation
- [ ] Documentation technique
- [ ] Tests d'intégration Docker

### Pour chaque sprint :
- [x] Toutes les fonctionnalités terminées
- [ ] Démonstration réussie
- [ ] Validation par le Product Owner
- [ ] Rétrospective effectuée
- [ ] Planning du sprint suivant

---

## MÉTRIQUES DE SUCCÈS

### Indicateurs de performance :
- **Vélocité :** 75-78 jours par sprint
- **Qualité :** 0 bug critique en production
- **Couverture :** > 70% de tests
- **Performance :** < 2s de temps de réponse

### Objectifs utilisateur :
- **Authentification :** < 3 clics pour se connecter ✅
- **Création de contenu :** < 5 minutes pour créer un cours ✅
- **Communication :** Messages instantanés ✅
- **Évaluation :** Résultats immédiats ✅

---

## CORRECTIONS APPORTÉES

### ✅ **Fonctionnalités déjà implémentées :**
1. **Système d'authentification JWT** - Complètement fonctionnel
2. **Gestion des rôles** - 5 rôles définis et opérationnels
3. **Tous les dashboards** - Admin, Formateur, Étudiant, Créateur, Établissement
4. **Système de chat** - Général et par session
5. **Système de feedback** - Entre étudiants et formateurs
6. **Système de réclamations** - Interface complète
7. **Système de notifications** - Temps réel et email
8. **Assistant IA** - Chatbot intelligent
9. **Tableau blanc collaboratif** - Fonctionnel
10. **Gestion des quiz** - Création et passage

### 🔄 **Tâches en cours :**
1. **Tâche 3.3 :** Configuration des niveaux d'accès et autorisations (2 jours)
   - Guards NestJS à implémenter
   - Décorateurs d'autorisation
   - Middleware JWT sécurisé

### 📋 **Nouvelles fonctionnalités ajoutées :**
1. **FB-032 :** Supervision des étudiants par le responsable d'établissement (8 jours)
   - Interface de supervision des étudiants
   - Système d'ajout d'étudiants
   - Gestion des permissions et accès

### 📋 **Tâches restantes (36 jours) :**
- Tests unitaires et d'intégration
- Documentation technique
- Optimisation des performances
- Tests utilisateurs finaux
- Déploiement en production
- Nouvelles fonctionnalités avancées (FB-004.1, FB-006.1, FB-008.1, FB-011.1)
- Fonctionnalités avancées des réclamations (FB-020.1)

---

*Planification mise à jour le 10 janvier 2025 - Progression globale : 85%*
