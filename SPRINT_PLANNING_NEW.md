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
- [ ] **Tâche 1.1 :** Configuration Docker et base de données (2 jours)
- [ ] **Tâche 1.2 :** Modèle utilisateur et authentification JWT (3 jours)
- [ ] **Tâche 1.3 :** Interface de connexion et inscription (2 jours)
- [ ] **Tâche 1.4 :** Tests d'authentification (1 jour)

**Estimation totale :** 8 jours

#### FB-002: Gestion des profils utilisateurs
**User Story :** En tant qu'utilisateur, je veux gérer mon profil avec photo, compétences et informations personnelles

**Tâches :**
- [ ] **Tâche 2.1 :** Développement et extension du modèle de données utilisateur (2 jours)
- [ ] **Tâche 2.2 :** Upload de photo de profil (2 jours)
- [ ] **Tâche 2.3 :** Interface d'édition de profil (2 jours)
- [ ] **Tâche 2.4 :** Tests de gestion de profil (1 jour)

**Estimation totale :** 7 jours

#### FB-003: Administration centralisée des comptes utilisateurs
**User Story :** En tant qu'administrateur système, je souhaite disposer d'un panel de contrôle pour superviser l'ensemble des comptes de la plateforme

**Tâches :**
- [ ] **Tâche 3.1 :** Développement du tableau de bord administratif (3 jours)
- [ ] **Tâche 3.2 :** Implémentation des opérations de base sur les comptes (2 jours)
- [ ] **Tâche 3.3 :** Configuration des niveaux d'accès et autorisations (2 jours)
- [ ] **Tâche 3.4 :** Validation et tests de l'interface administrative (1 jour)

**Estimation totale :** 8 jours

#### FB-003.1: Ajout d'utilisateurs par l'administrateur
**User Story :** En tant qu'administrateur, je veux ajouter des utilisateurs à la plateforme

**Tâches :**
- [ ] **Tâche 3.5 :** Développement de l'interface de création et gestion des utilisateurs (2 jours)
- [ ] **Tâche 3.6 :** Système de validation et vérification des emails utilisateurs (2 jours)
- [ ] **Tâche 3.7 :** Tests d'ajout d'utilisateurs (1 jour)

**Estimation totale :** 5 jours

#### FB-024: Dashboard administrateur
**User Story :** En tant qu'administrateur, je veux avoir une vue d'ensemble de la plateforme

**Tâches :**
- [ ] **Tâche 24.1 :** Statistiques globales (3 jours)
- [ ] **Tâche 24.2 :** Gestion des utilisateurs (2 jours)
- [ ] **Tâche 24.3 :** Monitoring système (2 jours)
- [ ] **Tâche 24.4 :** Tests du dashboard admin (1 jour)

**Estimation totale :** 8 jours

#### FB-031: Gestion des fichiers et médias
**User Story :** En tant qu'utilisateur, je veux uploader et gérer mes fichiers

**Tâches :**
- [ ] **Tâche 31.1 :** Interface de gestion centralisée des fichiers (3 jours)
- [ ] **Tâche 31.2 :** Système de dossiers et organisation (2 jours)
- [ ] **Tâche 31.3 :** Recherche et filtres avancés (1 jour)
- [ ] **Tâche 31.4 :** Tests d'amélioration des fichiers (1 jour)

**Estimation totale :** 7 jours

#### FB-020: Système de réclamations
**User Story :** En tant qu'utilisateur, je veux soumettre des réclamations et suivre leur traitement

**Tâches :**
- [ ] **Tâche 20.1 :** Interface de soumission de réclamations (2 jours)
- [ ] **Tâche 20.2 :** Système de suivi et statuts (2 jours)
- [ ] **Tâche 20.3 :** Gestion administrative des réclamations (2 jours)
- [ ] **Tâche 20.4 :** Tests du système de réclamations (1 jour)

**Estimation totale :** 7 jours

#### FB-021: Notifications en temps réel
**User Story :** En tant qu'utilisateur, je veux recevoir des notifications en temps réel

**Tâches :**
- [ ] **Tâche 21.1 :** Notifications push (3 jours)
- [ ] **Tâche 21.2 :** Types de notifications variés (2 jours)
- [ ] **Tâche 21.3 :** Gestion des liens (2 jours)
- [ ] **Tâche 21.4 :** Tests des notifications (1 jour)

**Estimation totale :** 8 jours

#### FB-022: Système de notifications par email
**User Story :** En tant qu'utilisateur, je veux recevoir des notifications importantes par email

**Tâches :**
- [ ] **Tâche 22.1 :** Configuration du service d'email (2 jours)
- [ ] **Tâche 22.2 :** Templates d'emails personnalisés (2 jours)
- [ ] **Tâche 22.3 :** Gestion des préférences de notification (2 jours)
- [ ] **Tâche 22.4 :** Tests du système d'email (1 jour)

