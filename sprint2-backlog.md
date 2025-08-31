# Sprint 2 - Backlog des tâches par histoire utilisateur

## ID 1 - Orchestration des sessions

### Histoire 1.1 : Gestion complète des sessions
**En tant qu'administrateur, je veux gérer les sessions en créant et planifiant des sessions, en les liant avec des programmes, et en supprimant les sessions afin d'avoir un contrôle total sur l'organisation des formations**

**Tâches :**
- [ ] Créer l'interface de création et planification de sessions (dates, titre, description)
- [ ] Implémenter l'API de création et planification de sessions
- [ ] Créer l'interface de liaison session-programme avec sélection et validation
- [ ] Implémenter l'API de liaison session↔programme (contrainte: 1 programme par session)
- [ ] Créer l'interface de suppression de session avec confirmation et avertissements
- [ ] Implémenter l'API de suppression avec vérification des contraintes et impacts
- [ ] Afficher la vue calendrier (liste + calendrier) des sessions planifiées
- [ ] Gérer les impacts sur les séances et participants associés lors de la suppression
- [ ] Tester la création, liaison, suppression et la validation des sessions

### Histoire 1.2 : Consultation de la liste des sessions
**En tant qu'utilisateur, je veux voir la liste des sessions afin de consulter les formations disponibles**

**Tâches :**
- [ ] Créer l'interface d'affichage de la liste des sessions avec filtres
- [ ] Implémenter l'API de récupération des sessions avec pagination
- [ ] Ajouter des filtres par programme, statut et dates
- [ ] Tester l'affichage et le filtrage de la liste des sessions

### Histoire 1.3 : Gestion du statut de session
**En tant qu'administrateur, je veux changer le statut d'une session (active, inactive, archivé, terminé) afin de contrôler le cycle de vie des formations**

**Tâches :**
- [ ] Créer l'interface de sélection et modification du statut de session
- [ ] Implémenter l'API de changement de statut avec validation des transitions
- [ ] Ajouter les notifications automatiques lors des changements de statut
- [ ] Tester les transitions de statut et leurs impacts sur l'accès

### Histoire 1.4 : Consultation des détails du programme par session
**En tant qu'utilisateur, je veux voir les détails du programme dans chaque session afin de comprendre le contenu proposé**

**Tâches :**
- [ ] Créer l'interface d'affichage des détails du programme dans la page de session
- [ ] Implémenter l'API de récupération du programme lié à la session
- [ ] Afficher la structure des modules et cours du programme
- [ ] Tester l'affichage et l'accès selon le rôle et le statut de session

### Histoire 1.5 : Attestation de fin de session pour l'étudiant
**En tant qu'étudiant inscrit à une session, je veux obtenir une attestation quand la session est terminée afin de prouver ma participation**

**Tâches :**
- [ ] Définir les critères d'éligibilité et la transition de session à « terminé »
- [ ] Implémenter l'API de génération d'attestation (PDF) avec stockage/traçabilité et régénération admin
- [ ] Créer l'UI étudiant (consultation/téléchargement) et la notification de fin de session
- [ ] Tester la génération, les règles d'accès et la délivrance à la clôture

## ID 2 - Partage et accessibilité des sessions et gestion des cohortes

### Histoire 2.1 : Partage des sessions
**En tant qu’administrateur, je veux partager mes sessions afin que les apprenants puissent y participer efficacement**

**Tâches :**
- [ ] Générer des liens d’invitation/inscription et paramètres de visibilité
- [ ] Implémenter l’API d’inscription/accès avec contrôles (capacité, dates)
- [ ] Afficher les options de partage (lien, QR, envoi ciblé)
- [ ] Tester le flux d’accès/inscription et les limites

### Histoire 2.2 : Association cohorte-session
**En tant qu’administrateur, je veux associer une cohorte à une session afin que différents utilisateurs puissent suivre la même formation**

**Tâches :**
- [ ] Créer l’UI d’affectation des cohortes à une session
- [ ] Implémenter l’API de liaison cohorte↔session (capacités, unicité)
- [ ] Valider les règles (cohorte active, compatibilité dates)
- [ ] Tester l’affectation et la mise à jour des cohortes

### Histoire 2.3 : Gestion des étudiants dans la cohorte d’une session
**En tant que responsable d’établissement, je veux modifier ou retirer des étudiants dans la cohorte d’une session afin d’adapter l’organisation**

**Tâches :**
- [ ] Créer l’interface de gestion des membres (ajout/retrait, recherche)
- [ ] Implémenter l’API d’ajout/retrait avec journalisation (audit)
- [ ] Gérer les contraintes (session démarrée, prérequis, notifications)
- [ ] Tester les scénarios de modification de cohorte

