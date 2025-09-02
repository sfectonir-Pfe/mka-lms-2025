# Sprint 3 - Backlog des tâches par histoire utilisateur

## ID 1 - Planification et gestion des séances

### Histoire 1.1 : Planifier des séances
**En tant que formateur, je veux planifier multiples séances dans une session afin de structurer le déroulement pédagogique**

**Tâches :**
- [ ] Créer l’UI de planification (séances multiples/récurrentes, horaires, salle/lien)
- [ ] Implémenter l’API de création avec vérification de conflits horaires
- [ ] Afficher les séances dans un calendrier et une vue liste
- [ ] Tester la planification et la détection de conflits

### Histoire 1.2 : Modifier ou annuler une séance
**En tant que formateur, je veux modifier ou annuler une séance afin d’adapter le calendrier aux besoins**

**Tâches :**
- [ ] Créer l’UI d’édition/annulation (motif, reprogrammation)
- [ ] Implémenter l’API de mise à jour/statut et notifier les participants
- [ ] Journaliser les changements (audit) et gérer les impacts (ressources)
- [ ] Tester les modifications et annulations

### Histoire 1.3 : Médias de séance
**En tant que formateur, je veux ajouter des images ou des vidéos pour animer la séance**

**Tâches :**
- [ ] Implémenter l’upload de médias liés à la séance (drag & drop)
- [ ] Gérer le stockage, les quotas et la prévisualisation
- [ ] Afficher une galerie de médias dans la page de séance
- [ ] Tester l’upload, l’affichage et les limites

### Histoire 1.4 : Publication du contenu aux étudiants
**En tant que formateur, je veux publier le contenu pour les étudiants**

**Tâches :**
- [ ] Créer l'interface de gestion des états de publication (brouillon/publié/planifié)
- [ ] Implémenter l'API de changement d'état avec contrôle des permissions
- [ ] Ajouter le système de planification automatique de publication
- [ ] Tester la visibilité des contenus selon l'état et les droits d'accès

### Histoire 1.5 : Groupes d’étudiants pour activités
**En tant que formateur, je veux regrouper les étudiants pour faire des activités**

**Tâches :**
- [ ] Créer l'UI de création et d'affectation de groupes
- [ ] Implémenter l'API de gestion des groupes (création, assignation, dissolution)
- [ ] Ajouter des stratégies d'affectation (aléatoire/critères)
- [ ] Tester la création et l'utilisation des groupes en séance

### Histoire 1.6 : Rejoindre une séance
**En tant que formateur ou étudiant, je veux rejoindre une séance afin de participer activement à la formation**

**Tâches :**
- [ ] Créer l'interface de sélection et de connexion à une séance
- [ ] Implémenter l'API de vérification des droits d'accès à la séance
- [ ] Ajouter la gestion de l'état de présence (connecté/déconnecté)
- [ ] Tester l'accès et la connexion aux séances selon les rôles

### Histoire 1.7 : Visualisation de la liste des séances
**En tant qu'admin, formateur ou étudiant, je veux voir la liste des séances afin de consulter le planning et les informations des cours**

**Tâches :**
- [ ] Créer l'interface de liste des séances avec filtres par session, module et statut
- [ ] Implémenter l'API de récupération des séances avec contrôle des permissions par rôle
- [ ] Ajouter les fonctionnalités de tri et de recherche (par titre, formateur, date)
- [ ] Différencier l'affichage selon le rôle (admin : toutes les séances, formateur : ses séances, étudiant : séances de ses sessions)
- [ ] Afficher les informations essentielles (titre, date/heure, formateur, statut, salle/lien)
- [ ] Tester l'affichage et les permissions selon les différents rôles

## ID 2 - Passage des quiz et évaluations

### Histoire 2.1 : Passage de quiz côté étudiant
**En tant qu’étudiant, je veux passer les quiz mis à disposition et consulter mes résultats pour vérifier mes connaissances**

**Tâches :**
- [ ] Créer l’interface de passage de quiz (navigation, minuterie, accessibilité)
- [ ] Implémenter la soumission et la correction automatique
- [ ] Afficher les résultats détaillés et le feedback
- [ ] Tester le flux complet de passage de quiz

### Histoire 2.2 : Consultation des résultats par le formateur
**En tant que formateur, je veux vérifier les résultats des étudiants afin de tester leur compréhension**

**Tâches :**
- [ ] Créer le tableau de bord des résultats avec filtres par session et module
- [ ] Implémenter l'API de récupération des résultats avec agrégation des scores
- [ ] Ajouter la fonctionnalité d'export des résultats en format CSV/Excel
- [ ] Tester l'affichage des résultats et les fonctionnalités d'export

## ID 3 - Outils de collaboration en ligne

### Histoire 3.1 : Réunions Jitsi Meet
**En tant que formateur ou étudiant, je veux utiliser Jitsi Meet pour les réunions à distance et visioconférences pour faciliter la participation aux cours planifiés**

**Tâches :**
- [ ] Intégrer la création automatique de salles Jitsi pour chaque séance
- [ ] Créer l'interface de gestion des réunions avec bouton "Rejoindre"
- [ ] Implémenter l'authentification sécurisée des utilisateurs dans les réunions
- [ ] Tester la création des salles et l'accès aux réunions

### Histoire 3.2 : Tableau blanc interactif
**En tant que formateur, je veux utiliser un tableau blanc interactif pour mes présentations pour illustrer les concepts enseignés**

**Tâches :**
- [ ] Intégrer l’outil de tableau blanc (synchro temps réel)
- [ ] Gérer permissions (éditeur/lecteur) et historique
- [ ] Sauvegarder/exporter les tableaux (PDF/PNG)
- [ ] Tester la collaboration et la persistance