**Estimation totale :** 7 jours

**Total Sprint 1 :** 71 jours (11 semaines avec 4 développeurs)

---

## SPRINT 2 : CRÉATION ET GESTION DES CONTENUS (30 juin - 22 août 2025)
**Durée :** 8 semaines  
**Objectif :** Création et gestion des programmes, modules, cours et contenus
**Acteurs principaux :** Créateur de Formation, Formateur

### Fonctionnalités du Sprint

#### FB-004: Création et gestion des programmes
**User Story :** En tant que créateur de formation, je veux créer des programmes structurés avec modules et cours

**Tâches :**
- [ ] **Tâche 4.1 :** Modèle programme et modules (3 jours)
- [ ] **Tâche 4.2 :** Interface de création de programmes (4 jours)
- [ ] **Tâche 4.3 :** Système de publication (2 jours)
- [ ] **Tâche 4.4 :** Tests des programmes (1 jour)

**Estimation totale :** 10 jours

#### FB-005: Gestion des modules
**User Story :** En tant que formateur, je veux organiser le contenu en modules avec durée et unités de période

**Tâches :**
- [ ] **Tâche 5.1 :** Modèle module et associations (2 jours)
- [ ] **Tâche 5.2 :** Interface de gestion des modules (3 jours)
- [ ] **Tâche 5.3 :** Gestion des durées et périodes (2 jours)
- [ ] **Tâche 5.4 :** Tests des modules (1 jour)

**Estimation totale :** 8 jours

#### FB-006: Gestion des cours
**User Story :** En tant que formateur, je veux créer des cours avec contenu structuré

**Tâches :**
- [ ] **Tâche 6.1 :** Modèle cours et contenu (3 jours)
- [ ] **Tâche 6.2 :** Interface de création de cours (4 jours)
- [ ] **Tâche 6.3 :** Éditeur de contenu multimédia (2 jours)
- [ ] **Tâche 6.4 :** Tests des cours (1 jour)

**Estimation totale :** 10 jours

#### FB-007: Gestion des contenus
**User Story :** En tant que formateur, je veux ajouter différents types de contenu (PDF, vidéo, texte)

**Tâches :**
- [ ] **Tâche 7.1 :** Upload de fichiers (PDF, images, vidéos) (3 jours)
- [ ] **Tâche 7.2 :** Contenu texte riche (2 jours)
- [ ] **Tâche 7.3 :** Types de contenu variés (2 jours)
- [ ] **Tâche 7.4 :** Tests des contenus (1 jour)

**Estimation totale :** 8 jours

#### FB-008: Gestion des sessions
**User Story :** En tant que formateur, je veux créer des sessions avec dates et participants

**Tâches :**
- [ ] **Tâche 8.1 :** Modèle session et séances (3 jours)
- [ ] **Tâche 8.2 :** Interface de planification (4 jours)
- [ ] **Tâche 8.3 :** Gestion des participants (2 jours)
- [ ] **Tâche 8.4 :** Tests des sessions (1 jour)

**Estimation totale :** 10 jours

#### FB-009: Gestion des séances formateur
**User Story :** En tant que formateur, je veux planifier des séances avec horaires et contenu

**Tâches :**
- [ ] **Tâche 9.1 :** Création de séances avec titre et horaires (3 jours)
- [ ] **Tâche 9.2 :** Association formateur-séance (2 jours)
- [ ] **Tâche 9.3 :** Gestion des médias de séance (2 jours)
- [ ] **Tâche 9.4 :** Tests des séances (1 jour)

**Estimation totale :** 8 jours

#### FB-025: Dashboard formateur
**User Story :** En tant que formateur, je veux gérer mes sessions et suivre mes étudiants

**Tâches :**
- [ ] **Tâche 25.1 :** Gestion des séances (3 jours)
- [ ] **Tâche 25.2 :** Suivi des étudiants (2 jours)
- [ ] **Tâche 25.3 :** Statistiques de performance (2 jours)
- [ ] **Tâche 25.4 :** Tests du dashboard formateur (1 jour)

**Estimation totale :** 8 jours

#### FB-027: Dashboard créateur de formation
**User Story :** En tant que créateur de formation, je veux avoir une vue d'ensemble de mes programmes et sessions

**Tâches :**
- [ ] **Tâche 27.1 :** Statistiques des programmes créés (3 jours)
- [ ] **Tâche 27.2 :** Suivi des sessions et performances (2 jours)
- [ ] **Tâche 27.3 :** Graphiques et analyses (2 jours)
- [ ] **Tâche 27.4 :** Tests du dashboard créateur (1 jour)

**Estimation totale :** 8 jours

#### FB-028: Dashboard responsable d'établissement
**User Story :** En tant que responsable d'établissement, je veux suivre les performances de mes étudiants

