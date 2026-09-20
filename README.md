# S.E.A.F.

**Système d'Évaluation Autonome des Formations**

Application d'évaluation pédagogique offline-first destinée aux formateurs de la Marine Nationale, conçue pour fonctionner sur tablette en environnement terrain sans connexion réseau permanente.

## Objectifs

S.E.A.F. doit permettre :

- la gestion de classes, spécialités et sessions ;
- l'import et la gestion d'élèves ;
- la création de formulaires d'évaluation dynamiques ;
- la saisie terrain totalement hors-ligne ;
- la persistance locale sécurisée ;
- la production de statistiques locales ;
- la synchronisation différée vers un LRS au format xAPI.

## Architecture validée

La cible de production est une application installée basée sur :

- React + TypeScript ;
- Ionic React ;
- Capacitor ;
- SQLite + SQLCipher sur tablette native ;
- IndexedDB uniquement pour le développement web ;
- génération et mise en file des statements xAPI avant synchronisation.

L'application ne dépend pas d'un backend SEAF pour fonctionner sur le terrain.

## État du projet

Le projet est actuellement en **Phase 0 — socle technique**.

Cette phase valide :

- le fonctionnement React/Ionic/Capacitor ;
- le stockage local ;
- le chiffrement natif SQLCipher ;
- la persistance après fermeture/redémarrage ;
- le fonctionnement sans réseau ;
- la génération locale d'un statement xAPI.

Voir [la documentation Phase 0](docs/phase0/README.md).

L'étude d'architecture complète se trouve dans [docs/architecture](docs/architecture/README.md).

## Développement web

Prérequis : Node.js 22.

```bash
npm install
npm run dev
```

Le mode navigateur utilise IndexedDB. Il est destiné au développement et à la démonstration.

## Tests et build

```bash
npm test
npm run build
```

## Android

Après installation des dépendances :

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

La base locale native est configurée avec SQLCipher.

## iOS

```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Sécurité

Les principes structurants sont :

- aucune dépendance réseau pour les fonctions terrain ;
- aucune donnée métier stockée uniquement dans l'état React ;
- chiffrement de la base native ;
- aucun secret LRS dans le dépôt ;
- HTTPS obligatoire lors des futures synchronisations ;
- aucune ressource CDN nécessaire à l'application installée.

## Branches

- `main` : versions validées ;
- `phase0-foundation` : socle technique en cours de validation ;
- futures branches `feature/*` : fonctionnalités métier.

## Licence

Le statut de licence et les règles de diffusion seront définis avant la première version de production.
