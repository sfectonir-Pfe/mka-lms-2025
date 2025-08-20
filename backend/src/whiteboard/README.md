# Whiteboard Module

Ce module gère toutes les fonctionnalités liées au tableau blanc collaboratif en temps réel.

## Structure

```
whiteboard/
├── whiteboard.gateway.ts      # Gateway WebSocket pour la communication temps réel
├── whiteboard.service.ts      # Service pour la logique métier
├── whiteboard.controller.ts   # Contrôleur REST API
├── whiteboard.module.ts       # Module NestJS
├── entities/                  # Entités Prisma
├── dto/                      # Data Transfer Objects
└── README.md                 # Documentation
```

## WhiteboardGateway

Le `WhiteboardGateway` gère toute la communication WebSocket pour le tableau blanc collaboratif.

### Événements gérés

#### Rejoindre/Quitter une séance
- `join-seance` : Rejoint une salle de séance et synchronise le tableau blanc
- `leave-seance` : Quitte une salle de séance

#### Actions de dessin
- `whiteboard-action` : Gère toutes les actions de dessin (stylo, formes, texte, tableaux)
- `whiteboard-clear` : Efface tout le contenu du tableau blanc
- `whiteboard-delete` : Supprime des éléments spécifiques

#### Opérations d'historique
- `whiteboard-undo` : Annule la dernière action
- `whiteboard-redo` : Rétablit une action annulée

#### Présence utilisateur
- `whiteboard-user-joined` : Notifie quand un utilisateur rejoint
- `whiteboard-user-left` : Notifie quand un utilisateur quitte

#### Fonctionnalités collaboratives
- `whiteboard-cursor-move` : Partage la position du curseur entre utilisateurs

### Exemple d'utilisation

```typescript
// Côté client (frontend)
const socket = io('http://localhost:3000');

// Rejoindre une séance
socket.emit('join-seance', 123);

// Écouter la synchronisation initiale
socket.on('whiteboard-sync', (actions) => {
  console.log('Actions synchronisées:', actions);
});

// Envoyer une action de dessin
socket.emit('whiteboard-action', {
  seanceId: 123,
  type: 'draw',
  data: { color: '#000000', points: [[0, 0], [10, 10]] },
  createdById: 456
});

// Écouter les nouvelles actions
socket.on('whiteboard-action', (action) => {
  console.log('Nouvelle action reçue:', action);
});
```

### Fonctionnalités avancées

#### Gestion des erreurs
Le gateway inclut une gestion robuste des erreurs avec des logs détaillés pour faciliter le débogage.

#### Performance
- Utilisation de rooms Socket.IO pour isoler les communications par séance
- Gestion optimisée des événements pour éviter les fuites mémoire

#### Sécurité
- Validation des données d'entrée
- Gestion des permissions utilisateur (à implémenter selon vos besoins)

## Migration depuis ChatGateway

La logique whiteboard a été extraite du `ChatGateway` pour :
- **Séparation des responsabilités** : Chat et Whiteboard sont maintenant indépendants
- **Maintenabilité** : Code plus facile à maintenir et tester
- **Évolutivité** : Possibilité d'ajouter des fonctionnalités spécifiques au whiteboard
- **Performance** : Réduction de la complexité du ChatGateway

### Changements nécessaires côté frontend

Si vous utilisez le frontend, assurez-vous que les événements WebSocket pointent vers le bon gateway. Les noms d'événements restent les mêmes, seule l'architecture backend a changé.
