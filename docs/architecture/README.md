# Étude d'architecture — S.E.A.F.

**Projet :** Système d'Évaluation Autonome des Formations  
**Statut :** Proposition d'architecture v0 — à valider avant développement  
**Date :** 20 septembre 2026

Ce dossier contient l'étude initiale du projet S.E.A.F. Aucun choix de code applicatif n'est considéré comme définitif tant que l'architecture globale n'a pas été validée.

## Documents

1. [Architecture proposée](./01-etude-architecture.md)
2. [Modèle de données local](./02-modele-donnees.md)
3. [Synchronisation xAPI / LRS](./03-synchronisation-xapi.md)
4. [Sécurité et fonctionnement hors-ligne](./04-securite-offline.md)
5. [Roadmap et points à valider](./05-roadmap-validation.md)

## Principe directeur

S.E.A.F. doit rester utilisable en autonomie complète, sans dépendance réseau, serveur applicatif ou service cloud pour les fonctions terrain : consultation des classes, formulaires, chronomètres, saisie, sauvegarde et statistiques locales.

Le réseau n'est nécessaire que pour les fonctions explicitement connectées, notamment la synchronisation vers un LRS.
