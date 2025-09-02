# Sprint 4 - Backlog des tâches par histoire utilisateur

## ID 1 - Système de messagerie collaborative

### Histoire 1.1 : Chat général (communauté)
**En tant qu’utilisateur, je veux envoyer des messages dans un chat général pour échanger avec toute la communauté.**

**Tâches :**
- [ ] Implémenter l’UI du chat général (liste + input, état lu/non-lu)
- [ ] Exposer/brancher l’API temps réel pour messages du chat général
- [ ] Gérer la persistance (Pièces jointes, pagination, modération basique)
- [ ] Tester l’envoi/réception temps réel et la persistance

### Histoire 1.2 : Chat par programme
**En tant que participant, je veux échanger dans un chat dédié à mon programme afin de discuter des cours et des modules.**

**Tâches :**
- [ ] Implémenter l’UI du chat par programme (sélecteur programme, vue messages)
- [ ] Exposer/brancher l’API temps réel scoping par programme (accès/permissions)
- [ ] Gérer l’historique, mentions et notifications par programme
- [ ] Tester les droits d’accès, la diffusion et l’archivage

### Histoire 1.3 : Chat par session
**En tant que participant, je veux communiquer dans le chat spécifique à ma session pour partager des informations et questions avec les autres membres.**

**Tâches :**
- [ ] Implémenter l’UI du chat de session (contextualisation session)
- [ ] Brancher l’API temps réel scoping par session (adhésion, rôles)
- [ ] Ajouter pièces jointes/lien de séance et recherche dans l’historique
- [ ] Tester l’isolation des sessions et la livraison temps réel

## ID 2 - Gestion des feedbacks pédagogiques

### Histoire 2.1 : Feedback pair-à-pair étudiant
**En tant qu’étudiant, je veux donner un feedback à mes pairs et recevoir des retours pour partager des avis constructifs et améliorer l’apprentissage.**

**Tâches :**
- [ ] Créer l’UI de soumission/consultation de feedback pair-à-pair
- [ ] Implémenter l’API de création/lecture avec règles de visibilité
- [ ] Ajouter notation/étiquettes et signalement d’abus
- [ ] Tester la création, l’affichage et les contrôles de visibilité

### Histoire 2.2 : Feedback personnalisé formateur
**En tant que formateur, je veux envoyer un feedback personnalisé aux étudiants pour les guider dans leur progression pédagogique.**

**Tâches :**
- [ ] Créer l’UI formateur pour cibler un étudiant et saisir le feedback
- [ ] Implémenter l’API d’envoi et d’historisation du feedback formateur→étudiant
- [ ] Déclencher notification (in-app/email optionnelle) au destinataire
- [ ] Tester l’envoi, la réception et la confidentialité

### Histoire 2.3 : Feedback session/séance
**En tant qu’étudiant, je veux soumettre un feedback sur une session et/ou séance pour évaluer son organisation, son contenu et la qualité de son déroulement.**

**Tâches :**
- [ ] Créer le formulaire structuré (rubriques, notes, commentaires) session/séance
- [ ] Implémenter l’API et le modèle (lien session/séance, auteur, anonymat optionnel)
- [ ] Ajouter agrégations basiques (moyennes, tendances)
- [ ] Tester la soumission et le calcul des agrégats

### Histoire 2.4 : Liste des feedbacks
**En tant qu’administrateur ou formateur, je veux voir la liste des feedbacks de séances et de sessions afin d’analyser les retours et identifier des pistes d’amélioration.**

**Tâches :**
- [ ] Créer l’UI de liste (filtres session/séance, pagination)
- [ ] Implémenter l’API de listing et agrégations (moyennes par séance, par session, et par programme selon sessions associées)
- [ ] Afficher les détails et les moyennes: par séance, moyenne des séances, par session; pour admin, moyenne par programme selon sessions
- [ ] Tester l’affichage, les filtres et les droits d’accès

## ID 3 - Gestion des réclamations et suivi

### Histoire 3.1 : Soumission de réclamations
**En tant qu’utilisateur, je veux soumettre une ou des réclamations afin de m’assurer que mes demandes sont prises en compte.**

**Tâches :**
- [ ] Créer l’UI de soumission et de suivi (statut, pièces jointes)
- [ ] Implémenter l’API de création et listing personnel (sécurité/permissions)
- [ ] Ajouter messagerie interne/commentaires dans la réclamation
- [ ] Tester la création, le suivi et les règles d’accès

### Histoire 3.2 : Traitement et résolution des réclamations
**En tant qu’administrateur, je veux gérer, analyser et résoudre les réclamations des utilisateurs afin d’assurer un suivi efficace.**

**Tâches :**
- [ ] Créer le tableau de traitement (file, priorités, filtres, assignation)
- [ ] Implémenter les transitions d’état avec journalisation (audit)
- [ ] Générer rapports (par période, type, temps de résolution)
- [ ] Tester le cycle de vie complet et les rapports

## ID 4 - Assistant intelligent d’aide et de recommandations

### Histoire 4.1 : Assistance IA conversationnelle
**En tant qu’utilisateur, je veux interroger l’assistant IA pour obtenir une aide personnalisée et instantanée.**

**Tâches :**
- [ ] Créer l’UI chat assistant (contexte, suggestions)
- [ ] Intégrer le backend chatbot avec garde-fous (rôles, limites)
- [ ] Ajouter persistance du fil et feedback utile/pas utile
- [ ] Tester les réponses, la persistance et les limites d’usage

## ID 5 - Système de notifications en temps réel

### Histoire 5.1 : Alertes nouveaux messages de chat
**En tant qu’utilisateur, je veux être alerté quand un message est posté dans un de mes chats pour suivre les échanges sans délai.**

**Tâches :**
- [ ] Brancher les événements temps réel (Socket) sur général/programme/session
- [ ] Créer le centre de notifications (badge, liste, lu/non-lu)
- [ ] Gérer préférences (activer/désactiver par canal, anti-spam)
- [ ] Tester la réception et l’expérience multi-onglets/appareils

## ID 6 - Système de notifications automatisées par email

### Histoire 6.1 : Email à la résolution d’une réclamation
**En tant qu’utilisateur, je veux recevoir un email quand ma réclamation est résolue afin d’être informé de la décision.**

**Tâches :**
- [ ] Créer le template email « réclamation résolue » (résumé + lien)
- [ ] Déclencher l’envoi sur transition d’état → résolu
- [ ] Journaliser les envois et gérer les erreurs de livraison
- [ ] Tester l’envoi conditionnel et le contenu

### Histoire 6.2 : Email de feedback pair-à-pair
**En tant qu’étudiant, quand je fais un feedback à un autre étudiant, celui-ci reçoit un email contenant le feedback de son pair.**

**Tâches :**
- [ ] Créer le template email « feedback pair-à-pair » (contenu + lien de consultation)
- [ ] Déclencher l’envoi à la création du feedback (contrôle permissions/opt-in)
- [ ] Inclure résumé, auteur, contexte (session/séance) et lien vers le détail
- [ ] Tester l’envoi, le contenu et les cas d’erreur

### Histoire 6.3 : Email de feedback formateur → étudiant
**En tant que formateur, quand je fais un feedback à un étudiant, l’étudiant reçoit le feedback par email.**

**Tâches :**
- [ ] Créer le template email « feedback formateur » (contenu + contexte)
- [ ] Déclencher l’envoi à la soumission du feedback formateur (règles de confidentialité)
- [ ] Inclure résumé, formateur, contexte (session/séance) et lien vers le détail
- [ ] Tester l’envoi, la confidentialité et les erreurs de livraison

