# Sprint 2 - Backlog des tâches par histoire utilisateur

## ID 1 - Orchestration des sessions

### Histoire 1.1 : Création et planification des sessions
**En tant qu’administrateur, je veux créer et planifier des sessions avec des dates précises afin d’organiser le calendrier de la formation**

**Tâches :**
- [ ] Créer le formulaire de création/édition de session (dates, titre, programme)
- [ ] Implémenter l’API de création 
- [ ] Afficher la vue calendrier (liste + calendrier) des sessions planifiées
- [ ] Tester la création, l’édition et la validation des sessions

### Histoire 1.2 : Liaison programme-session
**En tant qu’administrateur, je veux lier un programme à une session afin de garantir un parcours cohérent aux étudiants**

**Tâches :**
- [ ] Ajouter la sélection du programme dans le formulaire de session
- [ ] Implémenter l’API de liaison session↔programme (contrainte: 1 programme par session)
- [ ] Valider la cohérence (programme actif, droits) côté serveur
- [ ] Tester la liaison/déliaison et les cas d’erreur

### Histoire 1.3 : Gestion de la liste des programmes
**En tant que créateur de formation, je veux créer et gérer la liste de programmes pour les sessions afin de maintenir une organisation centralisée**

**Tâches :**
- [ ] Créer l'interface CRUD des programmes (liste, création, édition, suppression)
- [ ] Implémenter l'API programmes (pagination, recherche, statuts)
- [ ] Gérer les permissions spécifiques au créateur de formation
- [ ] Tester les opérations CRUD et les règles d'accès

### Histoire 1.4 : Consultation de la liste des sessions
**En tant qu'utilisateur, je veux voir la liste des sessions afin de consulter les formations disponibles**

**Tâches :**
- [ ] Créer l'interface d'affichage de la liste des sessions avec filtres
- [ ] Implémenter l'API de récupération des sessions avec pagination
- [ ] Ajouter des filtres par programme, statut et dates
- [ ] Tester l'affichage et le filtrage de la liste des sessions

### Histoire 1.5 : Suppression d'une session
**En tant qu'administrateur, je veux supprimer une session afin de gérer l'organisation des formations**

**Tâches :**
- [ ] Créer l'interface de suppression avec confirmation et avertissements
- [ ] Implémenter l'API de suppression avec vérification des contraintes
- [ ] Gérer les impacts sur les séances et participants associés
- [ ] Tester la suppression et la gestion des données liées

### Histoire 1.6 : Gestion du statut de session
**En tant qu'administrateur, je veux changer le statut d'une session (active, inactive, archivé, terminé) afin de contrôler le cycle de vie des formations**

**Tâches :**
- [ ] Créer l'interface de sélection et modification du statut de session
- [ ] Implémenter l'API de changement de statut avec validation des transitions
- [ ] Ajouter les notifications automatiques lors des changements de statut
- [ ] Tester les transitions de statut et leurs impacts sur l'accès

### Histoire 1.7 : Consultation des détails du programme par session
**En tant qu'utilisateur, je veux voir les détails du programme dans chaque session afin de comprendre le contenu proposé**

**Tâches :**
- [ ] Créer l'interface d'affichage des détails du programme dans la page de session
- [ ] Implémenter l'API de récupération du programme lié à la session
- [ ] Afficher la structure des modules et cours du programme
- [ ] Tester l'affichage et l'accès selon le rôle et le statut de session

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

### Histoire 3.1 : Organisation d’un programme en modules
**En tant que créateur de formation, je veux organiser un programme en modules afin de mieux structurer la formation**

**Tâches :**
- [ ] Créer l’UI de gestion des modules (CRUD et ordre)
- [ ] Implémenter l’API modules (création, ordre, rattachement au programme)
- [ ] Gérer le réordonnancement (drag & drop) et persistance
- [ ] Tester la structuration et les contraintes d’ordre

### Histoire 3.2 : Ajout de cours aux modules
**En tant que créateur de formation, je veux ajouter plusieurs cours à chaque module afin d’enrichir le parcours pédagogique**

**Tâches :**
- [ ] Créer l’UI d’ajout/association de cours au module
- [ ] Implémenter l’API d’association module↔cours (ordre, unicité)
- [ ] Ajouter l’import/bulk-add de cours (CSV/JSON)
- [ ] Tester l’association et l’affichage par module