## ID 3 - Structuration hiérarchique des parcours pédagogiques

 

### Histoire 3.1 : Création et suppression des modules, cours, contenus, programmes et modification des quiz
**En tant que créateur de formation, je veux pouvoir créer et supprimer des modules, cours, contenus, programmes (avec hiérarchie) et modifier uniquement les quiz dans les contenus afin d'avoir un contrôle total sur l'organisation de mes formations**

**Tâches :**
- [ ] Créer l'interface de création et suppression des modules avec formulaires
- [ ] Créer l'interface de création et suppression des cours avec formulaires
- [ ] Créer l'interface de création et suppression des contenus avec upload
- [ ] Créer l'interface de création et suppression des programmes avec construction hiérarchique
- [ ] Créer l'interface de modification des quiz dans les contenus
- [ ] Implémenter les API de création et suppression pour modules
- [ ] Implémenter les API de création et suppression pour cours
- [ ] Implémenter les API de création et suppression pour contenus
- [ ] Implémenter les API de création et suppression pour programmes avec hiérarchie
- [ ] Implémenter l'API de modification des quiz avec validation
- [ ] Ajouter la gestion des relations hiérarchiques (programme → module → cours → contenu)
- [ ] Tester la cohérence des données et les contraintes d'intégrité

### Histoire 3.2 : Consultation des listes de programmes, modules, cours et contenus
**En tant qu'administrateur et créateur de formation, je veux voir la liste des programmes, modules, cours et contenus afin de gérer efficacement la structure pédagogique**

**Tâches :**
- [ ] Créer les interfaces de listes avec recherche, filtres et pagination pour programmes
- [ ] Créer les interfaces de listes avec recherche, filtres et pagination pour modules
- [ ] Créer les interfaces de listes avec recherche, filtres et pagination pour cours
- [ ] Créer les interfaces de listes avec recherche, filtres et pagination pour contenus
- [ ] Implémenter les API de listing (programmes/modules/cours/contenus) avec tri et filtres
- [ ] Appliquer les permissions par rôle (admin vs créateur) pour l'accès aux listes
- [ ] Ajouter la visualisation de la structure hiérarchique dans les listes
- [ ] Tester l'affichage, les filtres et les règles d'accès selon le rôle

### Histoire 3.3 : CRUD des programmes avec construction hiérarchique
**En tant que créateur de formation, je veux pouvoir créer, modifier et supprimer des programmes, puis les structurer hiérarchiquement en ajoutant des modules, puis des cours, puis différents types de contenus afin de construire des parcours pédagogiques complets**

**Tâches :**
- [ ] Créer l'interface CRUD complète pour les programmes (création, édition, consultation, suppression)
- [ ] Implémenter l'API CRUD pour les programmes avec validation des données
- [ ] Créer l'interface d'ajout de modules à un programme avec gestion de l'ordre
- [ ] Créer l'interface d'ajout de cours aux modules avec gestion de l'ordre
- [ ] Créer l'interface d'ajout de différents types de contenus aux cours (PDF, vidéo, quiz, etc.)
- [ ] Implémenter les API de liaison hiérarchique (programme → module → cours → contenu)
- [ ] Ajouter la validation des contraintes hiérarchiques et la gestion des dépendances
- [ ] Créer l'interface de visualisation de la structure hiérarchique complète
- [ ] Tester le processus complet de création et modification de programmes



 

## ID 7 - Système de notifications en temps réel

### Histoire 7.1 : Notifications admin sur nouveaux contenus
**En tant qu'administrateur, je veux être notifié pour toute nouvelle module, cours, contenu**

**Tâches :**
- [ ] Mettre en place le canal temps réel (WebSocket/Socket.io)
- [ ] Déclencher des événements à la création de module/cours/contenu
- [ ] Créer le centre de notifications (UI) avec lu/non-lu
- [ ] Gérer les préférences de notifications et tester les flux

## ID 8 - Système de notifications automatisées par courrier électronique

### Histoire 8.1 : Email à l'activation d'une session
**En tant qu'utilisateur inscrit à une session, je veux recevoir un email quand la session devient active afin de ne pas rater le démarrage**

**Tâches :**
- [ ] Créer le template d'email d'activation de session
- [ ] Déclencher l'envoi en tâche de fond lors du passage à « active »
- [ ] Filtrer les destinataires aux inscrits (opt-in/opt-out)
- [ ] Tester l'envoi, le timing et les erreurs


