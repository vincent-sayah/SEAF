# 05 — Roadmap et points de validation

## 1. État actuel

Le dépôt est en phase d'étude.

Aucun code applicatif ne doit être généré avant validation de l'architecture v0.

## 2. Décisions proposées à valider

### A. Packaging

**Proposition :** Capacitor comme cible de production tablette, PWA comme cible secondaire.

### B. Base locale

**Proposition :** SQLite chiffré SQLCipher en production, derrière une interface de stockage interne.

### C. Frontend

**Proposition :** React + TypeScript + Ionic React pour une interface tactile.

### D. xAPI

**Proposition :** adaptateur compatible 1.0.3 et 2.0, version sélectionnable par configuration ; profil SEAF documenté.

### E. Architecture serveur

**Proposition :** aucun backend SEAF dans le MVP. La tablette fonctionne seule et synchronise directement vers le LRS.

### F. Synchronisation

**Proposition :** outbox durable, UUID stables, synchronisation manuelle avec aide à la détection réseau.

## 3. Questions à trancher avant scaffolding

1. Quelle est la plateforme des tablettes de production : Android, iPadOS, Windows ou mixte ?
2. Un formateur utilise-t-il une tablette personnelle/nominative ou une tablette partagée ?
3. Comment l'élève est-il identifié : matricule, identifiant LMS, autre identifiant pseudonymisé ?
4. Les classes doivent-elles être importées depuis CSV, XLSX, les deux, ou un système source ?
5. Plusieurs tablettes doivent-elles pouvoir évaluer simultanément la même classe ?
6. Quelle authentification est disponible côté LRS : Basic, OAuth2/OIDC, jeton statique, mTLS ?
7. Le LRS cible accepte-t-il xAPI 1.0.3, xAPI 2.0, ou les deux ?
8. Les données doivent-elles être supprimées automatiquement de la tablette après synchronisation et délai de rétention ?
9. Un export PDF/CSV des résultats est-il requis sur le terrain ?
10. Une signature/validation finale du formateur est-elle nécessaire avant synchronisation ?

## 4. Plan de réalisation proposé après validation

### Phase 0 — Prototype technique

- création du projet React/Ionic/Capacitor ;
- ouverture/fermeture SQLite ;
- chiffrement SQLCipher ;
- migration de schéma ;
- test de redémarrage tablette ;
- test sans réseau ;
- test du coffre sécurisé ;
- envoi d'un statement xAPI de test.

**Critère de sortie :** démontrer que les données persistent après redémarrage et qu'une évaluation créée hors-ligne peut être synchronisée ensuite sans duplication.

### Phase 1 — Socle métier

- classes ;
- élèves ;
- import ;
- formulaires et versionnement ;
- types de champs ;
- évaluations ;
- chronomètre.

### Phase 2 — Terrain

- ergonomie tablette ;
- saisie rapide par élève ;
- autosauvegarde transactionnelle ;
- reprise après interruption ;
- filtres et recherche.

### Phase 3 — xAPI

- profil SEAF ;
- outbox ;
- configuration LRS ;
- synchronisation ;
- reprise sur erreur ;
- journal technique.

### Phase 4 — Analytics local

- moyenne de classe ;
- distribution des notes ;
- classements si autorisés ;
- temps moyens ;
- progression entre évaluations ;
- graphiques offline.

### Phase 5 — Durcissement

- sécurité ;
- tests E2E offline ;
- tests de coupure réseau ;
- tests de migration ;
- audit dépendances ;
- documentation d'exploitation ;
- packaging tablette.

## 5. Structure Git proposée

```text
main
  └── stable

develop
  └── intégration continue

feature/*
  └── développement fonctionnel

study/*
  └── études et prototypes d'architecture
```

Pour un projet de taille limitée, une variante plus simple avec `main` + branches `feature/*` reste possible. Le workflow sera fixé avant le premier scaffold.

## 6. Definition of Done spécifique offline

Une fonctionnalité métier n'est pas terminée si elle :

- dépend du réseau pour s'afficher ;
- perd des données après fermeture forcée ;
- écrit uniquement dans l'état React ;
- ne passe pas par une transaction persistante ;
- ne dispose pas d'un test hors-ligne ;
- crée un doublon après reprise d'une synchronisation interrompue.
