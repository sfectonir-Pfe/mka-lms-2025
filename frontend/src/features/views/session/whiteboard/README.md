# Tableau Blanc - Contrôles de Tableau

## Nouvelles Fonctionnalités

### 1. Contrôles d'Ajout de Lignes/Colonnes

Quand un tableau est sélectionné, deux boutons (+) apparaissent dans le coin supérieur gauche :

- **Bouton (+) horizontal** : Ajoute une nouvelle ligne au tableau
- **Bouton (+) vertical** : Ajoute une nouvelle colonne au tableau

### 2. Poignées de Redimensionnement

Le tableau sélectionné affiche des poignées de redimensionnement :

#### Coins (ronds avec icône de redimensionnement)
- **Coin supérieur gauche** : Redimensionne en diagonale (nw-resize)
- **Coin supérieur droit** : Redimensionne en diagonale (ne-resize)
- **Coin inférieur gauche** : Redimensionne en diagonale (sw-resize)
- **Coin inférieur droit** : Redimensionne en diagonale (se-resize)

#### Milieux des côtés (rectangulaires avec lignes)
- **Milieu du côté supérieur** : Redimensionne verticalement (n-resize)
- **Milieu du côté gauche** : Redimensionne horizontalement (w-resize)
- **Milieu du côté droit** : Redimensionne horizontalement (e-resize)
- **Milieu du côté inférieur** : Redimensionne verticalement (s-resize)

### 3. Poignée de Déplacement

Une poignée centrale avec une icône de déplacement permet de déplacer le tableau entier.

## Utilisation

### Sélection d'un Tableau
1. Utilisez l'outil **Sélection** (S)
2. Cliquez sur un tableau existant
3. Les contrôles apparaîtront automatiquement

### Ajout de Lignes/Colonnes
1. Sélectionnez un tableau
2. Cliquez sur le bouton (+) approprié
3. La ligne/colonne sera ajoutée avec des cellules vides

### Redimensionnement
1. Sélectionnez un tableau
2. Cliquez et faites glisser une poignée de redimensionnement
3. Relâchez pour finaliser la taille

### Déplacement
1. Sélectionnez un tableau
2. Cliquez et faites glisser la poignée centrale
3. Relâchez pour finaliser la position

## Raccourcis Clavier

- **S** : Outil de sélection
- **Escape** : Annule toutes les opérations en cours
- **Delete/Backspace** : Supprime les éléments sélectionnés

## États de l'Interface

- **Curseur normal** : Aucune opération en cours
- **Curseur de redimensionnement** : Redimensionnement en cours
- **Curseur de déplacement** : Déplacement en cours

## Synchronisation en Temps Réel

Toutes les modifications de tableau sont automatiquement synchronisées avec les autres utilisateurs via Socket.IO.

## Compatibilité

- Fonctionne sur desktop et mobile
- Supporte le zoom et le déplacement de la vue
- Préserve le contenu des cellules lors des modifications
