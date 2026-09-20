# 04 — Sécurité et fonctionnement hors-ligne

## 1. Objectif

La tablette peut contenir temporairement des informations nominatives et des résultats d'évaluation. La sécurité locale fait donc partie de l'architecture, et non d'une étape ajoutée après le développement.

## 2. Stockage

### Production native

- SQLite chiffré avec SQLCipher ;
- chiffrement AES-256 fourni par SQLCipher ;
- clé de base générée sur le terminal ;
- clé conservée via Android Keystore / iOS Keychain ;
- aucun secret dans le code source ;
- aucun secret dans LocalStorage.

### Mode web / PWA

Le mode navigateur peut être utile pour le développement, la démonstration ou des usages non sensibles.

Il ne doit pas être considéré comme équivalent au mode natif chiffré tant qu'un niveau de protection identique n'est pas démontré.

## 3. Coffre sécurisé

Une abstraction `SecureVault` est prévue.

Elle stocke uniquement les éléments sensibles :

- clé de chiffrement de la base ;
- jeton ou secret LRS ;
- éventuel identifiant de terminal ;
- paramètres cryptographiques.

L'implémentation doit utiliser les mécanismes natifs du système. Si aucun plugin validé n'est retenu, un petit plugin Capacitor interne sera développé pour interfacer Keystore / Keychain.

## 4. Verrouillage de l'application

Options prévues :

- verrouillage après inactivité ;
- code PIN applicatif selon politique ;
- biométrie si autorisée par l'environnement ;
- effacement des secrets de la mémoire applicative après verrouillage.

## 5. Réseau

- HTTPS obligatoire ;
- validation de certificat active ;
- aucun mode « TLS insecure » en production ;
- configuration compatible avec une PKI interne ;
- possibilité future de mTLS si imposé ;
- aucun secret journalisé.

## 6. Dépendances externes

L'application terrain ne charge aucune ressource depuis Internet :

- pas de CDN ;
- pas de Google Fonts ;
- pas de bibliothèque chargée dynamiquement ;
- pas de télémétrie externe ;
- pas de service analytics tiers.

Toutes les dépendances sont compilées dans le package.

## 7. Journalisation

Deux niveaux :

### Journal fonctionnel

Permet la traçabilité minimale :

- création/modification d'une évaluation ;
- publication d'une version de formulaire ;
- synchronisation.

### Journal technique

Permet le diagnostic :

- erreur SQLite ;
- échec xAPI ;
- erreur de migration ;
- version de l'application.

Les journaux ne doivent pas contenir de secret et doivent limiter les données personnelles.

## 8. Intégrité

Pour chaque évaluation finalisée :

- horodatage ;
- version du formulaire ;
- identifiants UUID ;
- statut de synchronisation ;
- payload xAPI figé au moment de la mise en file.

Une évaluation déjà synchronisée ne doit pas être modifiée silencieusement. Toute correction doit être explicitement tracée.

## 9. Sauvegarde locale

Les exports de sauvegarde contenant des données nominatives doivent être chiffrés et protégés par un mécanisme distinct de la base active.

Les exports non chiffrés CSV/XLSX, s'ils sont ajoutés, doivent être considérés comme des exports métier explicites et soumis à une action volontaire de l'utilisateur.

## 10. Menaces prises en compte dès le MVP

- perte ou vol de la tablette ;
- coupure réseau en plein envoi ;
- fermeture brutale de l'application ;
- batterie déchargée ;
- double clic ou double envoi ;
- formulaire modifié après une évaluation ;
- corruption ou migration de base ;
- secret LRS exposé par erreur ;
- installation d'une version applicative incompatible avec une base existante.