**Tâches :**
- [ ] **Tâche 28.1 :** Gestion des étudiants par session (3 jours)
- [ ] **Tâche 28.2 :** Suivi des moyennes et récompenses (2 jours)
- [ ] **Tâche 28.3 :** Filtres et analyses par établissement (2 jours)
- [ ] **Tâche 28.4 :** Tests du dashboard établissement (1 jour)

**Estimation totale :** 8 jours

#### FB-011: Création de quiz
**User Story :** En tant que formateur, je veux créer des quiz avec différents types de questions

**Tâches :**
- [ ] **Tâche 11.1 :** Modèle quiz et questions (3 jours)
- [ ] **Tâche 11.2 :** Interface de création de quiz (4 jours)
- [ ] **Tâche 11.3 :** Système de points et temps (2 jours)
- [ ] **Tâche 11.4 :** Tests des quiz (1 jour)

**Estimation totale :** 10 jours

#### FB-016: Tableau blanc collaboratif
**User Story :** En tant que formateur, je veux utiliser un tableau blanc interactif pour mes présentations

**Tâches :**
- [ ] **Tâche 16.1 :** Interface de dessin temps réel (3 jours)
- [ ] **Tâche 16.2 :** Outils de dessin (stylo, formes, texte) (2 jours)
- [ ] **Tâche 16.3 :** Synchronisation collaborative (2 jours)
- [ ] **Tâche 16.4 :** Tests du tableau blanc (1 jour)

**Estimation totale :** 8 jours

**Total Sprint 2 :** 96 jours (8 semaines avec 4 développeurs)

---

## SPRINT 3 : PARTICIPATION ET ÉVALUATION (25 août - 10 septembre 2025)
**Durée :** 7 semaines  
**Objectif :** Participation des étudiants, évaluation et feedback
**Acteurs principaux :** Étudiant, Formateur

### Fonctionnalités du Sprint

#### FB-010: Inscription aux sessions
**User Story :** En tant qu'étudiant, je veux m'inscrire aux sessions de formation

**Tâches :**
- [ ] **Tâche 10.1 :** Interface d'inscription aux sessions (3 jours)
- [ ] **Tâche 10.2 :** Gestion des inscriptions multiples (2 jours)
- [ ] **Tâche 10.3 :** Confirmation d'inscription (2 jours)
- [ ] **Tâche 10.4 :** Tests d'inscription (1 jour)

**Estimation totale :** 8 jours

#### FB-026: Dashboard étudiant
**User Story :** En tant qu'étudiant, je veux accéder à mes cours et suivre mes progrès

**Tâches :**
- [ ] **Tâche 26.1 :** Cours inscrits (3 jours)
- [ ] **Tâche 26.2 :** Progression (2 jours)
- [ ] **Tâche 26.3 :** Calendrier (2 jours)
- [ ] **Tâche 26.4 :** Tests du dashboard étudiant (1 jour)

**Estimation totale :** 8 jours

#### FB-014: Chat pour chaque session
**User Story :** En tant que participant, je veux communiquer spécifiquement dans le chat de ma session

**Tâches :**
- [ ] **Tâche 14.1 :** Configuration WebSocket (2 jours)
- [ ] **Tâche 14.2 :** Modèle messages et chat (2 jours)
- [ ] **Tâche 14.3 :** Interface de chat temps réel (3 jours)
- [ ] **Tâche 14.4 :** Tests du chat (1 jour)

**Estimation totale :** 8 jours

#### FB-015: Chat général
**User Story :** En tant qu'utilisateur, je veux participer à des discussions générales

**Tâches :**
- [ ] **Tâche 15.1 :** Chat global accessible (2 jours)
- [ ] **Tâche 15.2 :** Messages persistants (2 jours)
- [ ] **Tâche 15.3 :** Interface intuitive (2 jours)
- [ ] **Tâche 15.4 :** Tests du chat général (1 jour)

**Estimation totale :** 7 jours

#### FB-012: Passage de quiz
**User Story :** En tant qu'étudiant, je veux passer des quiz pour évaluer mes connaissances

**Tâches :**
- [ ] **Tâche 12.1 :** Interface de passage de quiz (3 jours)
- [ ] **Tâche 12.2 :** Chronomètre et sauvegarde (2 jours)
- [ ] **Tâche 12.3 :** Calcul des scores (2 jours)
- [ ] **Tâche 12.4 :** Tests de passage de quiz (1 jour)

**Estimation totale :** 8 jours

#### FB-017: Feedback entre étudiants
**User Story :** En tant qu'étudiant, je veux donner et recevoir des feedbacks de mes pairs

**Tâches :**
- [ ] **Tâche 17.1 :** Modèle feedback et évaluations (2 jours)
- [ ] **Tâche 17.2 :** Interface de feedback (3 jours)
- [ ] **Tâche 17.3 :** Système de notation (2 jours)
- [ ] **Tâche 17.4 :** Tests de feedback (1 jour)