### Histoire 3.3 : Intégration de contenus variés dans un cours
**En tant que créateur de formation, je veux intégrer divers types de contenus (PDF, Vidéo, Quiz) dans un cours pour diversifier les ressources et les méthodes d'apprentissage**

**Tâches :**
- [ ] Créer l'interface d'upload de fichiers (PDF, vidéo) avec drag & drop et validation
- [ ] Implémenter l'API de gestion des contenus (stockage, métadonnées, formats supportés)
- [ ] Intégrer les visionneuses PDF et lecteurs vidéo dans l'interface de cours
- [ ] Tester l'upload, la validation et l'affichage des différents types de contenus

### Histoire 3.4 : Niveau du programme
**En tant que créateur de formation, je veux définir un niveau (basique, intermédiaire, avancé) pour chaque programme afin de mieux orienter les apprenants selon leur profil**

**Tâches :**
- [ ] Créer l'interface de sélection du niveau dans le formulaire de programme
- [ ] Implémenter la migration de base de données pour ajouter le champ niveau
- [ ] Créer l'API de filtrage et tri des programmes par niveau
- [ ] Tester la création, modification et filtrage des programmes par niveau

### Histoire 3.5 : Consultation des listes (programmes, modules, cours, contenus)
**En tant qu’administrateur et créateur de formation, je veux voir la liste des programmes, modules, cours et contenus afin de gérer efficacement la structure pédagogique**

**Tâches :**
- [ ] Créer les interfaces de listes avec recherche, filtres et pagination
- [ ] Implémenter les API de listing (programmes/modules/cours/contenus) avec tri
- [ ] Appliquer les permissions par rôle (admin vs créateur)
- [ ] Tester l’affichage, les filtres et les règles d’accès

### Histoire 3.6 : Suppression d’un programme, module, cours ou contenu
**En tant que créateur de formation, je veux supprimer un programme, module, cours ou contenu afin de maintenir une base propre**

**Tâches :**
- [ ] Créer l’UI de suppression (confirmation, avertissements d’impact)
- [ ] Implémenter les API de suppression avec vérifications d’intégrité (références)
- [ ] Gérer les effets de bord (réordonnancement, relations, médias)
- [ ] Tester la suppression et la cohérence des données

### Histoire 3.7 : Gestion et publication des contenus et programmes
**En tant que créateur de formation, je veux consulter le contenu, modifier les quiz et les programmes, et publier/dépublier un programme**

**Tâches :**
- [ ] Créer l’interface de consultation/édition des contenus, quiz et programmes
- [ ] Implémenter les API de mise à jour (quiz, programme) avec validations
- [ ] Ajouter les états de publication du programme (publié/dépublié) et l’historique
- [ ] Tester l’édition et les transitions de publication

## ID 4 - Planification et gestion des séances

### Histoire 4.1 : Planifier des séances
**En tant que formateur, je veux planifier multiples séances dans une session afin de structurer le déroulement pédagogique**

**Tâches :**
- [ ] Créer l’UI de planification (séances multiples/récurrentes, horaires, salle/lien)
- [ ] Implémenter l’API de création avec vérification de conflits horaires
- [ ] Afficher les séances dans un calendrier et une vue liste
- [ ] Tester la planification et la détection de conflits

### Histoire 4.2 : Modifier ou annuler une séance
**En tant que formateur, je veux modifier ou annuler une séance afin d’adapter le calendrier aux besoins**

**Tâches :**
- [ ] Créer l’UI d’édition/annulation (motif, reprogrammation)
- [ ] Implémenter l’API de mise à jour/statut et notifier les participants
- [ ] Journaliser les changements (audit) et gérer les impacts (ressources)
- [ ] Tester les modifications et annulations

### Histoire 4.3 : Médias de séance
**En tant que formateur, je veux ajouter des images ou des vidéos pour animer la séance**

**Tâches :**
- [ ] Implémenter l’upload de médias liés à la séance (drag & drop)
- [ ] Gérer le stockage, les quotas et la prévisualisation
- [ ] Afficher une galerie de médias dans la page de séance
- [ ] Tester l’upload, l’affichage et les limites

### Histoire 4.4 : Publication du contenu aux étudiants
**En tant que formateur, je veux publier le contenu pour les étudiants**