**Estimation totale :** 8 jours

#### FB-018: Feedback formateur
**User Story :** En tant qu'étudiant, je veux évaluer mes formateurs

**Tâches :**
- [ ] **Tâche 18.1 :** Évaluation par emojis (2 jours)
- [ ] **Tâche 18.2 :** Commentaires textuels (2 jours)
- [ ] **Tâche 18.3 :** Historique des évaluations (2 jours)
- [ ] **Tâche 18.4 :** Tests de feedback formateur (1 jour)

**Estimation totale :** 7 jours

#### FB-019: Assistant IA intelligent
**User Story :** En tant qu'utilisateur, je veux interagir avec un assistant IA pour obtenir de l'aide

**Tâches :**
- [ ] **Tâche 19.1 :** Interface de chat IA (2 jours)
- [ ] **Tâche 19.2 :** Intégration des modèles IA (3 jours)
- [ ] **Tâche 19.3 :** Gestion de la mémoire conversationnelle (2 jours)
- [ ] **Tâche 19.4 :** Tests de l'assistant IA (1 jour)

**Estimation totale :** 8 jours

**Total Sprint 3 :** 62 jours (7 semaines avec 4 développeurs)

---

## RÉSUMÉ DES SPRINTS

| Sprint | Période | Fonctionnalités | Estimation | Durée avec 4 devs | Acteurs principaux |
|--------|---------|----------------|------------|-------------------|-------------------|
| Sprint 1 | 11 avril - 27 juin | 9 fonctionnalités | 71 jours | 11 semaines | Utilisateur, Administrateur |
| Sprint 2 | 30 juin - 22 août | 11 fonctionnalités | 96 jours | 8 semaines | Créateur, Formateur |
| Sprint 3 | 25 août - 10 septembre | 8 fonctionnalités | 62 jours | 7 semaines | Étudiant, Formateur |
| **Total** | **11 avril - 10 septembre** | **28 fonctionnalités** | **229 jours** | **26 semaines** | **Tous les acteurs** |

## CALENDRIER DÉTAILLÉ

### Sprint 1 : Authentification et Gestion des Utilisateurs (11 avril - 27 juin 2025)
- **Semaine 1-3 :** Système d'authentification et gestion des profils
- **Semaine 4-6 :** Administration des utilisateurs et gestion des fichiers
- **Semaine 7-9 :** Système de réclamations et notifications
- **Semaine 10-11 :** Dashboard administrateur et tests

### Sprint 2 : Création et Gestion des Contenus (30 juin - 22 août 2025)
- **Semaine 1-3 :** Création de programmes, modules et cours
- **Semaine 4-5 :** Gestion des contenus et sessions
- **Semaine 6-7 :** Séances formateur et tableau blanc
- **Semaine 8 :** Création de quiz et développement des dashboards (formateur, créateur, établissement)

### Sprint 3 : Participation et Évaluation (25 août - 10 septembre 2025)
- **Semaine 1-2 :** Inscription aux sessions et dashboard étudiant
- **Semaine 3-4 :** Systèmes de chat et passage de quiz
- **Semaine 5-6 :** Feedback et évaluations
- **Semaine 7 :** Assistant IA et tests finaux

### Période de buffer (1-10 septembre)
- Tests utilisateurs finaux
- Corrections de bugs
- Formation des utilisateurs
- Déploiement en production

---

## CONFIGURATION TECHNIQUE

### Environnement Docker :
- **Base de données :** PostgreSQL containerisé
- **Backend :** NestJS avec Prisma
- **Frontend :** React avec hot reload
- **Communication :** WebSocket pour chat temps réel

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
- [ ] Code développé et testé
- [ ] Tests unitaires (couverture > 70%)
- [ ] Interface utilisateur responsive
- [ ] Validation des critères d'acceptation
- [ ] Documentation technique
- [ ] Tests d'intégration Docker

### Pour chaque sprint :
- [ ] Toutes les fonctionnalités terminées
- [ ] Démonstration réussie
- [ ] Validation par le Product Owner
- [ ] Rétrospective effectuée
- [ ] Planning du sprint suivant

---

## MÉTRIQUES DE SUCCÈS

### Indicateurs de performance :
- **Vélocité :** 60-80 jours par sprint
- **Qualité :** 0 bug critique en production
- **Couverture :** > 70% de tests
- **Performance :** < 2s de temps de réponse

### Objectifs utilisateur :
- **Authentification :** < 3 clics pour se connecter
- **Création de contenu :** < 5 minutes pour créer un cours
- **Communication :** Messages instantanés
- **Évaluation :** Résultats immédiats

---

*Planification harmonisée avec le Product Backlog pour le LMS MKA 2025 avec contraintes de temps optimisées.*