**Tâches :**
- [ ] Créer l'interface de gestion des états de publication (brouillon/publié/planifié)
- [ ] Implémenter l'API de changement d'état avec contrôle des permissions
- [ ] Ajouter le système de planification automatique de publication
- [ ] Tester la visibilité des contenus selon l'état et les droits d'accès

### Histoire 4.5 : Groupes d’étudiants pour activités
**En tant que formateur, je veux regrouper les étudiants pour faire des activités**

**Tâches :**
- [ ] Créer l'UI de création et d'affectation de groupes
- [ ] Implémenter l'API de gestion des groupes (création, assignation, dissolution)
- [ ] Ajouter des stratégies d'affectation (aléatoire/critères)
- [ ] Tester la création et l'utilisation des groupes en séance

### Histoire 4.6 : Rejoindre une séance
**En tant que formateur ou étudiant, je veux rejoindre une séance afin de participer activement à la formation**

**Tâches :**
- [ ] Créer l'interface de sélection et de connexion à une séance
- [ ] Implémenter l'API de vérification des droits d'accès à la séance
- [ ] Ajouter la gestion de l'état de présence (connecté/déconnecté)
- [ ] Tester l'accès et la connexion aux séances selon les rôles

## ID 5 - Passage des quiz et évaluations

### Histoire 5.1 : Passage de quiz côté étudiant
**En tant qu’étudiant, je veux passer les quiz mis à disposition et consulter mes résultats pour vérifier mes connaissances**

**Tâches :**
- [ ] Créer l’interface de passage de quiz (navigation, minuterie, accessibilité)
- [ ] Implémenter la soumission et la correction automatique
- [ ] Afficher les résultats détaillés et le feedback
- [ ] Tester le flux complet de passage de quiz

### Histoire 5.2 : Consultation des résultats par le formateur
**En tant que formateur, je veux vérifier les résultats des étudiants afin de tester leur compréhension**

**Tâches :**
- [ ] Créer le tableau de bord des résultats avec filtres par session et module
- [ ] Implémenter l'API de récupération des résultats avec agrégation des scores
- [ ] Ajouter la fonctionnalité d'export des résultats en format CSV/Excel
- [ ] Tester l'affichage des résultats et les fonctionnalités d'export

## ID 6 - Outils de collaboration en ligne

### Histoire 6.1 : Réunions Jitsi Meet
**En tant que formateur ou étudiant, je veux utiliser Jitsi Meet pour les réunions à distance et visioconférences pour faciliter la participation aux cours planifiés**

**Tâches :**
- [ ] Intégrer la création automatique de salles Jitsi pour chaque séance
- [ ] Créer l'interface de gestion des réunions avec bouton "Rejoindre"
- [ ] Implémenter l'authentification sécurisée des utilisateurs dans les réunions
- [ ] Tester la création des salles et l'accès aux réunions

### Histoire 6.2 : Tableau blanc interactif
**En tant que formateur, je veux utiliser un tableau blanc interactif pour mes présentations pour illustrer les concepts enseignés**

**Tâches :**
- [ ] Intégrer l’outil de tableau blanc (synchro temps réel)
- [ ] Gérer permissions (éditeur/lecteur) et historique
- [ ] Sauvegarder/exporter les tableaux (PDF/PNG)
- [ ] Tester la collaboration et la persistance

## ID 7 - Système de notifications en temps réel

### Histoire 7.1 : Notifications admin sur nouveaux contenus
**En tant qu’administrateur, je veux être notifié pour toute nouvelle module, cours, contenu**

**Tâches :**
- [ ] Mettre en place le canal temps réel (WebSocket/Socket.io)
- [ ] Déclencher des événements à la création de module/cours/contenu
- [ ] Créer le centre de notifications (UI) avec lu/non-lu
- [ ] Gérer les préférences de notifications et tester les flux

## ID 8 - Système de notifications automatisées par courrier électronique

### Histoire 8.1 : Email à l’activation d’une session
**En tant qu’utilisateur inscrit à une session, je veux recevoir un email quand la session devient active afin de ne pas rater le démarrage**

**Tâches :**
- [ ] Créer le template d’email d’activation de session
- [ ] Déclencher l’envoi en tâche de fond lors du passage à « active »
- [ ] Filtrer les destinataires aux inscrits (opt-in/opt-out)
- [ ] Tester l’envoi, le timing et les erreurs


